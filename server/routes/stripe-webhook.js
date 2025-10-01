import express from 'express';
import Stripe from 'stripe';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// POST /webhook/stripe - Handle Stripe webhooks
// IMPORTANT: This route MUST use raw body parser (applied in server setup)
router.post('/', async (req, res) => {
  // Check if Stripe is configured
  if (!stripe || !webhookSecret) {
    console.error('Stripe not configured - missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ 
      error: 'Stripe not configured',
      message: 'Missing Stripe API keys' 
    });
  }

  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handleInvoicePayment(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
});

// Handle checkout.session.completed event
async function handleCheckoutCompleted(session) {
  console.log('Processing checkout session:', session.id);
  
  const client = await pool.connect();
  
  try {
    // IDEMPOTENCY CHECK: Prevent duplicate processing
    const existingOrderCheck = await client.query(
      'SELECT id FROM service_orders WHERE stripe_session_id = $1',
      [session.id]
    );
    
    if (existingOrderCheck.rows.length > 0) {
      console.log('Order already processed for session:', session.id);
      return;
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    const orderData = session.metadata?.orderData ? JSON.parse(session.metadata.orderData) : {};
    const customerEmail = session.customer_details?.email || orderData.userCredentials?.email;
    const customerName = session.customer_details?.name || 
      `${orderData.userCredentials?.firstName || ''} ${orderData.userCredentials?.lastName || ''}`.trim();
    const customerPhone = session.customer_details?.phone || orderData.userCredentials?.phone;
    
    // Find or create user
    let userId;
    const userResult = await client.query(
      'SELECT id FROM user_profiles WHERE email = $1',
      [customerEmail]
    );
    
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0].id;
    } else {
      // Create new user (auto-registration)
      const [firstName, ...lastNameParts] = customerName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      const newUserResult = await client.query(
        `INSERT INTO user_profiles (email, first_name, last_name, phone, role, created_at)
         VALUES ($1, $2, $3, $4, 'client', NOW())
         RETURNING id`,
        [customerEmail, firstName, lastName, customerPhone]
      );
      
      userId = newUserResult.rows[0].id;
      
      // Create client record
      await client.query(
        `INSERT INTO clients (
          profile_id, company_name, status, priority, created_at
        ) VALUES ($1, $2, 'active', 'medium', NOW())`,
        [
          userId, 
          orderData.dynamicCompanyData?.companyName || orderData.companyDetails?.companyName || 'Unknown Company'
        ]
      );
    }
    
    // Get client ID
    const clientResult = await client.query(
      'SELECT id, assigned_consultant_id FROM clients WHERE profile_id = $1',
      [userId]
    );
    
    if (clientResult.rows.length === 0) {
      await client.query('ROLLBACK');
      throw new Error('Client not found');
    }
    
    const clientId = clientResult.rows[0].id;
    let consultantId = clientResult.rows[0].assigned_consultant_id;
    
    // If no consultant assigned, find available consultant
    if (!consultantId) {
      const consultantResult = await client.query(
        `SELECT up.id FROM user_profiles up
         WHERE up.role = 'consultant'
         ORDER BY RANDOM()
         LIMIT 1`
      );
      
      if (consultantResult.rows.length > 0) {
        consultantId = consultantResult.rows[0].id;
        
        // Assign consultant to client
        await client.query(
          'UPDATE clients SET assigned_consultant_id = $1 WHERE id = $2',
          [consultantId, clientId]
        );
      }
    }
    
    // Calculate total amount
    const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
    
    // Create service order with ON CONFLICT for hard idempotency
    const orderResult = await client.query(
      `INSERT INTO service_orders (
        client_id, consultant_id, country_code, company_name,
        total_amount, currency, status, payment_status,
        stripe_session_id, order_data, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'completed', $7, $8, NOW())
      ON CONFLICT (stripe_session_id) DO NOTHING
      RETURNING id`,
      [
        clientId,
        consultantId,
        orderData.selectedCountry?.code || 'UNKNOWN',
        orderData.dynamicCompanyData?.companyName || orderData.companyDetails?.companyName || 'N/A',
        totalAmount,
        session.currency?.toUpperCase() || 'USD',
        session.id,
        JSON.stringify(orderData)
      ]
    );
    
    // If no rows returned, order already exists (conflict)
    if (orderResult.rows.length === 0) {
      await client.query('ROLLBACK');
      console.log('Order already exists for session (ON CONFLICT):', session.id);
      return;
    }
    
    const orderId = orderResult.rows[0].id;
    
    // Calculate commission (65% to consultant, 35% to system)
    if (consultantId && totalAmount > 0) {
      const consultantCommission = totalAmount * 0.65;
      const commissionRate = 0.65;
      
      // Check if there's a current period payout for this consultant
      const payoutResult = await client.query(
        `SELECT id FROM commission_payouts
         WHERE consultant_id = $1 
           AND status = 'pending'
           AND period_start <= CURRENT_DATE
           AND period_end >= CURRENT_DATE
         LIMIT 1`,
        [consultantId]
      );
      
      let payoutId;
      
      if (payoutResult.rows.length > 0) {
        payoutId = payoutResult.rows[0].id;
        
        // Update existing payout total
        await client.query(
          `UPDATE commission_payouts 
           SET total_amount = total_amount + $1
           WHERE id = $2`,
          [consultantCommission, payoutId]
        );
      } else {
        // Create new payout for current month
        const periodStart = new Date();
        periodStart.setDate(1);
        const periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, 0);
        
        const newPayoutResult = await client.query(
          `INSERT INTO commission_payouts (
            consultant_id, period_start, period_end, total_amount,
            commission_rate, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
          RETURNING id`,
          [consultantId, periodStart, periodEnd, consultantCommission, commissionRate]
        );
        
        payoutId = newPayoutResult.rows[0].id;
      }
      
      // Create commission payout item (FIXED: using purchase_id, not order_id)
      await client.query(
        `INSERT INTO commission_payout_items (
          payout_id, purchase_id, service_amount, commission_amount, created_at
        ) VALUES ($1, $2, $3, $4, NOW())`,
        [payoutId, orderId, totalAmount, consultantCommission]
      );
      
      console.log(`Commission created: $${consultantCommission} for consultant ${consultantId}`);
    }
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('Order processed successfully:', orderId);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in handleCheckoutCompleted:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Handle invoice.payment_succeeded event
async function handleInvoicePayment(invoice) {
  console.log('Processing invoice payment:', invoice.id);
  
  // Update subscription payment status if needed
  // This can be extended based on business requirements
}

// Handle customer.subscription.deleted event
async function handleSubscriptionCancellation(subscription) {
  console.log('Processing subscription cancellation:', subscription.id);
  
  // Update user subscription status if needed
  // This can be extended based on business requirements
}

export default router;
