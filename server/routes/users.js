import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/users - List users (with role and status filters)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { role, is_active } = req.query;
    
    let query = `
      SELECT id, user_id, email, role, first_name, last_name, avatar_url, 
             preferred_language, timezone, is_active, created_at, phone, company, 
             spoken_languages, country_code
      FROM user_profiles 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;
    
    if (role) {
      query += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }
    
    if (is_active !== undefined) {
      query += ` AND is_active = $${paramCount}`;
      params.push(is_active === 'true');
      paramCount++;
    }
    
    query += ` ORDER BY first_name, last_name`;
    
    const result = await pool.query(query, params);
    
    // Add full_name and mock pricing for consultants
    const users = result.rows.map(user => ({
      ...user,
      full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      // Mock pricing for consultants (should come from consultant_availability table)
      price_per_hour: user.role === 'consultant' ? 150 : undefined,
      currency: user.role === 'consultant' ? 'USD' : undefined
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/profile - Get current user's profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    const result = await pool.query(
      `SELECT id, user_id, email, role, first_name, last_name, avatar_url, 
              preferred_language, timezone, is_active, created_at, phone, 
              company, display_name
       FROM user_profiles 
       WHERE id = $1`,
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Construct full_name from first_name and last_name
    const profile = result.rows[0];
    profile.full_name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    
    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/users/profile - Update current user's profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { 
      full_name, 
      display_name, 
      phone, 
      company, 
      preferred_language, 
      timezone 
    } = req.body;

    // Split full_name into first_name and last_name
    let first_name = '';
    let last_name = '';
    if (full_name) {
      const nameParts = full_name.trim().split(' ');
      first_name = nameParts[0] || '';
      last_name = nameParts.slice(1).join(' ') || '';
    }

    const result = await pool.query(
      `UPDATE user_profiles 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           display_name = COALESCE($3, display_name),
           phone = COALESCE($4, phone),
           company = COALESCE($5, company),
           preferred_language = COALESCE($6, preferred_language),
           timezone = COALESCE($7, timezone),
           updated_at = NOW()
       WHERE id = $8
       RETURNING id, user_id, email, role, first_name, last_name, avatar_url, 
                 preferred_language, timezone, is_active, created_at, phone, 
                 company, display_name`,
      [first_name, last_name, display_name, phone, company, preferred_language, timezone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Construct full_name from first_name and last_name
    const profile = result.rows[0];
    profile.full_name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();

    res.json({ 
      profile,
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/users/:id - Get user profile by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    // Check access permissions
    if (role !== 'admin' && userId !== id) {
      // Allow viewing if it's their consultant or client
      const accessCheck = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM clients 
          WHERE (profile_id = $1 AND assigned_consultant_id = $2)
          OR (profile_id = $2 AND assigned_consultant_id = $1)
        ) as has_access
      `, [userId, id]);
      
      if (!accessCheck.rows[0].has_access) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    const result = await pool.query(
      `SELECT id, user_id, email, role, first_name, last_name, avatar_url, 
              preferred_language, timezone, is_active, created_at 
       FROM user_profiles 
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
