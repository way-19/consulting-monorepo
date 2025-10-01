import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { apiLimiter } from './middleware/rateLimiter.js';
import documentsRouter from './routes/documents.js';
import messagesRouter from './routes/messages.js';
import clientsRouter from './routes/clients.js';
import usersRouter from './routes/users.js';
import tasksRouter from './routes/tasks.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';
import commissionsRouter from './routes/commissions.js';
import stripeWebhookRouter from './routes/stripe-webhook.js';
import dashboardRouter from './routes/dashboard.js';
import projectsRouter from './routes/projects.js';
import meetingsRouter from './routes/meetings.js';
import preferencesRouter from './routes/preferences.js';
import departmentsRouter from './routes/departments.js';
import activityRouter from './routes/activity.js';
import supportRouter from './routes/support.js';
import availabilityRouter from './routes/availability.js';
import mailboxRouter from './routes/mailbox.js';
import fileManagerRouter from './routes/file-manager.js';
import consultantServicesRouter from './routes/consultant-services.js';
import crossAssignmentsRouter from './routes/cross-assignments.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3002;

// Trust proxy for rate limiting behind Replit proxy
app.set('trust proxy', 1);

// CORS configuration - RESTRICTED for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    try {
      const originUrl = new URL(origin);
      const hostname = originUrl.hostname;
      
      // Allowed localhost origins
      const allowedLocalhost = [
        'localhost',
      ];
      
      // Check if localhost with any port
      if (allowedLocalhost.includes(hostname)) {
        return callback(null, true);
      }
      
      // Check if Replit domain
      if (hostname.endsWith('.replit.dev') || hostname.endsWith('.repl.co')) {
        return callback(null, true);
      }
      
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    } catch (err) {
      console.warn('CORS invalid origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// CRITICAL: Stripe webhook MUST have raw body parser BEFORE json middleware
// This route must be registered first to avoid body parsing conflicts
app.use('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhookRouter);

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Consulting19 API'
  });
});

// API Routes
app.use('/api/documents', documentsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/clients', dashboardRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/commissions', commissionsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/meetings', meetingsRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/activity', activityRouter);
app.use('/api/support', supportRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/mailbox', mailboxRouter);
app.use('/api/file-manager', fileManagerRouter);
app.use('/api/consultant-services', consultantServicesRouter);
app.use('/api/cross-assignments', crossAssignmentsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      error: 'CORS Error',
      message: 'Origin not allowed'
    });
  }
  
  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'File too large',
      message: 'Maximum file size is 10MB'
    });
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ 
      error: 'Unexpected file',
      message: 'Unexpected file field'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Your session token is invalid'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      error: 'Token expired',
      message: 'Your session has expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS: Restricted to allowed origins`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
