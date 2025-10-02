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
    const { id: userId } = req.user;

    const query = `
      SELECT 
        id, 
        action_type, 
        description, 
        created_at,
        table_name,
        metadata
      FROM audit_logs 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `;

    const result = await pool.query(query, [userId]);

    res.json({ 
      activities: result.rows.map(row => ({
        id: row.id,
        action_type: row.action_type,
        description: row.description,
        created_at: row.created_at,
        table_name: row.table_name,
        metadata: row.metadata
      }))
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
