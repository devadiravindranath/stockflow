const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const inventoryController = require('../controllers/inventory.controller');

// All inventory endpoints are protected
router.use(protect);

// GET /api/inventory - list all inventory transactions for the user's organization
router.get('/', inventoryController.getAll);

// GET /api/inventory/:id - get a single inventory transaction
router.get('/:id', inventoryController.getById);

module.exports = router;
