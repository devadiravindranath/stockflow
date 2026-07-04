const ApiError = require('../utils/ApiError');

// Expected transaction types
const VALID_TYPES = ['stock_in', 'stock_out', 'adjustment'];

/**
 * Middleware to validate inventory transaction payloads.
 * Used for POST /api/inventory (creation).
 */
function validateInventory(req, res, next) {
  const { product_id, quantity, type, reference, notes } = req.body;

  // product_id: required, integer > 0
  if (!product_id || typeof product_id !== 'number' || !Number.isInteger(product_id) || product_id <= 0) {
    return next(new ApiError(400, 'product_id is required and must be a positive integer'));
  }

  // type: required, must be one of VALID_TYPES
  if (!type || typeof type !== 'string' || !VALID_TYPES.includes(type)) {
    return next(new ApiError(400, `type is required and must be one of ${VALID_TYPES.join(', ')}`));
  }

  // quantity: required, number (positive for stock_in/stock_out, can be any non‑zero for adjustment)
  if (quantity === undefined || quantity === null) {
    return next(new ApiError(400, 'quantity is required'));
  }
  const qtyNum = Number(quantity);
  if (isNaN(qtyNum) || qtyNum === 0) {
    return next(new ApiError(400, 'quantity must be a non‑zero number'));
  }
  if ((type === 'stock_in' || type === 'stock_out') && qtyNum < 0) {
    return next(new ApiError(400, `quantity must be positive for type '${type}'`));
  }

  // reference: optional, if present must be string <= 200 characters
  if (reference && (typeof reference !== 'string' || reference.length > 200)) {
    return next(new ApiError(400, 'reference must be a string up to 200 characters'));
  }

  // notes: optional, if present must be string <= 500 characters
  if (notes && (typeof notes !== 'string' || notes.length > 500)) {
    return next(new ApiError(400, 'notes must be a string up to 500 characters'));
  }

  // All good – forward to controller
  next();
}

module.exports = { validateInventory };
