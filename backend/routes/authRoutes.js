const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');
const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors
} = require('../middleware/validators');

// POST /register - Register a new user
router.post('/register', registerValidationRules, handleValidationErrors, registerUser);

// POST /login - Login a user
router.post('/login', loginValidationRules, handleValidationErrors, loginUser);

// GET /me - Get current logged-in user (protected route)
router.get('/me', auth, getMe);

module.exports = router;

