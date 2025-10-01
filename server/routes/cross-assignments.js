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

// GET /api/cross-assignments/received - Get assignments received by consultant
router.get('/received', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can view received assignments' 
      });
    }

    const result = await pool.query(
      `SELECT 
        ca.*,
        c.first_name || ' ' || c.last_name as client_name,
        c.email as client_email,
        c.company_name as client_company,
        rc.first_name || ' ' || rc.last_name as referring_consultant_name,
        rc.email as referring_consultant_email,
        rc.country_code as referring_country_code
       FROM cross_assignments ca
       INNER JOIN clients c ON ca.client_id = c.id
       INNER JOIN user_profiles rc ON ca.referring_consultant_id = rc.id
       WHERE ca.target_consultant_id = $1
       ORDER BY ca.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      assignments: result.rows
    });
  } catch (error) {
    console.error('Error fetching received assignments:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch assignments' 
    });
  }
});

// GET /api/cross-assignments/sent - Get assignments sent by consultant
router.get('/sent', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can view sent assignments' 
      });
    }

    const result = await pool.query(
      `SELECT 
        ca.*,
        c.first_name || ' ' || c.last_name as client_name,
        c.email as client_email,
        c.company_name as client_company,
        tc.first_name || ' ' || tc.last_name as target_consultant_name,
        tc.email as target_consultant_email,
        tc.country_code as target_country_code
       FROM cross_assignments ca
       INNER JOIN clients c ON ca.client_id = c.id
       INNER JOIN user_profiles tc ON ca.target_consultant_id = tc.id
       WHERE ca.referring_consultant_id = $1
       ORDER BY ca.created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      assignments: result.rows
    });
  } catch (error) {
    console.error('Error fetching sent assignments:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch assignments' 
    });
  }
});

// GET /api/cross-assignments/client - Get client's assignments
router.get('/client', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can view their assignments' 
      });
    }

    // Get client record
    const clientResult = await pool.query(
      'SELECT id FROM clients WHERE profile_id = $1',
      [req.user.id]
    );

    if (clientResult.rows.length === 0) {
      return res.json({
        success: true,
        assignments: []
      });
    }

    const clientId = clientResult.rows[0].id;

    const result = await pool.query(
      `SELECT 
        ca.*,
        rc.first_name || ' ' || rc.last_name as referring_consultant_name,
        rc.country_code as referring_country_code,
        tc.first_name || ' ' || tc.last_name as target_consultant_name,
        tc.country_code as target_country_code,
        tc.email as target_consultant_email
       FROM cross_assignments ca
       INNER JOIN user_profiles rc ON ca.referring_consultant_id = rc.id
       INNER JOIN user_profiles tc ON ca.target_consultant_id = tc.id
       WHERE ca.client_id = $1
       ORDER BY ca.created_at DESC`,
      [clientId]
    );

    res.json({
      success: true,
      assignments: result.rows
    });
  } catch (error) {
    console.error('Error fetching client assignments:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch assignments' 
    });
  }
});

// POST /api/cross-assignments - Create new cross assignment
router.post('/',
  authenticateToken,
  [
    body('client_id').optional().isUUID(),
    body('target_country_code').trim().notEmpty().isLength({ min: 2, max: 2 }).withMessage('Valid country code is required'),
    body('service_description').trim().notEmpty().withMessage('Service description is required'),
    body('estimated_price').optional().isFloat({ min: 0.01 }).withMessage('Price must be at least $0.01')
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

      const { client_id, target_country_code, service_description, estimated_price } = req.body;
      let finalClientId;
      let referringConsultantId;

      if (req.user.role === 'client') {
        // Client creating request for themselves
        const clientResult = await pool.query(
          'SELECT id, assigned_consultant_id FROM clients WHERE profile_id = $1',
          [req.user.id]
        );

        if (clientResult.rows.length === 0) {
          return res.status(404).json({ 
            success: false, 
            error: 'Client profile not found' 
          });
        }

        finalClientId = clientResult.rows[0].id;
        referringConsultantId = clientResult.rows[0].assigned_consultant_id;

        if (!referringConsultantId) {
          return res.status(400).json({ 
            success: false, 
            error: 'You must have an assigned consultant to request services from another country' 
          });
        }

      } else if (req.user.role === 'consultant') {
        // Consultant creating request for their client
        if (!client_id) {
          return res.status(400).json({ 
            success: false, 
            error: 'client_id is required for consultant requests' 
          });
        }

        // Verify client belongs to this consultant
        const clientCheck = await pool.query(
          `SELECT c.id FROM clients c
           WHERE c.id = $1 AND c.assigned_consultant_id = $2`,
          [client_id, req.user.id]
        );

        if (clientCheck.rows.length === 0) {
          return res.status(403).json({ 
            success: false, 
            error: 'Unauthorized: Client does not belong to you' 
          });
        }

        finalClientId = client_id;
        referringConsultantId = req.user.id;

      } else {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized: Only clients and consultants can create assignments' 
        });
      }

      // Verify target country is active
      const countryCheck = await pool.query(
        'SELECT code FROM countries WHERE code = $1 AND is_active = true',
        [target_country_code.toUpperCase()]
      );

      if (countryCheck.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Target country is not active for cross-assignments' 
        });
      }

      // Find active consultant in target country
      const targetConsultantResult = await pool.query(
        `SELECT id FROM user_profiles 
         WHERE role = 'consultant' 
           AND country_code = $1 
           AND is_active = true
         LIMIT 1`,
        [target_country_code.toUpperCase()]
      );

      if (targetConsultantResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'No active consultant found for target country' 
        });
      }

      const targetConsultantId = targetConsultantResult.rows[0].id;

      // Prevent self-assignment
      if (targetConsultantId === referringConsultantId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Cannot assign to yourself' 
        });
      }

      // Create assignment
      const result = await pool.query(
        `INSERT INTO cross_assignments 
          (client_id, referring_consultant_id, target_consultant_id, 
           target_country_code, service_description, estimated_price, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending')
         RETURNING *`,
        [
          finalClientId,
          referringConsultantId,
          targetConsultantId,
          target_country_code.toUpperCase(),
          service_description,
          estimated_price || null
        ]
      );

      res.status(201).json({
        success: true,
        assignment: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating cross assignment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create assignment' 
      });
    }
  }
);

