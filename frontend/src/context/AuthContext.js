import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      // Don't logout on network errors - just clear the invalid token
      if (error.response?.status === 401) {
        logout();
      } else {
        // For network errors, just set loading to false and continue
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Add timeout to prevent hanging
      let timeoutId;
      const fetchPromise = fetchUser();
      
      timeoutId = setTimeout(() => {
        console.warn('User fetch timeout - continuing without user data');
        setLoading(false);
      }, 5000); // 5 second timeout
      
      fetchPromise.finally(() => {
        if (timeoutId) clearTimeout(timeoutId);
      });
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Only depend on token, fetchUser is stable

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, ...userData } = response.data.data;
      setToken(newToken);
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newToken);
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      // Validate required fields
      if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
        return {
          success: false,
          error: 'Please fill in all required fields',
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          error: 'Please enter a valid email address',
        };
      }

      // Validate password length
      if (userData.password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long',
        };
      }

      const response = await api.post('/auth/register', userData);
      const { token: newToken, ...user } = response.data.data;
      setToken(newToken);
      setUser(user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newToken);
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      
      // Better error handling for network/URL errors
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'ERR_BAD_REQUEST' || error.response?.data?.error) {
        errorMessage = error.response?.data?.error || errorMessage;
      } else if (error.message?.includes('protocol') || error.message?.includes('URL')) {
        errorMessage = 'API configuration error. Please contact support.';
        console.error('API URL error - check REACT_APP_API_URL environment variable');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };


  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPatient: user?.role === 'patient',
    isDoctor: user?.role === 'doctor',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
