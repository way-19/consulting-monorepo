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

// GET /api/commissions - Get commission payouts based on role
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { page, limit, offset } = req.pagination;
    const { status } = req.query;
    
    let query = `
      SELECT 
        cp.id, cp.consultant_id, cp.period_start, cp.period_end,
        cp.total_amount, cp.commission_rate, cp.status, cp.processed_at,
        cp.created_at,
        up.first_name || ' ' || up.last_name as consultant_name,
        up.email as consultant_email
      FROM commission_payouts cp
      LEFT JOIN user_profiles up ON cp.consultant_id = up.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    // Role-based access control
    if (role === 'consultant') {
      query += ` AND cp.consultant_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    // Filter by status
    if (status) {
      query += ` AND cp.status = $${paramCount}`;
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
    query += ` ORDER BY cp.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      commissions: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching commissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/commissions/:id/items - Get commission payout items
router.get('/:id/items', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    // Check access
    const payoutCheck = await pool.query(
      'SELECT consultant_id FROM commission_payouts WHERE id = $1',
      [id]
    );
    
    if (payoutCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Commission payout not found' });
    }
    
    const payout = payoutCheck.rows[0];
    
    if (role === 'consultant' && payout.consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get commission items (FIXED: using purchase_id, not order_id)
    const query = `
      SELECT 
        cpi.id, cpi.payout_id, cpi.purchase_id as order_id, 
        cpi.service_amount, cpi.commission_amount,
        cpi.created_at,
        o.order_number, o.total_amount as order_total, o.company_name,
        o.country_code, o.status as order_status
      FROM commission_payout_items cpi
      LEFT JOIN service_orders o ON cpi.purchase_id = o.id
      WHERE cpi.payout_id = $1
      ORDER BY cpi.created_at DESC
    `;
    
    const result = await pool.query(query, [id]);
    
    res.json({ items: result.rows });
  } catch (error) {
    console.error('Error fetching commission items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/commissions/stats - Get commission statistics for consultant
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    
    if (role !== 'consultant' && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const consultantId = role === 'consultant' ? userId : req.query.consultant_id;
    
    if (!consultantId) {
      return res.status(400).json({ error: 'Consultant ID required' });
    }
    
    // Get total earnings
    const earningsQuery = `
      SELECT 
        COALESCE(SUM(total_amount), 0) as total_earnings,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN total_amount ELSE 0 END), 0) as pending_amount,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END), 0) as paid_amount,
        COUNT(*) as total_payouts,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payouts,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_payouts
      FROM commission_payouts
      WHERE consultant_id = $1
    `;
    
    const statsResult = await pool.query(earningsQuery, [consultantId]);
    
    // Get current month earnings
    const currentMonthQuery = `
      SELECT 
        COALESCE(SUM(total_amount), 0) as current_month_earnings
      FROM commission_payouts
      WHERE consultant_id = $1
        AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
    `;
    
    const monthResult = await pool.query(currentMonthQuery, [consultantId]);
    
    res.json({
      ...statsResult.rows[0],
      current_month_earnings: monthResult.rows[0].current_month_earnings
    });
  } catch (error) {
    console.error('Error fetching commission stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
