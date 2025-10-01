import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Multer configuration for image uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// GET /api/cms-content/pages - Get consultant's pages
router.get('/pages', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can manage CMS pages' 
      });
    }

    const result = await pool.query(
      `SELECT * FROM cms_pages 
       WHERE consultant_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      success: true,
      pages: result.rows
    });
  } catch (error) {
    console.error('Error fetching CMS pages:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch pages' 
    });
  }
});

// GET /api/cms-content/pages/:id - Get page with blocks
router.get('/pages/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can view CMS pages' 
      });
    }

    const { id } = req.params;

    // Get page with ownership check
    const pageResult = await pool.query(
      'SELECT * FROM cms_pages WHERE id = $1 AND consultant_id = $2',
      [id, req.user.id]
    );

    if (pageResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Page not found or unauthorized' 
      });
    }

    // Get blocks
    const blocksResult = await pool.query(
      'SELECT * FROM cms_blocks WHERE page_id = $1 ORDER BY order_index ASC',
      [id]
    );

    res.json({
      success: true,
      page: pageResult.rows[0],
      blocks: blocksResult.rows
    });
  } catch (error) {
    console.error('Error fetching CMS page:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch page' 
    });
  }
});

// GET /api/cms-content/public/slug/:slug - Get published page by slug (public)
router.get('/public/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Get published page
    const pageResult = await pool.query(
      'SELECT * FROM cms_pages WHERE slug = $1 AND is_published = true',
      [slug]
    );

    if (pageResult.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Page not found' 
      });
    }

    // Get visible blocks
    const blocksResult = await pool.query(
      'SELECT * FROM cms_blocks WHERE page_id = $1 AND is_visible = true ORDER BY order_index ASC',
      [pageResult.rows[0].id]
    );

    res.json({
      success: true,
      page: pageResult.rows[0],
      blocks: blocksResult.rows
    });
  } catch (error) {
    console.error('Error fetching public CMS page:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch page' 
    });
  }
});

// POST /api/cms-content/pages - Create new page
router.post('/pages',
  authenticateToken,
  [
    body('country_code').trim().notEmpty().isLength({ min: 2, max: 2 }).withMessage('Valid country code is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('slug').trim().notEmpty().matches(/^[a-z0-9-]+$/).withMessage('Slug must be lowercase letters, numbers, and hyphens only'),
    body('meta_description').optional().trim()
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
          error: 'Unauthorized: Only consultants can create CMS pages' 
        });
      }

      const { country_code, title, slug, meta_description } = req.body;

      // Verify consultant's country matches
      if (req.user.country_code !== country_code.toUpperCase()) {
        return res.status(403).json({ 
          success: false, 
          error: 'You can only create pages for your assigned country' 
        });
      }

      // Create page
      const result = await pool.query(
        `INSERT INTO cms_pages 
          (consultant_id, country_code, slug, title, meta_description)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          req.user.id,
          country_code.toUpperCase(),
          slug,
          title,
          meta_description || null
        ]
      );

      res.status(201).json({
        success: true,
        page: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating CMS page:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ 
          success: false, 
          error: 'Page slug or consultant/country combination already exists' 
        });
      }
      
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create page' 
      });
    }
  }
);

// PATCH /api/cms-content/pages/:id - Update page
router.patch('/pages/:id',
  authenticateToken,
  [
    body('title').optional().trim().notEmpty(),
    body('meta_description').optional().trim(),
    body('is_published').optional().isBoolean()
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
          error: 'Unauthorized: Only consultants can update CMS pages' 
        });
      }

      const { id } = req.params;
      const { title, meta_description, is_published } = req.body;

      // Check ownership
      const ownershipCheck = await pool.query(
        'SELECT id FROM cms_pages WHERE id = $1 AND consultant_id = $2',
        [id, req.user.id]
      );

      if (ownershipCheck.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Page not found or unauthorized' 
        });
      }

      // Build update query dynamically
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (title !== undefined) {
        updates.push(`title = $${paramCount++}`);
        values.push(title);
      }
      if (meta_description !== undefined) {
        updates.push(`meta_description = $${paramCount++}`);
        values.push(meta_description);
      }
      if (is_published !== undefined) {
        updates.push(`is_published = $${paramCount++}`);
        values.push(is_published);
      }

      if (updates.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'No fields to update' 
        });
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const result = await pool.query(
        `UPDATE cms_pages 
         SET ${updates.join(', ')} 
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      res.json({
        success: true,
        page: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating CMS page:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update page' 
      });
    }
  }
);

// DELETE /api/cms-content/pages/:id - Delete page
router.delete('/pages/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can delete CMS pages' 
      });
    }

    const { id } = req.params;

    // Delete with ownership check (cascade deletes blocks)
    const result = await pool.query(
      'DELETE FROM cms_pages WHERE id = $1 AND consultant_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Page not found or unauthorized' 
      });
    }

    res.json({
      success: true,
      message: 'Page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting CMS page:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete page' 
    });
  }
});

// POST /api/cms-content/blocks - Create block
router.post('/blocks',
  authenticateToken,
  [
    body('page_id').isUUID().withMessage('Valid page ID is required'),
    body('block_type').trim().notEmpty().isIn(['hero', 'features', 'services', 'testimonials', 'faq', 'cta', 'text_content', 'image_gallery', 'video', 'contact_form']).withMessage('Valid block type is required'),
    body('content').isObject().withMessage('Content must be a JSON object'),
    body('order_index').optional().isInt({ min: 0 })
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
          error: 'Unauthorized: Only consultants can create CMS blocks' 
        });
      }

      const { page_id, block_type, content, order_index } = req.body;

      // Verify page ownership
      const pageCheck = await pool.query(
        'SELECT id FROM cms_pages WHERE id = $1 AND consultant_id = $2',
        [page_id, req.user.id]
      );

      if (pageCheck.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Page not found or unauthorized' 
        });
      }

      // Get max order_index if not provided
      let finalOrderIndex = order_index;
      if (finalOrderIndex === undefined) {
        const maxOrderResult = await pool.query(
          'SELECT COALESCE(MAX(order_index), -1) + 1 as next_order FROM cms_blocks WHERE page_id = $1',
          [page_id]
        );
        finalOrderIndex = maxOrderResult.rows[0].next_order;
      }

      // Create block
      const result = await pool.query(
        `INSERT INTO cms_blocks 
          (page_id, block_type, content, order_index)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [page_id, block_type, JSON.stringify(content), finalOrderIndex]
      );

      res.status(201).json({
        success: true,
        block: result.rows[0]
      });
    } catch (error) {
      console.error('Error creating CMS block:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create block' 
      });
    }
  }
);

