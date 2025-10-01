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

// GET /api/orders - Get orders based on role
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { page, limit, offset } = req.pagination;
    const { status } = req.query;
    
    let query = `
      SELECT 
        o.id, o.title, o.description, o.budget, o.status, o.country_code,
        o.selected_package_id, o.additional_service_ids, o.customer_details,
        o.total_amount, o.currency, o.created_at, o.updated_at, o.client_id,
        c.company_name as client_company,
        client_profile.first_name as client_first_name,
        client_profile.last_name as client_last_name,
        client_profile.email as client_email
      FROM service_orders o
      LEFT JOIN clients c ON o.client_id = c.id
      LEFT JOIN user_profiles client_profile ON c.profile_id = client_profile.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    // Role-based access control
    if (role === 'client') {
      const clientResult = await pool.query(
        'SELECT id FROM clients WHERE profile_id = $1',
        [userId]
      );
      
      if (clientResult.rows.length === 0) {
        return res.json({ orders: [], pagination: { page, limit, total: 0, totalPages: 0 } });
      }
      
      query += ` AND o.client_id = $${paramCount}`;
      params.push(clientResult.rows[0].id);
      paramCount++;
    } else if (role === 'consultant') {
      query += ` AND c.assigned_consultant_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    // Filter by status
    if (status) {
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as counted`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Add pagination and ordering
    query += ` ORDER BY o.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      orders: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:id - Get specific order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    const query = `
      SELECT 
        o.id, o.title, o.description, o.budget, o.status, o.country_code,
        o.selected_package_id, o.additional_service_ids, o.customer_details,
        o.total_amount, o.currency, o.created_at, o.updated_at, o.client_id,
        c.company_name as client_company,
        client_profile.first_name as client_first_name,
        client_profile.last_name as client_last_name,
        client_profile.email as client_email
      FROM service_orders o
      LEFT JOIN clients c ON o.client_id = c.id
      LEFT JOIN user_profiles client_profile ON c.profile_id = client_profile.id
      WHERE o.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = result.rows[0];
    
    // Check access permissions
    if (role === 'client') {
      const clientResult = await pool.query(
        'SELECT id FROM clients WHERE profile_id = $1',
        [userId]
      );
      
      if (clientResult.rows.length === 0 || order.client_id !== clientResult.rows[0].id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else if (role === 'consultant') {
      const clientCheck = await pool.query(
        'SELECT id FROM clients WHERE id = $1 AND assigned_consultant_id = $2',
        [order.client_id, userId]
      );
      
      if (clientCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/orders - Create new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const {
      title,
      description,
      budget,
      country_code,
      selected_package_id,
      additional_service_ids,
      customer_details,
      total_amount,
      currency
    } = req.body;
    
    // Get client ID
    const clientResult = await pool.query(
      'SELECT id FROM clients WHERE profile_id = $1',
      [userId]
    );
    
    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client profile not found' });
    }
    
    const clientId = clientResult.rows[0].id;
    
    // Validation
    if (!title || !total_amount) {
      return res.status(400).json({ error: 'Title and total_amount are required' });
    }
    
    const query = `
      INSERT INTO service_orders (
        client_id, title, description, budget, status,
        country_code, selected_package_id, additional_service_ids,
        customer_details, total_amount, currency
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      clientId,
      title,
      description || null,
      budget || total_amount,
      'pending',
      country_code || null,
      selected_package_id || null,
      additional_service_ids || [],
      customer_details || {},
      total_amount,
      currency || 'USD'
    ];
    
    const result = await pool.query(query, values);
    
    res.status(201).json({
      message: 'Order created successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const { status, notes } = req.body;
    
    // Only admins and consultants can update status
    if (role !== 'admin' && role !== 'consultant') {
      return res.status(403).json({ error: 'Only admins and consultants can update order status' });
    }
    
    // Validation
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const query = `
      UPDATE service_orders
      SET status = $1, notes = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, notes || null, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/packages - Get available packages (PUBLIC)
router.get('/packages/list', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, price, description FROM packages WHERE is_active = true ORDER BY price ASC'
    );
    
    res.json({ packages: result.rows });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/additional-services - Get additional services (PUBLIC)
router.get('/additional-services/list', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, description, base_price FROM additional_services WHERE is_active = true ORDER BY base_price ASC'
    );
    
    res.json({ additional_services: result.rows });
  } catch (error) {
    console.error('Error fetching additional services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/banks - Get available banks (PUBLIC)
router.get('/banks/list', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, price, flag_url FROM banks WHERE is_active = true ORDER BY name ASC'
    );
    
    res.json({ banks: result.rows });
  } catch (error) {
    console.error('Error fetching banks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
