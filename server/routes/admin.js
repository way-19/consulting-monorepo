import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/admin/notifications - Get admin notifications
router.get('/notifications', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const result = await pool.query(`
      SELECT *
      FROM audit_logs
      WHERE action_type IN ('service_purchase', 'payment_received', 'message_sent', 'invoice_created')
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);
    
    res.json({ notifications: result.rows });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/stats - Get admin dashboard stats
router.get('/stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const [
      salesResult,
      messagesResult,
      consultantsResult,
      salesAmountResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM service_orders'),
      pool.query('SELECT COUNT(*) FROM messages WHERE is_read = false'),
      pool.query('SELECT COUNT(*) FROM user_profiles WHERE role = $1 AND is_active = true', ['consultant']),
      pool.query('SELECT SUM(total_amount) as total FROM service_orders WHERE status = $1', ['completed'])
    ]);
    
    const totalSales = parseFloat(salesAmountResult.rows[0]?.total || 0);
    
    res.json({
      stats: {
        totalSales,
        totalCommissions: totalSales * 0.1,
        activeMessages: parseInt(messagesResult.rows[0].count),
        activeConsultants: parseInt(consultantsResult.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/revenue-stats - Get revenue statistics
router.get('/revenue-stats', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        SUM(system_commission_amount) as total_system_revenue,
        SUM(consultant_commission_amount) as total_consultant_commissions,
        SUM(total_amount) as total_revenue
      FROM service_orders
      WHERE status = 'completed'
        AND system_commission_amount IS NOT NULL
        AND consultant_commission_amount IS NOT NULL
    `);
    
    const data = result.rows[0] || {};
    const totalSystemRevenue = parseFloat(data.total_system_revenue || 0);
    const totalConsultantCommissions = parseFloat(data.total_consultant_commissions || 0);
    const totalRevenue = parseFloat(data.total_revenue || 0);
    
    const systemRevenuePercentage = totalRevenue > 0 ? (totalSystemRevenue / totalRevenue) * 100 : 35;
    const consultantRevenuePercentage = totalRevenue > 0 ? (totalConsultantCommissions / totalRevenue) * 100 : 65;
    
    res.json({
      revenueStats: {
        totalSystemRevenue,
        totalConsultantCommissions,
        totalRevenue,
        systemRevenuePercentage,
        consultantRevenuePercentage,
        averageCommissionRate: consultantRevenuePercentage
      }
    });
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/consultant-commissions - Get consultant commission data
router.get('/consultant-commissions', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        up.id as consultant_id,
        up.first_name || ' ' || up.last_name as consultant_name,
        COUNT(so.id) as total_orders,
        SUM(so.total_amount) as total_sales,
        AVG(CASE 
          WHEN so.total_amount > 0 THEN (so.consultant_commission_amount / so.total_amount) * 100 
          ELSE 0 
        END) as commission_rate,
        SUM(so.consultant_commission_amount) as commission_amount,
        SUM(CASE WHEN so.status = 'pending' THEN so.consultant_commission_amount ELSE 0 END) as pending_commission
      FROM user_profiles up
      LEFT JOIN service_orders so ON so.consultant_id = up.id
      WHERE up.role = 'consultant'
        AND up.is_active = true
      GROUP BY up.id, up.first_name, up.last_name
      HAVING COUNT(so.id) > 0
      ORDER BY total_sales DESC
    `);
    
    const commissions = result.rows.map(row => ({
      consultant_id: row.consultant_id,
      consultant_name: row.consultant_name,
      total_sales: parseFloat(row.total_sales || 0),
      commission_rate: parseFloat(row.commission_rate || 0),
      commission_amount: parseFloat(row.commission_amount || 0),
      pending_commission: parseFloat(row.pending_commission || 0)
    }));
    
    res.json({ consultantCommissions: commissions });
  } catch (error) {
    console.error('Error fetching consultant commissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/admin/consultant-commissions/:id - Update consultant commission rate
router.patch('/consultant-commissions/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id: consultantId } = req.params;
    const { commission_rate } = req.body;
    
    if (!commission_rate || commission_rate < 0 || commission_rate > 100) {
      return res.status(400).json({ error: 'Invalid commission rate' });
    }
    
    const result = await pool.query(
      'UPDATE user_profiles SET commission_rate = $1, updated_at = NOW() WHERE id = $2 AND role = $3 RETURNING *',
      [commission_rate, consultantId, 'consultant']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Consultant not found' });
    }
    
    res.json({
      message: 'Commission rate updated successfully',
      consultant: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating commission rate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
