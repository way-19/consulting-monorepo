import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

router.get('/dashboard-stats', authenticateToken, requireRole('client'), async (req, res) => {
  try {
    const { id: userId } = req.user;

    const clientQuery = `
      SELECT c.id, c.assigned_consultant_id
      FROM clients c
      WHERE c.profile_id = $1
      LIMIT 1
    `;
    const clientResult = await pool.query(clientQuery, [userId]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    const client = clientResult.rows[0];
    const clientId = client.id;

    const [
      projectsResult,
      tasksResult,
      ordersResult,
      messagesResult,
      meetingsResult,
      documentsResult,
      consultantResult,
      activityResult,
      activeProjectsResult
    ] = await Promise.all([
      pool.query(
        `SELECT COUNT(*) as count FROM projects WHERE client_id = $1 AND status IN ('active', 'in_progress')`,
        [clientId]
      ),
      pool.query(
        `SELECT COUNT(*) as count FROM tasks WHERE client_id = $1 AND status = 'completed'`,
        [clientId]
      ),
      pool.query(
        `SELECT COALESCE(SUM(total_amount), 0) as total FROM service_orders WHERE client_id = $1 AND status IN ('completed', 'paid')`,
        [clientId]
      ),
      pool.query(
        `SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = false`,
        [userId]
      ),
      pool.query(
        `SELECT COUNT(*) as count FROM meetings WHERE client_id = $1 AND start_time >= NOW()`,
        [clientId]
      ),
      pool.query(
        `SELECT COUNT(*) as count FROM documents WHERE client_id = $1`,
        [clientId]
      ),
      client.assigned_consultant_id
        ? pool.query(
            `SELECT id, first_name, last_name, email, phone, avatar_url FROM user_profiles WHERE id = $1`,
            [client.assigned_consultant_id]
          )
        : Promise.resolve({ rows: [] }),
      pool.query(
        `SELECT id, action_type, description, created_at FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`,
        [userId]
      ),
      pool.query(
        `SELECT id, title as name, status, progress, created_at FROM projects WHERE client_id = $1 AND status IN ('active', 'in_progress') ORDER BY created_at DESC`,
        [clientId]
      )
    ]);

    const assignedConsultant = consultantResult.rows.length > 0
      ? {
          id: consultantResult.rows[0].id,
          first_name: consultantResult.rows[0].first_name,
          last_name: consultantResult.rows[0].last_name,
          email: consultantResult.rows[0].email,
          phone: consultantResult.rows[0].phone,
          profile_image: consultantResult.rows[0].avatar_url,
          rating: 0
        }
      : null;

    res.json({
      stats: {
        activeProjects: parseInt(projectsResult.rows[0].count) || 0,
        completedTasks: parseInt(tasksResult.rows[0].count) || 0,
        totalSpent: parseFloat(ordersResult.rows[0].total) || 0,
        unreadMessages: parseInt(messagesResult.rows[0].count) || 0,
        upcomingMeetings: parseInt(meetingsResult.rows[0].count) || 0,
        documentsUploaded: parseInt(documentsResult.rows[0].count) || 0
      },
      assignedConsultant,
      recentActivity: activityResult.rows,
      activeProjects: activeProjectsResult.rows
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
