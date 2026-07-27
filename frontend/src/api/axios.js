import axios from 'axios';

const API = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Crucial for sending httpOnly refresh cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Access Token from memory if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
