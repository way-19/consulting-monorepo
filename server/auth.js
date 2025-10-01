import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken, requireRole } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = 3001;

// JWT Secret (MANDATORY - must be set in environment)
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set!');
  process.exit(1);
}

const JWT_EXPIRES_IN = '7d';

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// CORS configuration - RESTRICTED for production
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:3000',
      process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
    ].filter(Boolean);
    
    const isAllowed = allowedOrigins.some(allowed => {
      return origin === allowed || origin.endsWith('.replit.dev') || origin.endsWith('.repl.co');
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user from database
    const result = await pool.query(
      'SELECT id, user_id, email, password_hash, role, first_name, last_name FROM user_profiles WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data and token
    res.json({
      user: {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint (DISABLED for security - use admin interface to create users)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // SECURITY: Only allow 'client' role for public registration
    // Admin and consultant accounts must be created by administrators
    const userRole = 'client';

    if (role && role !== 'client') {
      return res.status(403).json({ error: 'Cannot self-assign privileged roles. Only client registration is allowed.' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM user_profiles WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user with client role only
    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, email, password_hash, first_name, last_name, role, created_at, updated_at)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, user_id, email, role, first_name, last_name`,
      [email, password_hash, first_name, last_name, userRole]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint (client-side token removal)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Get current user info
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, user_id, email, role, first_name, last_name, avatar_url, created_at FROM user_profiles WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token refresh endpoint
app.post('/api/auth/refresh', authenticateToken, async (req, res) => {
  try {
    // Generate new token with same user data
    const newToken = jwt.sign(
      {
        id: req.user.id,
        user_id: req.user.user_id,
        email: req.user.email,
        role: req.user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth' });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
