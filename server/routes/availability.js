import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/availability/self - Get own availability
router.get('/self', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT 
        ca.id,
        ca.day_of_week,
        ca.start_time,
        ca.end_time,
        ca.status,
        ca.notes,
        ca.created_at,
        ca.updated_at
      FROM consultant_availability ca
      WHERE ca.consultant_id = $1
      ORDER BY ca.day_of_week, ca.start_time`,
      [req.user.id]
    );

    res.json({
      success: true,
      availability: result.rows
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch availability' 
    });
  }
});

// GET /api/availability/:consultantId - Get consultant availability
router.get('/:consultantId', authenticateToken, async (req, res) => {
  try {
    const { consultantId } = req.params;

    const result = await pool.query(
      `SELECT 
        ca.id,
        ca.day_of_week,
        ca.start_time,
        ca.end_time,
        ca.status,
        ca.notes,
        ca.created_at,
        ca.updated_at,
        up.first_name,
        up.last_name,
        up.email
      FROM consultant_availability ca
      JOIN user_profiles up ON ca.consultant_id = up.id
      WHERE ca.consultant_id = $1
      ORDER BY ca.day_of_week, ca.start_time`,
      [consultantId]
    );

    res.json({
      success: true,
      availability: result.rows
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch availability' 
    });
  }
});

// POST /api/availability - Create availability slot
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { day_of_week, start_time, end_time, status, notes } = req.body;

    // Only consultants can create their own availability
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can create availability' 
      });
    }

    // Use authenticated user's ID (server-derived, not client-provided)
    const consultantId = req.user.id;

    const result = await pool.query(
      `INSERT INTO consultant_availability 
        (consultant_id, day_of_week, start_time, end_time, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [consultantId, day_of_week, start_time, end_time, status || 'available', notes]
    );

    res.status(201).json({
      success: true,
      availability: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create availability' 
    });
  }
});

// PATCH /api/availability/:id - Update availability slot
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { day_of_week, start_time, end_time, status, notes } = req.body;

    // Only consultants can update availability
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can update availability' 
      });
    }

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT consultant_id FROM consultant_availability WHERE id = $1',
      [id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Availability slot not found' 
      });
    }

    if (checkOwnership.rows[0].consultant_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Can only update your own availability' 
      });
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (day_of_week !== undefined) {
      updates.push(`day_of_week = $${paramIndex++}`);
      values.push(day_of_week);
    }
    if (start_time !== undefined) {
      updates.push(`start_time = $${paramIndex++}`);
      values.push(start_time);
    }
    if (end_time !== undefined) {
      updates.push(`end_time = $${paramIndex++}`);
      values.push(end_time);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      values.push(notes);
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE consultant_availability 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    res.json({
      success: true,
      availability: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update availability' 
    });
  }
});

// DELETE /api/availability/:id - Delete availability slot
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Only consultants can delete availability
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can delete availability' 
      });
    }

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT consultant_id FROM consultant_availability WHERE id = $1',
      [id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Availability slot not found' 
      });
    }

    if (checkOwnership.rows[0].consultant_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Can only delete your own availability' 
      });
    }

    await pool.query('DELETE FROM consultant_availability WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Availability slot deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete availability' 
    });
  }
});

