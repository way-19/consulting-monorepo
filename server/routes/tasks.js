import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validator.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/tasks - Get tasks based on role
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { page, limit, offset } = req.pagination;
    const { status, priority, is_client_visible, project_id } = req.query;
    
    let query = `
      SELECT 
        t.id, t.title, t.description, t.status, t.priority, t.due_date,
        t.estimated_hours, t.actual_hours, t.billable, t.is_client_visible,
        t.created_at, t.updated_at, t.consultant_id, t.client_id, t.project_id,
        up.first_name || ' ' || up.last_name as consultant_name,
        p.title as project_title,
        c.company_name as client_company,
        client_profile.first_name as client_first_name,
        client_profile.last_name as client_last_name
      FROM tasks t
      LEFT JOIN user_profiles up ON t.consultant_id = up.id
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN clients c ON t.client_id = c.id
      LEFT JOIN user_profiles client_profile ON c.profile_id = client_profile.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    // Role-based access control
    if (role === 'consultant') {
      query += ` AND t.consultant_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (role === 'client') {
      // Get client ID first
      const clientResult = await pool.query(
        'SELECT id FROM clients WHERE profile_id = $1',
        [userId]
      );
      
      if (clientResult.rows.length === 0) {
        return res.json({ tasks: [], pagination: { page, limit, total: 0, totalPages: 0 } });
      }
      
      query += ` AND t.client_id = $${paramCount} AND t.is_client_visible = true`;
      params.push(clientResult.rows[0].id);
      paramCount++;
    } else if (role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    // Filter by status
    if (status) {
      query += ` AND t.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    // Filter by priority
    if (priority) {
      query += ` AND t.priority = $${paramCount}`;
      params.push(priority);
      paramCount++;
    }
    
    // Filter by client visibility
    if (is_client_visible !== undefined) {
      query += ` AND t.is_client_visible = $${paramCount}`;
      params.push(is_client_visible === 'true');
      paramCount++;
    }
    
    // Filter by project_id
    if (project_id) {
      query += ` AND t.project_id = $${paramCount}`;
      params.push(project_id);
      paramCount++;
    }
    
    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as counted`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Add pagination and ordering
    query += ` ORDER BY t.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    // Transform data to match frontend expectations
    const tasks = result.rows.map(row => ({
      ...row,
      consultant: row.consultant_name ? { full_name: row.consultant_name } : null,
      project: row.project_title ? { title: row.project_title } : null,
      client: (row.client_first_name || row.client_last_name) ? {
        first_name: row.client_first_name,
        last_name: row.client_last_name
      } : null
    }));
    
    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/tasks/:id - Get specific task
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    const query = `
      SELECT 
        t.id, t.title, t.description, t.status, t.priority, t.due_date,
        t.estimated_hours, t.actual_hours, t.billable, t.is_client_visible,
        t.created_at, t.updated_at, t.consultant_id, t.client_id, t.project_id,
        up.first_name || ' ' || up.last_name as consultant_name,
        p.title as project_title,
        c.company_name as client_company,
        client_profile.first_name as client_first_name,
        client_profile.last_name as client_last_name
      FROM tasks t
      LEFT JOIN user_profiles up ON t.consultant_id = up.id
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN clients c ON t.client_id = c.id
      LEFT JOIN user_profiles client_profile ON c.profile_id = client_profile.id
      WHERE t.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const task = result.rows[0];
    
    // Check access permissions
    if (role === 'consultant' && task.consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (role === 'client') {
      const clientResult = await pool.query(
        'SELECT id FROM clients WHERE profile_id = $1',
        [userId]
      );
      
      if (clientResult.rows.length === 0 || task.client_id !== clientResult.rows[0].id || !task.is_client_visible) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    // Transform data
    const transformedTask = {
      ...task,
      consultant: task.consultant_name ? { full_name: task.consultant_name } : null,
      project: task.project_title ? { title: task.project_title } : null,
      client: (task.client_first_name || task.client_last_name) ? {
        first_name: task.client_first_name,
        last_name: task.client_last_name
      } : null
    };
    
    res.json({ task: transformedTask });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks - Create new task
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const {
      title,
      description,
      status,
      priority,
      due_date,
      estimated_hours,
      billable,
      is_client_visible,
      client_id,
      project_id
    } = req.body;
    
    // Only consultants and admins can create tasks
    if (role !== 'consultant' && role !== 'admin') {
      return res.status(403).json({ error: 'Only consultants and admins can create tasks' });
    }
    
    // Validation
    if (!title || !client_id) {
      return res.status(400).json({ error: 'Title and client_id are required' });
    }
    
    // Verify consultant has access to this client
    if (role === 'consultant') {
      const clientCheck = await pool.query(
        'SELECT id FROM clients WHERE id = $1 AND assigned_consultant_id = $2',
        [client_id, userId]
      );
      
      if (clientCheck.rows.length === 0) {
        return res.status(403).json({ error: 'You are not assigned to this client' });
      }
    }
    
    const query = `
      INSERT INTO tasks (
        title, description, status, priority, due_date,
        estimated_hours, billable, is_client_visible,
        consultant_id, client_id, project_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      title,
      description || null,
      status || 'todo',
      priority || 'medium',
      due_date || null,
      estimated_hours || 0,
      billable !== undefined ? billable : true,
      is_client_visible !== undefined ? is_client_visible : false,
      userId,
      client_id,
      project_id || null
    ];
    
    const result = await pool.query(query, values);
    
    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/tasks/:id - Update task
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    const updates = req.body;
    
    // Check if task exists and user has access
    const taskCheck = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const task = taskCheck.rows[0];
    
    // Access control
    if (role === 'consultant' && task.consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (role === 'client') {
      return res.status(403).json({ error: 'Clients cannot update tasks' });
    }
    
    // Build update query
    const allowedFields = [
      'title', 'description', 'status', 'priority', 'due_date',
      'estimated_hours', 'actual_hours', 'billable', 'is_client_visible'
    ];
    
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(updates[field]);
        paramCount++;
      }
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    
    updateFields.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `
      UPDATE tasks
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    res.json({
      message: 'Task updated successfully',
      task: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    // Check if task exists and user has access
    const taskCheck = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [id]
    );
    
    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const task = taskCheck.rows[0];
    
    // Only task creator or admin can delete
    if (role !== 'admin' && task.consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
