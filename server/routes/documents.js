import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { validateDocumentUpload, validatePagination } from '../middleware/validator.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, JPG, and PNG files are allowed'));
    }
  }
});

// GET /api/documents - Get all documents for authenticated user
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { page, limit, offset } = req.pagination;
    const { document_type, status, client_id } = req.query;
    
    let query = `
      SELECT 
        d.*,
        c.company_name,
        up.first_name || ' ' || up.last_name as client_name
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN user_profiles up ON c.profile_id = up.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    // Role-based access control
    if (role === 'consultant') {
      // Consultant can only see documents of their assigned clients
      query += ` AND d.consultant_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (role === 'client') {
      // Client can only see their own documents
      query += ` AND c.profile_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    } else if (role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    // Filter by document type
    if (document_type) {
      query += ` AND d.document_type = $${paramCount}`;
      params.push(document_type);
      paramCount++;
    }
    
    // Filter by status
    if (status) {
      query += ` AND d.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }
    
    // Filter by client_id (for consultants/admins)
    if (client_id && role !== 'client') {
      query += ` AND d.client_id = $${paramCount}`;
      params.push(client_id);
      paramCount++;
    }
    
    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as counted`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Add pagination
    query += ` ORDER BY d.uploaded_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      documents: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/documents/:id - Get specific document
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    
    const query = `
      SELECT 
        d.*,
        c.company_name,
        up.first_name || ' ' || up.last_name as client_name
      FROM documents d
      LEFT JOIN clients c ON d.client_id = c.id
      LEFT JOIN user_profiles up ON c.profile_id = up.id
      WHERE d.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const document = result.rows[0];
    
    // Check access permissions
    if (role === 'consultant' && document.consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (role === 'client') {
      const clientCheck = await pool.query(
        'SELECT id FROM clients WHERE id = $1 AND profile_id = $2',
        [document.client_id, userId]
      );
      if (clientCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    res.json({ document });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/documents/upload - Upload new document
router.post('/upload', 
  authenticateToken, 
  uploadLimiter,
  upload.single('file'),
  validateDocumentUpload,
  async (req, res) => {
    try {
      const { client_id, document_type, category, notes, amount, currency, transaction_date } = req.body;
      const { id: userId, role } = req.user;
      const file = req.file;
      
      // Verify user has access to this client
      if (role === 'consultant') {
        const accessCheck = await pool.query(
          'SELECT id FROM clients WHERE id = $1 AND assigned_consultant_id = $2',
          [client_id, userId]
        );
        if (accessCheck.rows.length === 0) {
          // Delete uploaded file
          fs.unlinkSync(file.path);
          return res.status(403).json({ error: 'Access denied to this client' });
        }
      } else if (role === 'client') {
        const accessCheck = await pool.query(
          'SELECT id FROM clients WHERE id = $1 AND profile_id = $2',
          [client_id, userId]
        );
        if (accessCheck.rows.length === 0) {
          // Delete uploaded file
          fs.unlinkSync(file.path);
          return res.status(403).json({ error: 'Access denied' });
        }
      } else if (role !== 'admin') {
        // Delete uploaded file
        fs.unlinkSync(file.path);
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      // Insert document record into database
      const insertQuery = `
        INSERT INTO documents (
          client_id, 
          consultant_id, 
          document_type, 
          category, 
          name, 
          file_path, 
          file_size, 
          mime_type, 
          status,
          notes,
          amount,
          currency,
          transaction_date,
          uploaded_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      
      // Get consultant_id for this client if user is client
      let consultant_id = role === 'consultant' ? userId : null;
      if (role === 'client') {
        const clientData = await pool.query(
          'SELECT assigned_consultant_id FROM clients WHERE id = $1',
          [client_id]
        );
        consultant_id = clientData.rows[0]?.assigned_consultant_id;
      }
      
      const values = [
        client_id,
        consultant_id,
        document_type,
        category || 'general',
        file.originalname,
        file.path,
        file.size,
        file.mimetype,
        'pending',
        notes || null,
        amount || null,
        currency || null,
        transaction_date || null,
        userId
      ];
      
      const result = await pool.query(insertQuery, values);
      
      res.status(201).json({
        message: 'Document uploaded successfully',
        document: result.rows[0]
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      
      // Clean up uploaded file on error
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PATCH /api/documents/:id/status - Update document status
router.patch('/:id/status', 
  authenticateToken, 
  requireRole(['consultant', 'admin']),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const { id: userId, role } = req.user;
      
      // Validate status
      if (!['pending', 'reviewed', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      // Check access permissions
      if (role === 'consultant') {
        const accessCheck = await pool.query(
          'SELECT id FROM documents WHERE id = $1 AND consultant_id = $2',
          [id, userId]
        );
        if (accessCheck.rows.length === 0) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }
      
      const updateQuery = `
        UPDATE documents 
        SET 
          status = $1,
          notes = COALESCE($2, notes),
          reviewed_by = $3,
          reviewed_at = NOW(),
          updated_at = NOW()
        WHERE id = $4
        RETURNING *
      `;
      
      const result = await pool.query(updateQuery, [status, notes, userId, id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Document not found' });
      }
      
      res.json({
        message: 'Document status updated successfully',
        document: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating document status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/documents/:id - Delete document
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;
    
    // Get document info
    const docResult = await pool.query(
      'SELECT * FROM documents WHERE id = $1',
      [id]
    );
    
    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    const document = docResult.rows[0];
    
    // Check access permissions
    if (role === 'consultant' && document.consultant_id !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (role === 'client' && document.uploaded_by !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    } else if (role !== 'admin' && role !== 'consultant' && role !== 'client') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Delete file from filesystem
    try {
      if (fs.existsSync(document.file_path)) {
        fs.unlinkSync(document.file_path);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }
    
    // Delete from database
    await pool.query('DELETE FROM documents WHERE id = $1', [id]);
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
