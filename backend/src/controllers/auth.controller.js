const authService = require('../services/auth.service');

class AuthController {
  /**
   * Handle user signup request.
   */
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;
      
      const result = await authService.signup({ name, email, password });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
