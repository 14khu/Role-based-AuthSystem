const mongoose = require('mongoose');

/**
 * Connect to MongoDB database with retry/backoff logic
 * Uses DATABASE_URL from environment variables
 */
const connectDB = async () => {
  // Ensure Mongoose strictQuery setting consistent with Mongoose 7+ expectations
  mongoose.set('strictQuery', false);

  const maxRetries = 10;
  let attempt = 0;

  const connectWithRetry = async () => {
    attempt += 1;
    const backoff = Math.min(5000 * attempt, 30000); // up to 30s
    try {
      const conn = await mongoose.connect(process.env.DATABASE_URL, {
        // The default options are fine for Mongoose 6+, but adding family helps on some systems
        family: 4,
      });

      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`📊 Database: ${conn.connection.name}`);

      // Connection-level event handlers
      mongoose.connection.on('connected', () => {
        console.log('📗 Mongoose connection event: connected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('📘 Mongoose connection event: reconnected');
      });

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error event:', err);
      });

      mongoose.connection.on('disconnected', async () => {
        console.warn('⚠️  MongoDB disconnected — attempting to reconnect');
        // Try to reconnect using backoff
        if (attempt <= maxRetries) {
          setTimeout(() => connectWithRetry(), backoff);
        } else {
          console.error(`Exceeded max MongoDB reconnect attempts (${maxRetries}).`);
        }
      });

      // Don't exit here; let the server continue while we attempt reconnects if needed
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt} failed:`, error.message || error);
      if (attempt < maxRetries) {
        console.log(`Retrying to connect in ${Math.min(5000 * attempt, 30000)}ms...`);
        await new Promise((res) => setTimeout(res, Math.min(5000 * attempt, 30000)));
        return connectWithRetry();
      }

      console.error('Please check your DATABASE_URL in .env file and network access (IP whitelist, credentials).');
      // After exhausting retries, throw to allow upstream handling
      throw error;
    }
  };

  // Start the initial connection attempts
  return connectWithRetry();
};

module.exports = connectDB;

