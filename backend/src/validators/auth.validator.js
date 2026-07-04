const ApiError = require('../utils/ApiError');

/**
 * Validate user signup request body.
 */
function validateSignup(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return next(new ApiError(400, 'Name is required and must be a valid string'));
  }

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new ApiError(400, 'A valid email address is required'));
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return next(new ApiError(400, 'Password is required and must be at least 8 characters long'));
  }

  next();
}

/**
 * Validate user login request body.
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return next(new ApiError(400, 'Email is required'));
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return next(new ApiError(400, 'Password is required'));
  }

  next();
}

module.exports = {
  validateSignup,
  validateLogin,
};

