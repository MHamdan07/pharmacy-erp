import axios from 'axios';

const defaultApiUrl =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('pharmacy-erp-frontend-')
    ? 'https://pharmacy-erp-zeta.vercel.app/api/v1'
    : '/api/v1');

const API = axios.create({
  baseURL: defaultApiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const activeBranchId = localStorage.getItem('activeBranchId');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (activeBranchId && config.headers) {
      config.headers['X-Branch-ID'] = activeBranchId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to gracefully handle expired JWT sessions
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Session expired or token invalid
      localStorage.removeItem('accessToken');
      localStorage.removeItem('activeBranchId');
      
      // Redirect to login if not already on public auth page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
