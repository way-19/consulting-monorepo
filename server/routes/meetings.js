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

export default router;
