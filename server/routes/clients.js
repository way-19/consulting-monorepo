import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validator.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/clients - Get clients based on role
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { page, limit, offset } = req.pagination;
    const { status } = req.query;
    
    let query = `
      SELECT 
        c.*,
        up.first_name,
        up.last_name,
        up.email,
        up.avatar_url
      FROM clients c
      LEFT JOIN user_profiles up ON c.profile_id = up.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    // Role-based access control
    if (role === 'consultant') {
      query += ` AND c.assigned_consultant_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (role === 'client') {
      query += ` AND c.profile_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    // Filter by status
    if (status) {
      query += ` AND c.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as counted`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Add pagination
    query += ` ORDER BY c.company_name LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      clients: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/clients/:id - Get specific client
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    const query = `
      SELECT 
        c.*,
        up.first_name,
        up.last_name,
        up.email,
        up.avatar_url,
        up.phone,
        consultant.first_name || ' ' || consultant.last_name as consultant_name
      FROM clients c
      LEFT JOIN user_profiles up ON c.profile_id = up.id
      LEFT JOIN user_profiles consultant ON c.assigned_consultant_id = consultant.id
      WHERE c.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const client = result.rows[0];
    
    // Check access permissions
    if (role === 'consultant' && client.assigned_consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (role === 'client' && client.profile_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ client });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/clients/:id/stats - Get client statistics
router.get('/:id/stats', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    // Check if client exists and user has access
    const clientQuery = `
      SELECT c.*, up.first_name, up.last_name
      FROM clients c
      LEFT JOIN user_profiles up ON c.profile_id = up.id
      WHERE c.id = $1
    `;
    const clientResult = await pool.query(clientQuery, [id]);
    
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const client = clientResult.rows[0];
    
    // Check access permissions
    if (role === 'consultant' && client.assigned_consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (role === 'client' && client.profile_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get projects count
    const projectsQuery = `
      SELECT COUNT(*) as count
      FROM service_orders
      WHERE client_id = $1
    `;
    const projectsResult = await pool.query(projectsQuery, [id]);
    const projectsCount = parseInt(projectsResult.rows[0].count) || 0;
    
    // Get tasks count
    const tasksQuery = `
      SELECT COUNT(*) as count
      FROM tasks
      WHERE client_id = $1
    `;
    const tasksResult = await pool.query(tasksQuery, [id]);
    const tasksCount = parseInt(tasksResult.rows[0].count) || 0;
    
    // Get total spent (sum of all order amounts)
    const spentQuery = `
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM service_orders
      WHERE client_id = $1 AND status IN ('completed', 'processing', 'pending')
    `;
    const spentResult = await pool.query(spentQuery, [id]);
    const totalSpent = parseFloat(spentResult.rows[0].total) || 0;
    
    res.json({
      client_id: id,
      stats: {
        projects: projectsCount,
        tasks: tasksCount,
        spent: totalSpent
      }
    });
  } catch (error) {
    console.error('Error fetching client stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
