import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    let query = '';
    let params = [];

    if (role === 'client') {
      const clientResult = await pool.query(
        `SELECT c.id FROM clients c
         JOIN user_profiles up ON c.profile_id = up.id
         WHERE up.id = $1`,
        [userId]
      );

      if (clientResult.rows.length === 0) {
        return res.json({ tickets: [] });
      }

      const clientId = clientResult.rows[0].id;

      query = `
        SELECT 
          st.*,
          json_build_object(
            'full_name', up.first_name || ' ' || up.last_name
          ) as consultant
        FROM support_tickets st
        LEFT JOIN user_profiles up ON st.consultant_id = up.id
        WHERE st.client_id = $1
        ORDER BY st.created_at DESC
      `;
      params = [clientId];
    } else if (role === 'consultant') {
      query = `
        SELECT 
          st.*,
          json_build_object(
            'full_name', up.first_name || ' ' || up.last_name
          ) as consultant
        FROM support_tickets st
        LEFT JOIN user_profiles up ON st.consultant_id = up.id
        WHERE st.consultant_id = $1
        ORDER BY st.created_at DESC
      `;
      params = [userId];
    } else if (role === 'admin') {
      query = `
        SELECT 
          st.*,
          json_build_object(
            'full_name', up.first_name || ' ' || up.last_name
          ) as consultant
        FROM support_tickets st
        LEFT JOIN user_profiles up ON st.consultant_id = up.id
        ORDER BY st.created_at DESC
      `;
    }

    const result = await pool.query(query, params);
    res.json({ tickets: result.rows });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    const { ticket_type, subject, description, priority = 'medium' } = req.body;

    if (!ticket_type || !subject || !description) {
      return res.status(400).json({ error: 'Ticket type, subject, and description are required' });
    }

    if (role !== 'client') {
      return res.status(403).json({ error: 'Only clients can create support tickets' });
    }

    const clientResult = await pool.query(
      `SELECT c.id, c.assigned_consultant_id FROM clients c
       JOIN user_profiles up ON c.profile_id = up.id
       WHERE up.id = $1`,
      [userId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const { id: clientId, assigned_consultant_id } = clientResult.rows[0];

    const result = await pool.query(
      `INSERT INTO support_tickets (client_id, consultant_id, ticket_type, subject, description, priority, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'open', NOW(), NOW())
       RETURNING *`,
      [clientId, assigned_consultant_id, ticket_type, subject, description, priority]
    );

    res.status(201).json({ 
      ticket: result.rows[0],
      message: 'Support ticket created successfully' 
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id: ticketId } = req.params;
    const { id: userId, role } = req.user;

    const result = await pool.query(
      `SELECT 
        st.*,
        json_build_object(
          'full_name', up.first_name || ' ' || up.last_name
        ) as consultant
       FROM support_tickets st
       LEFT JOIN user_profiles up ON st.consultant_id = up.id
       WHERE st.id = $1`,
      [ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = result.rows[0];

    if (role === 'client') {
      const clientResult = await pool.query(
        `SELECT c.id FROM clients c
         JOIN user_profiles up ON c.profile_id = up.id
         WHERE up.id = $1`,
        [userId]
      );

      if (clientResult.rows.length === 0 || clientResult.rows[0].id !== ticket.client_id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (role === 'consultant' && ticket.consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id: ticketId } = req.params;
    const { id: userId, role } = req.user;
    const { status, priority, consultant_id } = req.body;

    const ticketResult = await pool.query(
      'SELECT * FROM support_tickets WHERE id = $1',
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];

    if (role === 'client') {
      const clientResult = await pool.query(
        `SELECT c.id FROM clients c
         JOIN user_profiles up ON c.profile_id = up.id
         WHERE up.id = $1`,
        [userId]
      );

      if (clientResult.rows.length === 0 || clientResult.rows[0].id !== ticket.client_id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (role === 'consultant' && ticket.consultant_id !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }

    if (priority) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }

    if (consultant_id && (role === 'admin' || role === 'consultant')) {
      updates.push(`consultant_id = $${paramCount++}`);
      values.push(consultant_id);
    }

    updates.push(`updated_at = NOW()`);

    values.push(ticketId);

    const result = await pool.query(
      `UPDATE support_tickets 
       SET ${updates.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    res.json({ 
      ticket: result.rows[0],
      message: 'Ticket updated successfully' 
    });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id: ticketId } = req.params;
    const { id: userId, role } = req.user;

    const ticketResult = await pool.query(
      'SELECT * FROM support_tickets WHERE id = $1',
      [ticketId]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = ticketResult.rows[0];

    if (role !== 'admin') {
      if (role === 'client') {
        const clientResult = await pool.query(
          `SELECT c.id FROM clients c
           JOIN user_profiles up ON c.profile_id = up.id
           WHERE up.id = $1`,
          [userId]
        );

        if (clientResult.rows.length === 0 || clientResult.rows[0].id !== ticket.client_id) {
          return res.status(403).json({ error: 'Access denied' });
        }
      } else if (role === 'consultant' && ticket.consultant_id !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    await pool.query('DELETE FROM support_tickets WHERE id = $1', [ticketId]);

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
