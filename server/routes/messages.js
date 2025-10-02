import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { messageLimiter } from '../middleware/rateLimiter.js';
import { validateMessage, validatePagination } from '../middleware/validator.js';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// GET /api/messages - Get messages for authenticated user
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { page, limit, offset } = req.pagination;
    const { conversation_with, unread_only } = req.query;
    
    let query = `
      SELECT 
        m.*,
        sender.first_name || ' ' || sender.last_name as sender_name,
        sender.avatar_url as sender_avatar,
        receiver.first_name || ' ' || receiver.last_name as receiver_name,
        receiver.avatar_url as receiver_avatar
      FROM messages m
      LEFT JOIN user_profiles sender ON m.sender_id = sender.id
      LEFT JOIN user_profiles receiver ON m.receiver_id = receiver.id
      WHERE (m.sender_id = $1 OR m.receiver_id = $1)
    `;
    
    const params = [userId];
    let paramCount = 2;
    
    // Filter by conversation partner
    if (conversation_with) {
      query += ` AND (
        (m.sender_id = $1 AND m.receiver_id = $${paramCount}) OR
        (m.sender_id = $${paramCount} AND m.receiver_id = $1)
      )`;
      params.push(conversation_with);
      paramCount++;
    }
    
    // Filter unread messages
    if (unread_only === 'true') {
      query += ` AND m.receiver_id = $1 AND m.is_read = false`;
    }
    
    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) as counted`,
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // Add pagination and ordering
    query += ` ORDER BY m.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      messages: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/messages/conversations - Get list of conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    const query = `
      SELECT DISTINCT ON (conversation_partner)
        conversation_partner,
        partner_name,
        partner_avatar,
        partner_role,
        latest_message,
        latest_message_time,
        unread_count
      FROM (
        SELECT 
          CASE 
            WHEN m.sender_id = $1 THEN m.receiver_id
            ELSE m.sender_id
          END as conversation_partner,
          CASE 
            WHEN m.sender_id = $1 THEN receiver.first_name || ' ' || receiver.last_name
            ELSE sender.first_name || ' ' || sender.last_name
          END as partner_name,
          CASE 
            WHEN m.sender_id = $1 THEN receiver.avatar_url
            ELSE sender.avatar_url
          END as partner_avatar,
          CASE 
            WHEN m.sender_id = $1 THEN receiver.role
            ELSE sender.role
          END as partner_role,
          m.content as latest_message,
          m.created_at as latest_message_time,
          (
            SELECT COUNT(*)
            FROM messages
            WHERE receiver_id = $1 
            AND sender_id = CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END
            AND is_read = false
          ) as unread_count
        FROM messages m
        LEFT JOIN user_profiles sender ON m.sender_id = sender.id
        LEFT JOIN user_profiles receiver ON m.receiver_id = receiver.id
        WHERE m.sender_id = $1 OR m.receiver_id = $1
        ORDER BY m.created_at DESC
      ) conversations
      ORDER BY conversation_partner, latest_message_time DESC
    `;
    
    const result = await pool.query(query, [userId]);
    
    res.json({
      conversations: result.rows
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/messages/unread-count - Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = $1 AND is_read = false',
      [userId]
    );
    
    res.json({
      unread_count: parseInt(result.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/messages/send - Send new message
router.post('/send', 
  authenticateToken, 
  messageLimiter,
  validateMessage,
  async (req, res) => {
    try {
      const { receiver_id, content, subject } = req.body;
      const { id: senderId } = req.user;
      
      // Prevent sending message to self
      if (receiver_id === senderId) {
        return res.status(400).json({ error: 'Cannot send message to yourself' });
      }
      
      // Verify receiver exists
      const receiverCheck = await pool.query(
        'SELECT id, role FROM user_profiles WHERE id = $1 AND is_active = true',
        [receiver_id]
      );
      
      if (receiverCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Receiver not found or inactive' });
      }
      
      // Check if sender has permission to message this receiver
      const senderData = await pool.query(
        'SELECT role FROM user_profiles WHERE id = $1',
        [senderId]
      );
      
      const senderRole = senderData.rows[0].role;
      const receiverRole = receiverCheck.rows[0].role;
      
      // Business rule: Clients can only message their assigned consultant
      if (senderRole === 'client') {
        const clientCheck = await pool.query(
          `SELECT c.id FROM clients c
           WHERE c.profile_id = $1 
           AND c.assigned_consultant_id = $2`,
          [senderId, receiver_id]
        );
        
        if (clientCheck.rows.length === 0) {
          return res.status(403).json({ 
            error: 'You can only message your assigned consultant' 
          });
        }
      }
      
      // Business rule: Consultants can only message their assigned clients or admins
      if (senderRole === 'consultant' && receiverRole === 'client') {
        const consultantCheck = await pool.query(
          `SELECT c.id FROM clients c
           WHERE c.profile_id = $1 
           AND c.assigned_consultant_id = $2`,
          [receiver_id, senderId]
        );
        
        if (consultantCheck.rows.length === 0) {
          return res.status(403).json({ 
            error: 'You can only message your assigned clients' 
          });
        }
      }
      
      // Insert message
      const insertQuery = `
        INSERT INTO messages (
          sender_id,
          receiver_id,
          content,
          subject,
          is_read
        ) VALUES ($1, $2, $3, $4, false)
        RETURNING *
      `;
      
      const result = await pool.query(insertQuery, [
        senderId,
        receiver_id,
        content,
        subject || null
      ]);
      
      // Get sender and receiver info for the response
      const messageWithDetails = await pool.query(`
        SELECT 
          m.*,
          sender.first_name || ' ' || sender.last_name as sender_name,
          sender.avatar_url as sender_avatar,
          receiver.first_name || ' ' || receiver.last_name as receiver_name,
          receiver.avatar_url as receiver_avatar
        FROM messages m
        LEFT JOIN user_profiles sender ON m.sender_id = sender.id
        LEFT JOIN user_profiles receiver ON m.receiver_id = receiver.id
        WHERE m.id = $1
      `, [result.rows[0].id]);
      
      res.status(201).json({
        message: 'Message sent successfully',
        data: messageWithDetails.rows[0]
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PATCH /api/messages/:id/read - Mark message as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    
    // Only the receiver can mark a message as read
    const result = await pool.query(
      `UPDATE messages 
       SET is_read = true 
       WHERE id = $1 AND receiver_id = $2
       RETURNING *`,
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Message not found or you are not the receiver' 
      });
    }
    
    res.json({
      message: 'Message marked as read',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/messages/mark-all-read - Mark all messages as read
router.patch('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { sender_id } = req.body;
    
    let query = 'UPDATE messages SET is_read = true WHERE receiver_id = $1';
    const params = [userId];
    
    // Optionally mark only messages from specific sender
    if (sender_id) {
      query += ' AND sender_id = $2';
      params.push(sender_id);
    }
    
    query += ' AND is_read = false RETURNING id';
    
    const result = await pool.query(query, params);
    
    res.json({
      message: 'Messages marked as read',
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/messages/:id - Delete message
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    
    // Only sender can delete their sent messages
    const result = await pool.query(
      'DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING id',
      [id, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Message not found or you are not the sender' 
      });
    }
    
    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
