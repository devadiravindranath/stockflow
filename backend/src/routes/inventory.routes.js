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

// POST /api/inventory - create a new inventory transaction
router.post('/', inventoryController.create);

// PUT /api/inventory/:id - update an existing transaction (not implemented yet)
router.put('/:id', inventoryController.update);

// DELETE /api/inventory/:id - delete a transaction (not implemented yet)
router.delete('/:id', inventoryController.remove);

module.exports = router;
