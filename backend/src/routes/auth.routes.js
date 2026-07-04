const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateSignup } = require('../validators/auth.validator');

// Register a new user
router.post('/signup', validateSignup, authController.signup);

module.exports = router;
