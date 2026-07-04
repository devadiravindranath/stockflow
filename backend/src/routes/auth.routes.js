const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateSignup, validateLogin } = require('../validators/auth.validator');

// Register a new user
router.post('/signup', validateSignup, authController.signup);

// Authenticate user
router.post('/login', validateLogin, authController.login);

module.exports = router;

