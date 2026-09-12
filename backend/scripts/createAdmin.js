/**
 * Standalone script to create or promote an admin user.
 * This is the ONLY supported way to create an admin account —
 * the public register API always forces role: 'user'.
 *
 * Usage:
 *   node scripts/createAdmin.js "Admin Name" admin@example.com StrongPassword123
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  const [, , name, email, password] = process.argv;

  if (!name || !email || !password) {
    console.error('Usage: node scripts/createAdmin.js <name> <email> <password>');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL, { family: 4 });
    console.log('Connected to MongoDB');

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail }).select('+password');

    if (existingUser) {
      existingUser.role = 'admin';
      await existingUser.save();
      console.log(`Existing user ${normalizedEmail} promoted to admin.`);
    } else {
      const user = new User({ name, email: normalizedEmail, password, role: 'admin' });
      await user.save();
      console.log(`Admin user ${normalizedEmail} created successfully.`);
    }
  } catch (error) {
    console.error('Failed to create/promote admin:', error.message || error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
