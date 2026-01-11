const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /register - Register a new user
router.post('/register', registerUser);

// POST /login - Login a user
router.post('/login', loginUser);

// GET /me - Get current logged-in user (protected route)
router.get('/me', auth, getMe);

module.exports = router;

