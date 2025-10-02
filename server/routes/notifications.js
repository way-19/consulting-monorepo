import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import { authenticateToken } from '../middleware/auth.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const router = express.Router();

router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    );
    
    res.json({ success: true, count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch unread count' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { unread_only } = req.query;
    
    let query = `
      SELECT * FROM notifications 
      WHERE user_id = $1
    `;
    
    if (unread_only === 'true') {
      query += ' AND is_read = false';
    }
    
    query += ' ORDER BY created_at DESC LIMIT 50';
    
    const result = await pool.query(query, [req.user.id]);
    
    res.json({ success: true, notifications: result.rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

router.post('/:id/read', authenticateToken, async (req, res) => {
  try {
    const checkOwnership = await pool.query(
      'SELECT user_id FROM notifications WHERE id = $1',
      [req.params.id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    if (checkOwnership.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await pool.query(
      'UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = $1',
      [req.params.id]
    );

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
  }
});

router.post('/read-all', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET is_read = true, read_at = NOW() WHERE user_id = $1 AND is_read = false',
      [req.user.id]
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark all as read' });
  }
});

export default router;