// PATCH /api/cross-assignments/:id/approve - Approve assignment
router.patch('/:id/approve',
  authenticateToken,
  async (req, res) => {
    try {
      if (req.user.role !== 'consultant') {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized: Only consultants can approve assignments' 
        });
      }

      const { id } = req.params;

      // Verify ownership and status
      const assignmentResult = await pool.query(
        `SELECT * FROM cross_assignments 
         WHERE id = $1 AND target_consultant_id = $2`,
        [id, req.user.id]
      );

      if (assignmentResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Assignment not found or unauthorized' 
        });
      }

      const assignment = assignmentResult.rows[0];

      if (assignment.status !== 'pending') {
        return res.status(400).json({ 
          success: false, 
          error: 'Assignment is not pending' 
        });
      }

      // Update status
      const result = await pool.query(
        `UPDATE cross_assignments 
         SET status = 'approved', 
             approved_at = NOW(),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      res.json({
        success: true,
        assignment: result.rows[0]
      });
    } catch (error) {
      console.error('Error approving assignment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to approve assignment' 
      });
    }
  }
);

// PATCH /api/cross-assignments/:id/reject - Reject assignment
router.patch('/:id/reject',
  authenticateToken,
  [
    body('rejection_reason').optional().trim()
  ],
  async (req, res) => {
    try {
      if (req.user.role !== 'consultant') {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized: Only consultants can reject assignments' 
        });
      }

      const { id } = req.params;
      const { rejection_reason } = req.body;

      // Verify ownership and status
      const assignmentResult = await pool.query(
        `SELECT * FROM cross_assignments 
         WHERE id = $1 AND target_consultant_id = $2`,
        [id, req.user.id]
      );

      if (assignmentResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Assignment not found or unauthorized' 
        });
      }

      const assignment = assignmentResult.rows[0];

      if (assignment.status !== 'pending') {
        return res.status(400).json({ 
          success: false, 
          error: 'Assignment is not pending' 
        });
      }

      // Update status
      const result = await pool.query(
        `UPDATE cross_assignments 
         SET status = 'rejected', 
             rejected_at = NOW(),
             rejection_reason = $2,
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id, rejection_reason || null]
      );

      res.json({
        success: true,
        assignment: result.rows[0]
      });
    } catch (error) {
      console.error('Error rejecting assignment:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to reject assignment' 
      });
    }
  }
);

// GET /api/cross-assignments/stats - Get assignment statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can view stats' 
      });
    }

    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE target_consultant_id = $1 AND status = 'pending') as received_pending,
        COUNT(*) FILTER (WHERE target_consultant_id = $1 AND status = 'approved') as received_approved,
        COUNT(*) FILTER (WHERE referring_consultant_id = $1 AND status = 'pending') as sent_pending,
        COUNT(*) FILTER (WHERE referring_consultant_id = $1 AND status = 'approved') as sent_approved,
        AVG(system_commission_rate) as avg_system_rate,
        AVG(assigned_consultant_rate) as avg_assigned_rate,
        AVG(referring_consultant_rate) as avg_referring_rate
       FROM cross_assignments
       WHERE target_consultant_id = $1 OR referring_consultant_id = $1`,
      [req.user.id]
    );

    const stats = result.rows[0];

    res.json({
      success: true,
      stats: {
        received_pending: parseInt(stats.received_pending) || 0,
        received_approved: parseInt(stats.received_approved) || 0,
        sent_pending: parseInt(stats.sent_pending) || 0,
        sent_approved: parseInt(stats.sent_approved) || 0,
        commission_rates: {
          system: parseFloat(stats.avg_system_rate) || 30.0,
          assigned_consultant: parseFloat(stats.avg_assigned_rate) || 65.0,
          referring_consultant: parseFloat(stats.avg_referring_rate) || 5.0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching assignment stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch stats' 
    });
  }
});

// GET /api/cross-assignments/active-countries - Get active countries with consultants
router.get('/active-countries', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT 
        c.code,
        c.name_en,
        c.name_tr,
        c.name_es,
        c.name_pt
       FROM countries c
       INNER JOIN user_profiles up ON c.code = up.country_code
       WHERE c.is_active = true
         AND up.role = 'consultant'
         AND up.is_active = true
       ORDER BY c.name_en`
    );

    res.json({
      success: true,
      countries: result.rows
    });
  } catch (error) {
    console.error('Error fetching active countries:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch countries' 
    });
  }
});

export default router;
