const ApiError = require('../utils/ApiError');

const validateProduct = (req, res, next) => {
  const { name, sku, price, description } = req.body;

  // Name: required, non-empty, max 100 chars
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return next(new ApiError(400, 'Product name is required'));
  }
  if (name.trim().length > 100) {
    return next(new ApiError(400, 'Product name cannot exceed 100 characters'));
  }

  // SKU: required, non-empty, max 50 chars, alphanumeric + hyphens only
  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    return next(new ApiError(400, 'SKU is required'));
  }
  if (sku.trim().length > 50) {
    return next(new ApiError(400, 'SKU cannot exceed 50 characters'));
  }
  if (!/^[A-Za-z0-9\-_]+$/.test(sku.trim())) {
    return next(new ApiError(400, 'SKU can only contain letters, numbers, hyphens, and underscores'));
  }

  // Price: optional, but if provided must be a non-negative number
  if (price !== undefined && price !== null && price !== '') {
    const priceNum = Number(price);
    if (isNaN(priceNum)) {
      return next(new ApiError(400, 'Price must be a valid number'));
    }
    if (priceNum < 0) {
      return next(new ApiError(400, 'Price cannot be negative'));
    }
    if (priceNum > 1_000_000) {
      return next(new ApiError(400, 'Price cannot exceed $1,000,000'));
    }
    // Coerce to number so downstream code always gets a number
    req.body.price = priceNum;
  } else {
    req.body.price = 0;
  }

  // Cost Price: optional, non-negative number
  const { cost_price } = req.body;
  if (cost_price !== undefined && cost_price !== null && cost_price !== '') {
    const costPriceNum = Number(cost_price);
    if (isNaN(costPriceNum)) {
      return next(new ApiError(400, 'Cost Price must be a valid number'));
    }
    if (costPriceNum < 0) {
      return next(new ApiError(400, 'Cost Price cannot be negative'));
    }
    if (costPriceNum > 1_000_000) {
      return next(new ApiError(400, 'Cost Price cannot exceed $1,000,000'));
    }
    req.body.cost_price = costPriceNum;
  } else {
    req.body.cost_price = 0;
  }

  // Description: optional, max 500 chars
  if (description && typeof description === 'string' && description.length > 500) {
    return next(new ApiError(400, 'Description cannot exceed 500 characters'));
  }

  // Sanitize name and sku on req.body for downstream use
  req.body.name = name.trim();
  req.body.sku = sku.trim().toUpperCase();

  next();
};

module.exports = {
  validateProduct
};
