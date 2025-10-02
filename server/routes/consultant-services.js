import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/consultant-services - Get consultant's custom services
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can manage services' 
      });
    }

    const result = await pool.query(
      `SELECT * FROM consultant_custom_services 
       WHERE consultant_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      services: result.rows
    });
  } catch (error) {
    console.error('Error fetching consultant services:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch services' 
    });
  }
});

// GET /api/consultant-services/by-country/:country_code - Get services for a specific country (public/client)
router.get('/by-country/:country_code', authenticateToken, async (req, res) => {
  try {
    const { country_code } = req.params;

    const result = await pool.query(
      `SELECT 
        ccs.*,
        up.first_name || ' ' || up.last_name as consultant_name
       FROM consultant_custom_services ccs
       INNER JOIN user_profiles up ON ccs.consultant_id = up.id
       WHERE ccs.country_code = $1 
         AND ccs.is_active = true
       ORDER BY ccs.created_at DESC`,
      [country_code.toUpperCase()]
    );

    res.json({
      success: true,
      services: result.rows
    });
  } catch (error) {
    console.error('Error fetching services by country:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch services' 
    });
  }
});

// POST /api/consultant-services - Create new custom service
router.post('/',
  authenticateToken,
  [
    body('name').trim().notEmpty().withMessage('Service name is required'),
    body('description').optional().trim(),
    body('price').isFloat({ min: 0.01 }).withMessage('Price must be at least $0.01'),
    body('category').optional().trim(),
    body('country_code').trim().notEmpty().withMessage('Country code is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      if (req.user.role !== 'consultant') {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized: Only consultants can create services' 
        });
      }

      const { name, description, price, category, country_code } = req.body;

      const result = await pool.query(
        `INSERT INTO consultant_custom_services 
          (consultant_id, country_code, name, description, price, category)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [req.user.id, country_code.toUpperCase(), name, description || null, price, category || null]
      );

      res.status(201).json({
        success: true,
        service: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating service:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create service' 
      });
    }
  }
);

// PATCH /api/consultant-services/:id - Update service
router.patch('/:id',
  authenticateToken,
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('price').optional().isFloat({ min: 0.01 }).withMessage('Price must be at least $0.01'),
    body('category').optional().trim(),
    body('is_active').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      if (req.user.role !== 'consultant') {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized: Only consultants can update services' 
        });
      }

      const { id } = req.params;
      const { name, description, price, category, is_active } = req.body;

      // Check ownership
      const checkOwnership = await pool.query(
        'SELECT id FROM consultant_custom_services WHERE id = $1 AND consultant_id = $2',
        [id, req.user.id]
      );

      if (checkOwnership.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Service not found' 
        });
      }

      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramIndex}`);
        values.push(name);
        paramIndex++;
      }

      if (description !== undefined) {
        updates.push(`description = $${paramIndex}`);
        values.push(description);
        paramIndex++;
      }

      if (price !== undefined) {
        updates.push(`price = $${paramIndex}`);
        values.push(price);
        paramIndex++;
      }

      if (category !== undefined) {
        updates.push(`category = $${paramIndex}`);
        values.push(category);
        paramIndex++;
      }

      if (is_active !== undefined) {
        updates.push(`is_active = $${paramIndex}`);
        values.push(is_active);
        paramIndex++;
      }

      if (updates.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'No updates provided' 
        });
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const query = `
        UPDATE consultant_custom_services 
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const result = await pool.query(query, values);

      res.json({
        success: true,
        service: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating service:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update service' 
      });
    }
  }
);

// DELETE /api/consultant-services/:id - Delete service
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can delete services' 
      });
    }

    const { id } = req.params;

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT id FROM consultant_custom_services WHERE id = $1 AND consultant_id = $2',
      [id, req.user.id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Service not found' 
      });
    }

    // Check if service has orders
    const ordersCheck = await pool.query(
      'SELECT COUNT(*) as count FROM service_orders WHERE consultant_custom_service_id = $1',
      [id]
    );

    if (parseInt(ordersCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete service with existing orders. Please deactivate instead.' 
      });
    }

    await pool.query('DELETE FROM consultant_custom_services WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete service' 
    });
  }
});