// GET /api/availability/stats/self - Get own stats
router.get('/stats/self', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const [availabilityResult, blockedResult, settingsResult] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(DISTINCT day_of_week) as active_days,
          SUM(EXTRACT(EPOCH FROM (end_time - start_time))/3600) as weekly_hours
        FROM consultant_availability 
        WHERE consultant_id = $1 AND status = 'available'`,
        [req.user.id]
      ),
      pool.query(`
        SELECT COUNT(*) as blocked_count 
        FROM blocked_times 
        WHERE consultant_id = $1 AND end_time > NOW()`,
        [req.user.id]
      ),
      pool.query(`
        SELECT hourly_rate 
        FROM consultant_settings 
        WHERE consultant_id = $1`,
        [req.user.id]
      )
    ]);

    res.json({
      success: true,
      stats: {
        weekly_hours: Math.round(availabilityResult.rows[0].weekly_hours || 0),
        active_days: parseInt(availabilityResult.rows[0].active_days) || 0,
        hourly_rate: settingsResult.rows[0]?.hourly_rate || 0,
        blocked_times: parseInt(blockedResult.rows[0].blocked_count) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// GET /api/availability/stats/:consultantId - Get availability stats
router.get('/stats/:consultantId', authenticateToken, async (req, res) => {
  try {
    const { consultantId } = req.params;

    const [availabilityResult, blockedResult, settingsResult] = await Promise.all([
      pool.query(`
        SELECT 
          COUNT(DISTINCT day_of_week) as active_days,
          SUM(EXTRACT(EPOCH FROM (end_time - start_time))/3600) as weekly_hours
        FROM consultant_availability 
        WHERE consultant_id = $1 AND status = 'available'`,
        [consultantId]
      ),
      pool.query(`
        SELECT COUNT(*) as blocked_count 
        FROM blocked_times 
        WHERE consultant_id = $1 AND end_time > NOW()`,
        [consultantId]
      ),
      pool.query(`
        SELECT hourly_rate 
        FROM consultant_settings 
        WHERE consultant_id = $1`,
        [consultantId]
      )
    ]);

    res.json({
      success: true,
      stats: {
        weekly_hours: Math.round(availabilityResult.rows[0].weekly_hours || 0),
        active_days: parseInt(availabilityResult.rows[0].active_days) || 0,
        hourly_rate: settingsResult.rows[0]?.hourly_rate || 0,
        blocked_times: parseInt(blockedResult.rows[0].blocked_count) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

// GET /api/availability/blocked - Get consultant's blocked times
router.get('/blocked/list', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT * FROM blocked_times 
       WHERE consultant_id = $1 
       ORDER BY start_time DESC`,
      [req.user.id]
    );

    res.json({ success: true, blocked_times: result.rows });
  } catch (error) {
    console.error('Error fetching blocked times:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blocked times' });
  }
});

// POST /api/availability/blocked - Create blocked time
router.post('/blocked', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { title, start_time, end_time, reason } = req.body;

    const result = await pool.query(
      `INSERT INTO blocked_times (consultant_id, title, start_time, end_time, reason)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, title, start_time, end_time, reason]
    );

    res.status(201).json({ success: true, blocked_time: result.rows[0] });
  } catch (error) {
    console.error('Error creating blocked time:', error);
    res.status(500).json({ success: false, error: 'Failed to create blocked time' });
  }
});

// DELETE /api/availability/blocked/:id - Delete blocked time
router.delete('/blocked/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const checkOwnership = await pool.query(
      'SELECT consultant_id FROM blocked_times WHERE id = $1',
      [req.params.id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Blocked time not found' });
    }

    if (checkOwnership.rows[0].consultant_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await pool.query('DELETE FROM blocked_times WHERE id = $1', [req.params.id]);

    res.json({ success: true, message: 'Blocked time deleted successfully' });
  } catch (error) {
    console.error('Error deleting blocked time:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blocked time' });
  }
});

// GET /api/availability/pricing - Get consultant's meeting pricing
router.get('/pricing/list', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      `SELECT * FROM meeting_pricing 
       WHERE consultant_id = $1 AND is_active = true
       ORDER BY duration_minutes`,
      [req.user.id]
    );

    res.json({ success: true, pricing: result.rows });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pricing' });
  }
});

// POST /api/availability/pricing - Create/update meeting pricing
router.post('/pricing', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { duration_minutes, price, currency = 'USD' } = req.body;

    const result = await pool.query(
      `INSERT INTO meeting_pricing (consultant_id, duration_minutes, price, currency)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (consultant_id, duration_minutes)
       DO UPDATE SET price = $3, currency = $4, updated_at = NOW()
       RETURNING *`,
      [req.user.id, duration_minutes, price, currency]
    );

    res.json({ success: true, pricing: result.rows[0] });
  } catch (error) {
    console.error('Error saving pricing:', error);
    res.status(500).json({ success: false, error: 'Failed to save pricing' });
  }
});

// GET /api/availability/settings - Get consultant settings
router.get('/settings/get', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const result = await pool.query(
      'SELECT * FROM consultant_settings WHERE consultant_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, settings: null });
    }

    res.json({ success: true, settings: result.rows[0] });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
});

// POST /api/availability/settings - Update consultant settings
router.post('/settings', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    const { video_platform, video_meeting_url, meeting_topics, hourly_rate } = req.body;

    const result = await pool.query(
      `INSERT INTO consultant_settings 
        (consultant_id, video_platform, video_meeting_url, meeting_topics, hourly_rate)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (consultant_id)
       DO UPDATE SET 
         video_platform = $2,
         video_meeting_url = $3,
         meeting_topics = $4,
         hourly_rate = $5,
         updated_at = NOW()
       RETURNING *`,
      [req.user.id, video_platform, video_meeting_url, JSON.stringify(meeting_topics || []), hourly_rate]
    );

    res.json({ success: true, settings: result.rows[0] });
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ success: false, error: 'Failed to save settings' });
  }
});

export default router;
