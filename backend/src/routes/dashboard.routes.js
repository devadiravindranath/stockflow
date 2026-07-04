const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all dashboard routes
router.use(protect);

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
