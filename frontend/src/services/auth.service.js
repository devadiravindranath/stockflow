import api from './api';

const authService = {
  /**
   * Register a new user account.
   */
  async signup(name, email, password) {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  /**
   * Log in an existing user.
   */
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Fetch details of the currently authenticated user.
   */
  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default authService;
