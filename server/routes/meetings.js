import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

router.get('/', authenticateToken, requireRole('client'), async (req, res) => {
  try {
    const { id: userId } = req.user;

    const clientQuery = `
      SELECT id FROM clients WHERE profile_id = $1 LIMIT 1
    `;
    const clientResult = await pool.query(clientQuery, [userId]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const clientId = clientResult.rows[0].id;

    const meetingsQuery = `
      SELECT 
        m.id,
        m.title,
        m.description,
        m.start_time,
        m.end_time,
        m.status,
        m.meeting_url,
        0 as price_paid,
        'USD' as currency,
        up.first_name || ' ' || up.last_name as consultant_full_name
      FROM meetings m
      LEFT JOIN user_profiles up ON m.consultant_id = up.id
      WHERE m.client_id = $1
      ORDER BY m.start_time DESC
    `;

    const meetingsResult = await pool.query(meetingsQuery, [clientId]);

    const meetings = meetingsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      start_time: row.start_time,
      end_time: row.end_time,
      status: row.status,
      price_paid: parseFloat(row.price_paid) || 0,
      currency: row.currency,
      meeting_url: row.meeting_url,
      consultant: {
        full_name: row.consultant_full_name || 'Unassigned'
      },
      department: {
        name: 'General Consulting'
      }
    }));

    res.json({ meetings });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, requireRole('client'), async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { consultant_id, title, description, start_time, end_time, slot_duration } = req.body;

    if (!consultant_id || !title || !start_time || !end_time) {
      return res.status(400).json({ error: 'Missing required fields: consultant_id, title, start_time, end_time' });
    }

    const clientQuery = `
      SELECT id FROM clients WHERE profile_id = $1 LIMIT 1
    `;
    const clientResult = await pool.query(clientQuery, [userId]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const clientId = clientResult.rows[0].id;

    const duration = slot_duration || 60;
    const pricePerHour = 150;
    const calculatedPrice = (pricePerHour / 60) * duration;

    const insertQuery = `
      INSERT INTO meetings (
        client_id, 
        consultant_id, 
        title, 
        description, 
        start_time, 
        end_time, 
        status, 
        meeting_type,
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      clientId,
      consultant_id,
      title,
      description || '',
      start_time,
      end_time,
      'scheduled',
      'consultation'
    ]);

    const meeting = result.rows[0];

    res.status(201).json({
      meeting: {
        id: meeting.id,
        title: meeting.title,
        description: meeting.description,
        start_time: meeting.start_time,
        end_time: meeting.end_time,
        status: meeting.status,
        price_paid: calculatedPrice,
        currency: 'USD',
        meeting_url: meeting.meeting_url
      }
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/meetings/available/:consultantId - Get available time slots
router.get('/available/:consultantId', authenticateToken, async (req, res) => {
  try {
    const { consultantId } = req.params;
    const { date } = req.query; // YYYY-MM-DD format

    if (!date) {
      return res.status(400).json({ error: 'Date parameter required' });
    }

    const dayOfWeek = new Date(date).getDay(); // 0=Sunday, 1=Monday
    const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0=Monday

    // Get consultant's availability for this day
    const availabilityResult = await pool.query(
      `SELECT start_time, end_time 
       FROM consultant_availability 
       WHERE consultant_id = $1 AND day_of_week = $2 AND status = 'available'
       ORDER BY start_time`,
      [consultantId, adjustedDay]
    );

    if (availabilityResult.rows.length === 0) {
      return res.json({ success: true, slots: [] });
    }

    // Get booked meetings for this date
    const bookedResult = await pool.query(
      `SELECT start_time, end_time 
       FROM meetings 
       WHERE consultant_id = $1 
         AND DATE(start_time) = $2 
         AND status IN ('scheduled', 'confirmed')
       ORDER BY start_time`,
      [consultantId, date]
    );

    // Get blocked times for this date
    const blockedResult = await pool.query(
      `SELECT start_time, end_time 
       FROM blocked_times 
       WHERE consultant_id = $1 
         AND DATE(start_time) <= $2 
         AND DATE(end_time) >= $2`,
      [consultantId, date]
    );

    // Generate available slots (30min intervals)
    const slots = [];
    const availability = availabilityResult.rows[0];
    const [startHour, startMin] = availability.start_time.split(':').map(Number);
    const [endHour, endMin] = availability.end_time.split(':').map(Number);

    let currentTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    while (currentTime < endTime) {
      const slotStart = new Date(`${date}T${String(Math.floor(currentTime / 60)).padStart(2, '0')}:${String(currentTime % 60).padStart(2, '0')}:00`);
      const slotEnd = new Date(slotStart.getTime() + 30 * 60000); // 30 min slot

      // Check if slot is not booked or blocked
      const isBooked = bookedResult.rows.some(b => {
        const bookStart = new Date(b.start_time);
        const bookEnd = new Date(b.end_time);
        return slotStart < bookEnd && slotEnd > bookStart;
      });

      const isBlocked = blockedResult.rows.some(b => {
        const blockStart = new Date(b.start_time);
        const blockEnd = new Date(b.end_time);
        return slotStart < blockEnd && slotEnd > blockStart;
      });

      if (!isBooked && !isBlocked) {
        slots.push({
          start_time: slotStart.toISOString(),
          end_time: slotEnd.toISOString(),
          duration_minutes: 30
        });
      }

      currentTime += 30; // Move to next 30min slot
    }

    res.json({ success: true, slots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

// POST /api/meetings/book - Create booking with Stripe payment
router.post('/book', authenticateToken, async (req, res) => {
  try {
    const { 
      consultant_id, 
      start_time, 
      duration_minutes, 
      meeting_topic, 
      title 
    } = req.body;

    if (!consultant_id || !start_time || !duration_minutes) {
      return res.status(400).json({ 
        error: 'Missing required fields: consultant_id, start_time, duration_minutes' 
      });
    }

    // Get pricing for this duration
    const pricingResult = await pool.query(
      `SELECT price, currency FROM meeting_pricing 
       WHERE consultant_id = $1 AND duration_minutes = $2 AND is_active = true`,
      [consultant_id, duration_minutes]
    );

    if (pricingResult.rows.length === 0) {
      return res.status(400).json({ error: 'No pricing found for this duration' });
    }

    const { price, currency } = pricingResult.rows[0];

    // Get consultant settings for meeting URL
    const settingsResult = await pool.query(
      'SELECT video_meeting_url FROM consultant_settings WHERE consultant_id = $1',
      [consultant_id]
    );

    const meeting_url = settingsResult.rows[0]?.video_meeting_url;

    // Create Stripe checkout session
    const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: title || `${duration_minutes}min Consultation`,
            description: meeting_topic || 'Business Consultation'
          },
          unit_amount: Math.round(price * 100) // Convert to cents
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/meetings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/book-meeting?cancelled=true`,
      metadata: {
        type: 'meeting_booking',
        consultant_id,
        client_id: req.user.id,
        start_time,
        duration_minutes: duration_minutes.toString(),
        meeting_topic: meeting_topic || '',
        meeting_url: meeting_url || ''
      }
    });

    res.json({ 
      success: true, 
      checkout_url: session.url,
      session_id: session.id 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

export default router;
