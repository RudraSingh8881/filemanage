// frontend/src/utils/api.js
import axios from 'axios';

// Base API for JSON
const api = axios.create({
  baseURL: '/api',
});

// Upload API for FormData
const uploadApi = axios.create({
  baseURL: '/api',
});

// Add JWT token to every request with better logging
[api, uploadApi].forEach(instance => {
  instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Token present:', token ? 'Yes' : 'No');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.log('No token found in localStorage');
    }

    return config;
  });
});

// Add response interceptor for better error logging
[api, uploadApi].forEach(instance => {
  instance.interceptors.response.use(
    response => {
      console.log('API Response Success:', response.status, response.config.url);
      return response;
    },
    error => {
      console.log('API Response Error:', error.response?.status, error.config?.url);
      console.log('Error details:', error.response?.data);
      return Promise.reject(error);
    }
  );
});

// === AUTH ===
export const loginUser = async (email, password) => {
  try {
    // Try real MongoDB login first
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (error) {
    console.warn('Real /login failed, falling back to demo login...');
    // ✅ Fallback to simple-login if MongoDB not connected
    try {
      const fallback = await api.post('/simple-login', { email, password });
      localStorage.setItem('token', fallback.data.token);
      localStorage.setItem('user', JSON.stringify(fallback.data.user));
      return fallback.data.user;
    } catch (err) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message || 'Invalid email or password');
      }
      throw new Error('Login failed. Please try again.');
    }
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// === PINS ===
export const getPins = async (search = '', page = 1) => {
  try {
    console.log('Fetching pins...');
    const res = await api.get('/pins', { params: { search, page, limit: 12 } });
    console.log('Pins fetched successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching pins:', error);
    throw error;
  }
};

export const createPin = async (formData) => {
  const data = new FormData();
  data.append('title', formData.title);
  data.append('description', formData.description || '');
  data.append('image', formData.image);

  const res = await uploadApi.post('/pins', data);
  return res.data;
};

export const getUserPins = async (userId) => {
  const res = await api.get(`/pins/user/${userId}`);
  return res.data;
};

export const updatePin = async (pinId, pinData) => {
  try {
    console.log(`API Request: PUT /pins/${pinId}`);
    const res = await api.put(`/pins/${pinId}`, pinData);
    console.log(`API Response: ${res.status} /pins/${pinId}`);
    console.log('Pin updated successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error updating pin:', error);
    throw error;
  }
};

export const deletePin = async (pinId) => {
  try {
    console.log(`API Request: DELETE /pins/${pinId}`);
    const res = await api.delete(`/pins/${pinId}`);
    console.log(`API Response: ${res.status} /pins/${pinId}`);
    console.log('Pin deleted successfully');
    return res.data;
  } catch (error) {
    console.error('Error deleting pin:', error);
    throw error;
  }
};

// === REGISTER ===
export const registerUser = async (username, email, password) => {
  try {
    // Try real MongoDB registration first
    const res = await api.post('/register', { username, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res.data.user;
  } catch (error) {
    console.warn('Real /register failed, falling back to demo register...');
    // ✅ Fallback to simple-register if MongoDB not connected
    try {
      const fallback = await api.post('/simple-register', { username, email, password });
      localStorage.setItem('token', fallback.data.token);
      localStorage.setItem('user', JSON.stringify(fallback.data.user));
      return fallback.data.user;
    } catch (err) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Registration failed. Please try again.');
    }
  }
};

// === DEFAULT EXPORT ===
const API = {
  loginUser,
  registerUser,
  logoutUser,
  createPin,
  getPins,
  getUserPins,
  updatePin,
  deletePin
};

export default API;
