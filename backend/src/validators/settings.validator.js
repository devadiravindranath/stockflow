const ApiError = require('../utils/ApiError');

const validateSettings = (req, res, next) => {
  const { defaultLowStockThreshold } = req.body;

  if (defaultLowStockThreshold !== undefined && defaultLowStockThreshold !== null && defaultLowStockThreshold !== '') {
    const thresholdNum = Number(defaultLowStockThreshold);
    if (!Number.isInteger(thresholdNum)) {
      return next(new ApiError(400, 'Default Low Stock Threshold must be an integer'));
    }
    if (thresholdNum < 0) {
      return next(new ApiError(400, 'Default Low Stock Threshold cannot be negative'));
    }
    req.body.defaultLowStockThreshold = thresholdNum;
  } else {
    // If not provided, fallback to 5
    req.body.defaultLowStockThreshold = 5;
  }

  next();
};

module.exports = {
  validateSettings
};
