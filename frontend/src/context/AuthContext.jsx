// frontend/src/context/AuthContext.jsx - ✅ UPDATED
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
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await API.loginUser(email, password);
      setUser(userData);
      // Redirect will be handled in the component
      return userData;
    } catch (err) {
      throw new Error('Login failed');
    }
  };

  // This swallows the error - DON'T DO THIS
const register = async (username, email, password) => {
  try {
    const response = await registerUser(username, email, password);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  } catch (error) {
    console.log(error); // Error doesn't get passed to Register.jsx
  }
};

  const logout = () => {
    API.logoutUser();
    setUser(null);
    // Redirect will be handled in the component
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};