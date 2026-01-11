const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// Admin dashboard route
router.get(
  '/dashboard',
  auth,
  authorize('admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome Admin',
      data: {
        totalUsers: 123,
        systemHealth: 'Good',
        loggedInAs: req.user.name
      }
    });
  }
);

module.exports = router;