// PATCH /api/cms-content/blocks/:id - Update block
router.patch('/blocks/:id',
  authenticateToken,
  [
    body('content').optional().isObject(),
    body('order_index').optional().isInt({ min: 0 }),
    body('is_visible').optional().isBoolean()
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
          error: 'Unauthorized: Only consultants can update CMS blocks' 
        });
      }

      const { id } = req.params;
      const { content, order_index, is_visible } = req.body;

      // Verify ownership via page
      const ownershipCheck = await pool.query(
        `SELECT b.id FROM cms_blocks b
         INNER JOIN cms_pages p ON b.page_id = p.id
         WHERE b.id = $1 AND p.consultant_id = $2`,
        [id, req.user.id]
      );

      if (ownershipCheck.rows.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Block not found or unauthorized' 
        });
      }

      // Build update query
      const updates = [];
      const values = [];
      let paramCount = 1;

      if (content !== undefined) {
        updates.push(`content = $${paramCount++}`);
        values.push(JSON.stringify(content));
      }
      if (order_index !== undefined) {
        updates.push(`order_index = $${paramCount++}`);
        values.push(order_index);
      }
      if (is_visible !== undefined) {
        updates.push(`is_visible = $${paramCount++}`);
        values.push(is_visible);
      }

      if (updates.length === 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'No fields to update' 
        });
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const result = await pool.query(
        `UPDATE cms_blocks 
         SET ${updates.join(', ')} 
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      res.json({
        success: true,
        block: result.rows[0]
      });
    } catch (error) {
      console.error('Error updating CMS block:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update block' 
        });
    }
  }
);

// DELETE /api/cms-content/blocks/:id - Delete block
router.delete('/blocks/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can delete CMS blocks' 
      });
    }

    const { id } = req.params;

    // Delete with ownership check
    const result = await pool.query(
      `DELETE FROM cms_blocks b
       USING cms_pages p
       WHERE b.id = $1 
         AND b.page_id = p.id 
         AND p.consultant_id = $2
       RETURNING b.id`,
      [id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Block not found or unauthorized' 
      });
    }

    res.json({
      success: true,
      message: 'Block deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting CMS block:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete block' 
      });
  }
});

// POST /api/cms-content/media - Upload image to database
router.post('/media', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can upload images' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided' 
      });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const { alt_text_en } = req.body;

    // Insert image into database
    const result = await pool.query(
      `INSERT INTO cms_images 
        (filename, mime_type, file_size, image_data, alt_text_en, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, filename, mime_type, file_size, created_at`,
      [originalname, mimetype, size, buffer, alt_text_en || '', req.user.id]
    );

    res.json({
      success: true,
      image: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload image' 
    });
  }
});

// GET /api/cms-content/media - Get uploaded images
router.get('/media', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can view images' 
      });
    }

    const result = await pool.query(
      `SELECT id, filename, mime_type, file_size, alt_text_en, alt_text_tr, 
              alt_text_pt, alt_text_es, created_at
       FROM cms_images 
       WHERE uploaded_by = $1 
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.user.id]
    );

    res.json({
      success: true,
      images: result.rows
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch images' 
    });
  }
});

// GET /api/cms-content/media/:id - Get image data
router.get('/media/:id/data', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT image_data, mime_type FROM cms_images WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Image not found' 
      });
    }

    const { image_data, mime_type } = result.rows[0];
    
    res.setHeader('Content-Type', mime_type);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.send(image_data);
  } catch (error) {
    console.error('Error fetching image data:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch image' 
    });
  }
});

// POST /api/cms-content/translate - Translate content using DeepL API
router.post('/translate', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'consultant') {
      return res.status(403).json({ 
        success: false, 
        error: 'Unauthorized: Only consultants can use translation' 
      });
    }

    const { text, target_langs = ['TR', 'PT', 'ES'] } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Text field is required and must be a string' 
      });
    }

    const deepl_api_key = process.env.DEEPL_API_KEY;

    if (!deepl_api_key) {
      return res.status(503).json({ 
        success: false, 
        error: 'DeepL API key not configured. Please contact administrator.' 
      });
    }

    // Call DeepL API for each target language
    const translations = {};
    
    for (const target_lang of target_langs) {
      try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${deepl_api_key}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            text,
            target_lang,
            source_lang: 'EN'
          })
        });

        if (!response.ok) {
          console.error(`DeepL API error for ${target_lang}:`, await response.text());
          translations[target_lang.toLowerCase()] = '';
          continue;
        }

        const data = await response.json();
        translations[target_lang.toLowerCase()] = data.translations[0].text;
      } catch (error) {
        console.error(`Error translating to ${target_lang}:`, error);
        translations[target_lang.toLowerCase()] = '';
      }
    }

    res.json({
      success: true,
      translations
    });
  } catch (error) {
    console.error('Error in translation endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Translation failed' 
    });
  }
});

export default router;
