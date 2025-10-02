import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface OrderCompletionData {
  orderId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  companyName?: string;
  country?: string;
  serviceType: string;
  amount: number;
  stripeSessionId: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const orderData: OrderCompletionData = await req.json();
    
    const {
      orderId,
      customerEmail,
      customerName,
      customerPhone,
      companyName,
      country,
      serviceType,
      amount,
      stripeSessionId
    } = orderData;

    // Validate required fields
    if (!orderId || !customerEmail || !customerName || !serviceType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Split customer name
    const nameParts = customerName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', customerEmail)
      .single();

    let userId: string;
    let isNewUser = false;
    let tempPassword = '';

    if (existingUser) {
      userId = existingUser.id;
      console.log(`User already exists: ${customerEmail}`);
    } else {
      // Generate a temporary password (user will need to reset it)
      tempPassword = generateTempPassword();
      const bcrypt = await import('https://deno.land/x/bcrypt@v0.4.1/mod.ts');
      const hashedPassword = await bcrypt.hash(tempPassword);

      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          email: customerEmail,
          password_hash: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          phone: customerPhone,
          role: 'client',
          is_active: true,
          email_verified: false
        })
        .select('id')
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user account' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      userId = newUser.id;
      isNewUser = true;

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          company_name: companyName,
          country: country || 'Unknown',
          language: 'en',
          notification_preferences: {
            email: true,
            sms: false,
            push: true
          }
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't fail the process if profile creation fails
      }

      console.log(`New user created: ${customerEmail} with ID: ${userId}`);
    }

    // Update or create service order
    const { data: existingOrder } = await supabase
      .from('service_orders')
      .select('id')
      .eq('id', orderId)
      .single();

    if (existingOrder) {
      // Update existing order with user ID and payment info
      const { error: updateError } = await supabase
        .from('service_orders')
        .update({
          user_id: userId,
          status: 'paid',
          payment_status: 'completed',
          stripe_session_id: stripeSessionId,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating service order:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    } else {
      // Create new service order
      const { error: orderError } = await supabase
        .from('service_orders')
        .insert({
          id: orderId,
          user_id: userId,
          service_type: serviceType,
          amount: amount,
          currency: 'USD',
          status: 'paid',
          payment_status: 'completed',
          stripe_session_id: stripeSessionId,
          paid_at: new Date().toISOString(),
          order_details: {
            customer_name: customerName,
            customer_email: customerEmail,
            customer_phone: customerPhone,
            company_name: companyName,
            country: country
          }
        });

      if (orderError) {
        console.error('Error creating service order:', orderError);
        return new Response(
          JSON.stringify({ error: 'Failed to create order' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // Assign consultant (simple round-robin assignment)
    const { data: consultants } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'consultant')
      .eq('is_active', true);

    let assignedConsultantId = null;
    if (consultants && consultants.length > 0) {
      // Simple assignment logic - you can make this more sophisticated
      const randomIndex = Math.floor(Math.random() * consultants.length);
      assignedConsultantId = consultants[randomIndex].id;

      // Update order with assigned consultant
      await supabase
        .from('service_orders')
        .update({ consultant_id: assignedConsultantId })
        .eq('id', orderId);
    }

    // Create initial project if needed
    if (serviceType.includes('company_formation') || serviceType.includes('business_setup')) {
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          name: `${serviceType.replace('_', ' ').toUpperCase()} - ${companyName || customerName}`,
          description: `Project for ${serviceType} service`,
          client_user_id: userId,
          consultant_id: assignedConsultantId,
          status: 'active',
          start_date: new Date().toISOString(),
          service_order_id: orderId
        });

      if (projectError) {
        console.error('Error creating project:', projectError);
        // Don't fail the process if project creation fails
      }
    }

    // Send welcome email if new user
    if (isNewUser) {
      try {
        await sendWelcomeEmail(customerEmail, customerName, tempPassword);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the process if email sending fails
      }
    }

    // Log the registration/order completion
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: isNewUser ? 'user_auto_registered' : 'order_completed',
        details: {
          order_id: orderId,
          service_type: serviceType,
          amount: amount,
          stripe_session_id: stripeSessionId,
          is_new_user: isNewUser,
          assigned_consultant_id: assignedConsultantId
        }
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: isNewUser ? 'User registered and order created successfully' : 'Order updated successfully',
        user_id: userId,
        order_id: orderId,
        is_new_user: isNewUser,
        assigned_consultant_id: assignedConsultantId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Auto registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateTempPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function sendWelcomeEmail(email: string, name: string, tempPassword: string): Promise<void> {
  // TODO: Implement email sending using your preferred email service
  // This could be SendGrid, AWS SES, Resend, etc.
  
  const emailData = {
    to: email,
    subject: 'Welcome to Consulting19 - Your Account is Ready',
    html: `
      <h1>Welcome to Consulting19, ${name}!</h1>
      <p>Your account has been automatically created following your recent order.</p>
      <p><strong>Login Details:</strong></p>
      <ul>
        <li>Email: ${email}</li>
        <li>Temporary Password: ${tempPassword}</li>
      </ul>
      <p>Please log in and change your password immediately for security.</p>
      <p><a href="${Deno.env.get('CLIENT_URL')}/login">Login to your account</a></p>
      <p>If you have any questions, please contact our support team.</p>
    `
  };

  // Example with fetch to an email service
  // await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(emailData)
  // });

  console.log('Welcome email would be sent to:', email);
}