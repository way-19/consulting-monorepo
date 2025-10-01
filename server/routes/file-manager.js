import express from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Configure multer for memory storage (files go directly to PostgreSQL, not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max
  }
});

// Helper: Validate folder/file name (no slashes, control chars, etc.)
function validateName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  const trimmed = name.trim();
  
  // Check length
  if (trimmed.length === 0 || trimmed.length > 255) {
    return false;
  }
  
  // Disallow slashes and control characters
  if (/[\/\\<>:"|?*\x00-\x1F]/.test(trimmed)) {
    return false;
  }
  
  return true;
}

// GET /api/file-manager/folders - Get all folders for client
router.get('/folders', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can access file manager' 
      });
    }

    const result = await pool.query(
      `SELECT id, parent_folder_id, name, path, created_at, updated_at 
       FROM file_folders 
       WHERE client_id = $1 
       ORDER BY path, name`,
      [req.user.id]
    );

    res.json({
      success: true,
      folders: result.rows
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch folders' 
    });
  }
});

// POST /api/file-manager/folders - Create new folder
router.post('/folders', authenticateToken, async (req, res) => {
  try {
    const { name, parent_folder_id } = req.body;

    if (!validateName(name)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid folder name. Names must be 1-255 characters and cannot contain slashes or special characters.' 
      });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can create folders' 
      });
    }

    const sanitizedName = name.trim();

    // Calculate path
    let folderPath = '/' + sanitizedName;
    if (parent_folder_id) {
      const parentResult = await pool.query(
        'SELECT path, client_id FROM file_folders WHERE id = $1',
        [parent_folder_id]
      );

      if (parentResult.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Parent folder not found' 
        });
      }

      if (parentResult.rows[0].client_id !== req.user.id) {
        return res.status(403).json({ 
          success: false, 
          error: 'Unauthorized: Cannot access parent folder' 
        });
      }

      folderPath = parentResult.rows[0].path + '/' + sanitizedName;
    }

    const result = await pool.query(
      `INSERT INTO file_folders (client_id, parent_folder_id, name, path)
       VALUES ($1, $2, $3, $4)
       RETURNING id, parent_folder_id, name, path, created_at, updated_at`,
      [req.user.id, parent_folder_id || null, sanitizedName, folderPath]
    );

    res.status(201).json({
      success: true,
      folder: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    
    // Handle unique constraint violation
    if (error.code === '23505') {
      return res.status(409).json({ 
        success: false, 
        error: 'A folder with this name already exists in this location' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create folder' 
    });
  }
});

// DELETE /api/file-manager/folders/:id - Delete folder
router.delete('/folders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can delete folders' 
      });
    }

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT id FROM file_folders WHERE id = $1 AND client_id = $2',
      [id, req.user.id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Folder not found' 
      });
    }

    // Check if folder has files
    const filesCheck = await pool.query(
      'SELECT COUNT(*) as count FROM client_files WHERE folder_id = $1',
      [id]
    );

    if (parseInt(filesCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete folder with files. Please delete files first.' 
      });
    }

    // Check if folder has subfolders
    const subfoldersCheck = await pool.query(
      'SELECT COUNT(*) as count FROM file_folders WHERE parent_folder_id = $1',
      [id]
    );

    if (parseInt(subfoldersCheck.rows[0].count) > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot delete folder with subfolders. Please delete subfolders first.' 
      });
    }

    await pool.query('DELETE FROM file_folders WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Folder deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete folder' 
    });
  }
});