// GET /api/consultant-services/orders - Get orders for consultant's custom services
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can view orders' 
      });
    }

    const result = await pool.query(
      `SELECT 
        so.*,
        ccs.name as service_name,
        ccs.category as service_category,
        up.first_name || ' ' || up.last_name as client_name,
        up.email as client_email
       FROM service_orders so
       INNER JOIN consultant_custom_services ccs ON so.consultant_custom_service_id = ccs.id
       INNER JOIN clients c ON so.client_id = c.id
       INNER JOIN user_profiles up ON c.profile_id = up.id
       WHERE ccs.consultant_id = $1
       ORDER BY so.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Error fetching service orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// PATCH /api/consultant-services/orders/:id/status - Update order status
router.patch('/orders/:id/status',
  authenticateToken,
  [
    body('status').isIn(['pending', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      if (req.user.role !== 'consultant') {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized: Only consultants can update orders' 
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Verify consultant owns this service order
      const checkOwnership = await pool.query(
        `SELECT so.id 
         FROM service_orders so
         INNER JOIN consultant_custom_services ccs ON so.consultant_custom_service_id = ccs.id
         WHERE so.id = $1 AND ccs.consultant_id = $2`,
        [id, req.user.id]
      );

      if (checkOwnership.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Order not found' 
        });
      }

      const completedAt = status === 'completed' ? 'NOW()' : 'NULL';

      const result = await pool.query(
        `UPDATE service_orders 
         SET status = $1, 
             updated_at = NOW(),
             completed_at = ${completedAt}
         WHERE id = $2
         RETURNING *`,
        [status, id]
      );

      res.json({
        success: true,
        order: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update order' 
      });
    }
  }
);

// GET /api/consultant-services/client-orders - Get client's own service orders
router.get('/client-orders', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can view their orders' 
      });
    }

    // Get client record (clients.id) from user_profiles.id
    const clientResult = await pool.query(
      'SELECT id FROM clients WHERE profile_id = $1',
      [req.user.id]
    );

    if (clientResult.rows.length === 0) {
      return res.json({
        success: true,
        orders: []
      });
    }

    const clientId = clientResult.rows[0].id;

    const result = await pool.query(
      `SELECT 
        so.id,
        so.order_number,
        so.status,
        so.total_amount,
        so.created_at,
        so.completed_at,
        ccs.name as service_name,
        ccs.category as service_category
       FROM service_orders so
       INNER JOIN consultant_custom_services ccs ON so.consultant_custom_service_id = ccs.id
       WHERE so.client_id = $1
       ORDER BY so.created_at DESC`,
      [clientId]
    );

    res.json({
      success: true,
      orders: result.rows
    });
  } catch (error) {
    console.error('Error fetching client orders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch orders' 
    });
  }
});

// POST /api/consultant-services/purchase - Purchase a custom service
router.post('/purchase',
  authenticateToken,
  [
    body('consultant_custom_service_id').isUUID().withMessage('Valid service ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      if (req.user.role !== 'client') {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized: Only clients can purchase services' 
        });
      }

      const { consultant_custom_service_id } = req.body;

      // Get client record (clients.id) from user_profiles.id
      const clientResult = await pool.query(
        'SELECT id FROM clients WHERE profile_id = $1',
        [req.user.id]
      );

      if (clientResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Client profile not found' 
        });
      }

      const clientId = clientResult.rows[0].id;

      // Get service details
      const serviceResult = await pool.query(
        'SELECT * FROM consultant_custom_services WHERE id = $1 AND is_active = true',
        [consultant_custom_service_id]
      );

      if (serviceResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Service not found or not available' 
        });
      }

      const service = serviceResult.rows[0];

      // Validate server-side price (prevent client manipulation)
      if (service.price <= 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid service price' 
        });
      }

      // Generate order number
      const orderNumber = 'SRV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

      // Create service order with correct client_id (clients.id, not user_profiles.id)
      const orderResult = await pool.query(
        `INSERT INTO service_orders 
          (order_number, client_id, consultant_id, consultant_custom_service_id, 
           country_code, status, total_amount, payment_status)
         VALUES ($1, $2, $3, $4, $5, 'pending', $6, 'paid')
         RETURNING *`,
        [
          orderNumber,
          clientId,
          service.consultant_id,
          consultant_custom_service_id,
          service.country_code,
          service.price
        ]
      );

      res.status(201).json({
        success: true,
        order: orderResult.rows[0]
      });
    } catch (error) {
      console.error('Error purchasing service:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to purchase service' 
      });
    }
  }
);

export default router;
