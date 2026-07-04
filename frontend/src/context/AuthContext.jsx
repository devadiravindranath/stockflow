import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user session on mount
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        setUser(response.data.user);
      } catch (error) {
        console.error('[AuthContext] Session verification failed:', error);
        // Clear corrupt or expired credentials
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  /**
   * Handle user login.
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  /**
   * Handle user signup.
   */
  const signup = async (name, email, password) => {
    try {
      const response = await authService.signup(name, email, password);
      const { user: userData, token } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  /**
   * Handle user logout.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