// GET /api/file-manager/files - Get all files for client (whitelist safe fields only)
router.get('/files', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can access files' 
      });
    }

    const { folder_id, search } = req.query;
    
    // Whitelist: Only return safe fields, never file_data, stored_name, or file_path
    let query = `
      SELECT 
        cf.id,
        cf.original_name,
        cf.file_size,
        cf.mime_type,
        cf.folder_id,
        cf.description,
        cf.tags,
        cf.created_at,
        cf.updated_at,
        ff.name as folder_name,
        ff.path as folder_path,
        up.first_name || ' ' || up.last_name as uploaded_by_name
      FROM client_files cf
      LEFT JOIN file_folders ff ON cf.folder_id = ff.id
      LEFT JOIN user_profiles up ON cf.uploaded_by = up.id
      WHERE cf.client_id = $1
    `;
    
    const params = [req.user.id];
    let paramCount = 2;

    if (folder_id) {
      if (folder_id === 'root') {
        query += ` AND cf.folder_id IS NULL`;
      } else {
        query += ` AND cf.folder_id = $${paramCount}`;
        params.push(folder_id);
        paramCount++;
      }
    }

    if (search) {
      query += ` AND cf.original_name ILIKE $${paramCount}`;
      params.push(`%${search}%`);
    }

    query += ` ORDER BY cf.created_at DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      files: result.rows
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch files' 
    });
  }
});

// POST /api/file-manager/upload - Upload file to PostgreSQL bytea
router.post('/upload', authenticateToken, uploadLimiter, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can upload files' 
      });
    }

    const { folder_id, description, tags } = req.body;

    // Validate filename
    if (!validateName(req.file.originalname)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid filename' 
      });
    }

    // Verify folder ownership if folder_id provided
    if (folder_id) {
      const folderCheck = await pool.query(
        'SELECT id FROM file_folders WHERE id = $1 AND client_id = $2',
        [folder_id, req.user.id]
      );

      if (folderCheck.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Folder not found' 
        });
      }
    }

    const tagArray = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];

    // Store file bytes in PostgreSQL
    const result = await pool.query(
      `INSERT INTO client_files 
        (client_id, folder_id, original_name, file_size, mime_type, uploaded_by, description, tags, file_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, client_id, folder_id, original_name, file_size, mime_type, description, tags, created_at, updated_at`,
      [
        req.user.id,
        folder_id || null,
        req.file.originalname,
        req.file.size,
        req.file.mimetype,
        req.user.id,
        description || null,
        tagArray,
        req.file.buffer // Store file bytes directly in DB
      ]
    );

    res.status(201).json({
      success: true,
      file: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload file' 
    });
  }
});

// GET /api/file-manager/download/:id - Download file from PostgreSQL
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can download files' 
      });
    }

    const result = await pool.query(
      'SELECT original_name, mime_type, file_data FROM client_files WHERE id = $1 AND client_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    const file = result.rows[0];

    if (!file.file_data) {
      return res.status(500).json({ 
        success: false, 
        error: 'File data missing' 
      });
    }

    // Set headers and stream file
    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.send(file.file_data);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to download file' 
    });
  }
});

// DELETE /api/file-manager/files/:id - Delete file
router.delete('/files/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can delete files' 
      });
    }

    const result = await pool.query(
      'SELECT id FROM client_files WHERE id = $1 AND client_id = $2',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    // Delete from database (file_data will be deleted automatically)
    await pool.query('DELETE FROM client_files WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete file' 
    });
  }
});

// PATCH /api/file-manager/files/:id - Rename/update file
router.patch('/files/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { original_name, description, tags, folder_id } = req.body;

    if (req.user.role !== 'client') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only clients can update files' 
      });
    }

    // Check ownership
    const checkOwnership = await pool.query(
      'SELECT id FROM client_files WHERE id = $1 AND client_id = $2',
      [id, req.user.id]
    );

    if (checkOwnership.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    // Validate new filename if provided
    if (original_name && !validateName(original_name)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid filename' 
      });
    }

    // Verify folder ownership if moving to new folder
    if (folder_id) {
      const folderCheck = await pool.query(
        'SELECT id FROM file_folders WHERE id = $1 AND client_id = $2',
        [folder_id, req.user.id]
      );

      if (folderCheck.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Folder not found' 
        });
      }
    }

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (original_name) {
      updates.push(`original_name = $${paramIndex}`);
      values.push(original_name.trim());
      paramIndex++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      values.push(description);
      paramIndex++;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(t => t);
      updates.push(`tags = $${paramIndex}`);
      values.push(tagArray);
      paramIndex++;
    }

    if (folder_id !== undefined) {
      updates.push(`folder_id = $${paramIndex}`);
      values.push(folder_id || null);
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
      UPDATE client_files 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, client_id, folder_id, original_name, file_size, mime_type, description, tags, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({
      success: true,
      file: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update file' 
    });
  }
});

export default router;
