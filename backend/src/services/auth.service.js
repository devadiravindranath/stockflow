const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

class AuthService {
  /**
   * Handle user registration business logic.
   * @param {object} signupData - Data from the signup request.
   * @param {string} signupData.name - User's name.
   * @param {string} signupData.email - User's email address.
   * @param {string} signupData.password - User's raw password.
   * @returns {Promise<object>} Object containing the user data and the JWT token.
   */
  async signup({ name, email, password }) {
    // 1. Check if user already exists
    const existingUser = userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(409, 'A user with this email address already exists');
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in the database
    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'owner', // Default role for MVP signup
    });

    // 4. Generate access token
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: newUser,
      token,
    };
  }

  /**
   * Handle user authentication/login business logic.
   * @param {object} credentials - Login email and password.
   * @returns {Promise<object>} Object containing the user data (excluding password) and JWT token.
   */
  async login({ email, password }) {
    // 1. Find user by email
    const user = userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 2. Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // 3. Generate access token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // 4. Return user info (sanitize password)
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id,
      },
      token,
    };
  }
}

module.exports = new AuthService();
