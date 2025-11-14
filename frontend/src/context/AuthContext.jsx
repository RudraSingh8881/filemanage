import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Also store userId separately for consistency
      if (userData.id) {
        localStorage.setItem('userId', userData.id);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await API.loginUser(email, password);
      setUser(userData);
      // Store userId separately for easy access
      if (userData.id) {
        localStorage.setItem('userId', userData.id);
      }
      return userData;
    } catch (err) {
      throw new Error('Login failed');
    }
  };

  // ✅ FIXED: Proper error handling and using API.registerUser
  const register = async (username, email, password) => {
    try {
      const userData = await API.registerUser(username, email, password);
      setUser(userData);
      // Store userId separately for easy access
      if (userData.id) {
        localStorage.setItem('userId', userData.id);
      }
      return userData;
    } catch (error) {
      // Re-throw the error so Register.jsx can handle it
      throw error;
    }
  };

  const logout = () => {
    API.logoutUser();
    localStorage.removeItem('userId'); // Clean up userId too
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};