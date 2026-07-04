const express = require('express');
const productController = require('../controllers/product.controller');
const { protect } = require('../middleware/auth');
const { validateProduct } = require('../validators/product.validator');

const router = express.Router();

// Apply protect middleware to all product routes
router.use(protect);

router.get('/', productController.getAllProducts);
router.post('/', validateProduct, productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
