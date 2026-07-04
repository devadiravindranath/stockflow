import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';
import organizationService from '../services/organization.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
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
        const userData = response.data.user;
        setUser(userData);
        
        // If user belongs to an organization, fetch its details
        if (userData.organization_id) {
          try {
            const orgResponse = await organizationService.getMyOrganization();
            setOrganization(orgResponse.data.data);
          } catch (orgError) {
            console.error('[AuthContext] Failed to fetch organization:', orgError);
          }
        }
      } catch (error) {
        console.error('[AuthContext] Session verification failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        setOrganization(null);
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
      
      if (userData.organization_id) {
        try {
          const orgResponse = await organizationService.getMyOrganization();
          setOrganization(orgResponse.data.data);
        } catch (e) {
          console.error(e);
        }
      }
      
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
    setOrganization(null);
  };

  const value = {
    user,
    organization,
    setOrganization,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
