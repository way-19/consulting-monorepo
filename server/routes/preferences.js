import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;

    const query = `
      SELECT metadata FROM user_profiles WHERE id = $1
    `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const preferences = result.rows[0].metadata?.preferences || {};
    
    res.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const newPreferences = req.body;

    const getCurrentQuery = `
      SELECT metadata FROM user_profiles WHERE id = $1
    `;
    const currentResult = await pool.query(getCurrentQuery, [userId]);

    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const currentMetadata = currentResult.rows[0].metadata || {};
    const currentPreferences = currentMetadata.preferences || {};
    
    const mergedPreferences = {
      ...currentPreferences,
      ...newPreferences
    };

    const updatedMetadata = {
      ...currentMetadata,
      preferences: mergedPreferences
    };

    const updateQuery = `
      UPDATE user_profiles 
      SET metadata = $1, updated_at = NOW() 
      WHERE id = $2
      RETURNING metadata
    `;
    
    const result = await pool.query(updateQuery, [
      JSON.stringify(updatedMetadata),
      userId
    ]);

    res.json({ 
      preferences: result.rows[0].metadata.preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
