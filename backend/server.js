require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import database connection
const connectDB = require('./config/database');

// Import routes and middleware
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Role-based Authentication API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api'
  });
});

// API routes
app.use('/api', apiRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
const startServer = async () => {
  let server;
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API available at http://localhost:${PORT}/api`);
      console.log(`Documentation: http://localhost:${PORT}/api\n`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      try {
        if (server) server.close(() => console.log('HTTP server closed'));
        // Close mongoose connection if open
        try { await require('mongoose').connection.close(false); console.log('Mongoose connection closed'); } catch (e) { console.warn('Error closing mongoose connection during shutdown:', e); }
      } catch (err) {
        console.error('Error during shutdown:', err);
      } finally {
        process.exit(0);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // Global error handlers for visibility during development
    process.on('unhandledRejection', (reason, p) => {
      console.error('Unhandled Rejection at:', p, 'reason:', reason);
      // Do not exit immediately so we can capture logs, but schedule a shutdown if needed
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception thrown:', err);
      // For safety exit after logging
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message || error);
    // Keep process alive for debugging; allow developer to inspect logs and retry
    // Optionally exit if you prefer: process.exit(1);
  }
};

// Start the application
startServer();

