import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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
    const { consultant_id, day_of_week, start_time, end_time, status, notes } = req.body;

    // Only consultants can create their own availability
    if (req.user.role !== 'consultant' && req.user.id !== consultant_id) {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized to create availability for this consultant' 
      });
    }

    const result = await pool.query(
      `INSERT INTO consultant_availability 
        (consultant_id, day_of_week, start_time, end_time, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [consultant_id, day_of_week, start_time, end_time, status || 'available', notes]
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

    // Check ownership if consultant
    if (req.user.role === 'consultant') {
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
          error: 'Unauthorized to update this availability' 
        });
      }
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

    // Check ownership if consultant
    if (req.user.role === 'consultant') {
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
          error: 'Unauthorized to delete this availability' 
        });
      }
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

export default router;
