const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

/**
 * Protect routes by verifying JWT tokens and attaching user data to the request.
 */
function protect(req, res, next) {
  let token;

  // 1. Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, token missing'));
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Find user and verify existence
    const user = userRepository.findById(decoded.id);
    if (!user) {
      return next(new ApiError(401, 'Not authorized, user not found'));
    }

    // 4. Attach user to request (omit password for security)
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized, token invalid or expired'));
  }
}

module.exports = {
  protect,
};
