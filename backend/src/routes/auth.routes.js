const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateSignup, validateLogin } = require('../validators/auth.validator');
const { protect } = require('../middleware/auth');

// Register a new user
router.post('/signup', validateSignup, authController.signup);

// Authenticate user
router.post('/login', validateLogin, authController.login);

// Get current user profile
router.get('/me', protect, authController.getProfile);

module.exports = router;


