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
    const { status, priority } = req.query;

    const clientQuery = `
      SELECT id FROM clients WHERE profile_id = $1 LIMIT 1
    `;
    const clientResult = await pool.query(clientQuery, [userId]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const clientId = clientResult.rows[0].id;

    let projectQuery = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.status,
        p.progress,
        p.start_date,
        p.end_date,
        p.created_at,
        up.first_name || ' ' || up.last_name as consultant_full_name,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'completed') as completed_tasks,
        (SELECT COALESCE(SUM(estimated_hours), 0) FROM tasks WHERE project_id = p.id) as total_hours
      FROM projects p
      LEFT JOIN user_profiles up ON p.consultant_id = up.id
      WHERE p.client_id = $1
    `;

    const params = [clientId];
    let paramCount = 2;

    if (status) {
      projectQuery += ` AND p.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    projectQuery += ` ORDER BY p.created_at DESC`;

    const projectsResult = await pool.query(projectQuery, params);

    const projects = projectsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      description_i18n: { en: row.description },
      status: row.status,
      priority: 'medium',
      progress: row.progress || 0,
      budget: 0,
      currency: 'USD',
      start_date: row.start_date,
      end_date: row.end_date,
      created_at: row.created_at,
      consultant: {
        full_name: row.consultant_full_name || 'Unassigned'
      },
      task_stats: {
        total_tasks: parseInt(row.total_tasks) || 0,
        completed_tasks: parseInt(row.completed_tasks) || 0,
        total_hours: parseFloat(row.total_hours) || 0
      }
    }));

    res.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
