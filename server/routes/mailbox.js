import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/mailbox - Get client's mail items
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Only clients can access their own mail
    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can access mailbox' 
      });
    }

    const result = await pool.query(
      `SELECT * FROM mail_items 
       WHERE client_id = $1 
       ORDER BY received_date DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      mailItems: result.rows
    });
  } catch (error) {
    console.error('Error fetching mail items:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch mail items' 
    });
  }
});

// GET /api/mailbox/:id - Get specific mail item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can access mailbox' 
      });
    }

    const result = await pool.query(
      'SELECT * FROM mail_items WHERE id = $1 AND client_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Mail item not found' 
      });
    }

    res.json({
      success: true,
      mailItem: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching mail item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch mail item' 
    });
  }
});

// POST /api/mailbox/:id/request-scan - Request scan for mail item
router.post('/:id/request-scan', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can request scans' 
      });
    }

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT id, status FROM mail_items WHERE id = $1 AND client_id = $2',
      [id, req.user.id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Mail item not found' 
      });
    }

    const mailItem = checkOwnership.rows[0];

    if (mailItem.status === 'scanned') {
      return res.status(400).json({ 
        success: false, 
        error: 'Mail item already scanned' 
      });
    }

    // Update status to pending_scan
    const result = await pool.query(
      `UPDATE mail_items 
       SET status = 'pending_scan', 
           updated_at = NOW(),
           notes = COALESCE(notes, '') || '\nScan requested at ' || NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      mailItem: result.rows[0],
      message: 'Scan request submitted successfully'
    });
  } catch (error) {
    console.error('Error requesting scan:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to request scan' 
    });
  }
});

// POST /api/mailbox/:id/request-forward - Request forwarding for mail item
router.post('/:id/request-forward', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { forward_address } = req.body;

    if (!forward_address) {
      return res.status(400).json({ 
        success: false, 
        error: 'Forward address is required' 
      });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can request forwarding' 
      });
    }

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT id, status FROM mail_items WHERE id = $1 AND client_id = $2',
      [id, req.user.id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Mail item not found' 
      });
    }

    const mailItem = checkOwnership.rows[0];

    if (mailItem.status === 'forwarded') {
      return res.status(400).json({ 
        success: false, 
        error: 'Mail item already forwarded' 
      });
    }

    // Update with forward request
    const result = await pool.query(
      `UPDATE mail_items 
       SET status = 'pending_forward',
           forward_address = $1,
           forward_requested_at = NOW(),
           updated_at = NOW(),
           notes = COALESCE(notes, '') || '\nForward requested to: ' || $1 || ' at ' || NOW()
       WHERE id = $2
       RETURNING *`,
      [forward_address, id]
    );

    res.json({
      success: true,
      mailItem: result.rows[0],
      message: 'Forward request submitted successfully'
    });
  } catch (error) {
    console.error('Error requesting forward:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to request forward' 
    });
  }
});

// PATCH /api/mailbox/:id/archive - Archive mail item
router.patch('/:id/archive', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can archive mail' 
      });
    }

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT id FROM mail_items WHERE id = $1 AND client_id = $2',
      [id, req.user.id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Mail item not found' 
      });
    }

    const result = await pool.query(
      `UPDATE mail_items 
       SET status = 'archived', 
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      success: true,
      mailItem: result.rows[0]
    });
  } catch (error) {
    console.error('Error archiving mail item:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to archive mail item' 
    });
  }
});

export default router;
