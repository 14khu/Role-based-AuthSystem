const express = require('express');
const router = express.Router();

// Route imports
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// API info route
router.get('/', (req, res) => {
  res.json({
    message: 'Role-based Authentication API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      // users: '/api/users'
    }
  });
});

// Auth routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

