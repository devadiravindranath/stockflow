const ApiError = require('../utils/ApiError');

const validateProduct = (req, res, next) => {
  const { name, sku, price } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return next(new ApiError(400, 'Product name is required'));
  }

  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    return next(new ApiError(400, 'SKU is required'));
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || isNaN(price)) {
      return next(new ApiError(400, 'Price must be a valid number'));
    }
    if (price < 0) {
      return next(new ApiError(400, 'Price cannot be negative'));
    }
  }

  next();
};

module.exports = {
  validateProduct
};
