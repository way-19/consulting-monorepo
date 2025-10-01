import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/users/:id - Get user profile by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    // Check access permissions
    if (role !== 'admin' && userId !== id) {
      // Allow viewing if it's their consultant or client
      const accessCheck = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM clients 
          WHERE (profile_id = $1 AND assigned_consultant_id = $2)
          OR (profile_id = $2 AND assigned_consultant_id = $1)
        ) as has_access
      `, [userId, id]);
      
      if (!accessCheck.rows[0].has_access) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    const result = await pool.query(
      `SELECT id, user_id, email, role, first_name, last_name, avatar_url, 
              preferred_language, timezone, is_active, created_at 
       FROM user_profiles 
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
