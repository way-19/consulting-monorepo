// Input validation and sanitization middleware

export const validateDocumentUpload = (req, res, next) => {
  const { client_id, document_type, category } = req.body;
  
  // Validate required fields
  if (!client_id) {
    return res.status(400).json({ error: 'client_id is required' });
  }
  
  if (!document_type || !['accounting', 'official'].includes(document_type)) {
    return res.status(400).json({ error: 'Invalid document_type. Must be "accounting" or "official"' });
  }
  
  // Validate UUID format for client_id
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(client_id)) {
    return res.status(400).json({ error: 'Invalid client_id format' });
  }
  
  // Validate file
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Validate file type
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png'
  ];
  
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ 
      error: 'Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.' 
    });
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (req.file.size > maxSize) {
    return res.status(400).json({ 
      error: 'File too large. Maximum file size is 10MB.' 
    });
  }
  
  next();
};

export const validateMessage = (req, res, next) => {
  const { receiver_id, content } = req.body;
  
  // Validate required fields
  if (!receiver_id || !content) {
    return res.status(400).json({ error: 'receiver_id and content are required' });
  }
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(receiver_id)) {
    return res.status(400).json({ error: 'Invalid receiver_id format' });
  }
  
  // Validate content length
  if (typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }
  
  if (content.length > 5000) {
    return res.status(400).json({ error: 'Message content too long. Maximum 5000 characters.' });
  }
  
  // Sanitize content (prevent XSS)
  req.body.content = content.trim();
  
  next();
};

export const validatePagination = (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return res.status(400).json({ error: 'Invalid page number' });
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return res.status(400).json({ error: 'Invalid limit. Must be between 1 and 100' });
  }
  
  req.pagination = {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum
  };
  
  next();
};

// Sanitize SQL inputs to prevent SQL injection
export const sanitizeSqlInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential SQL injection patterns
  return input
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments
    .trim();
};
