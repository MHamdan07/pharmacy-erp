import API from '../api/axios';

export const authService = {
  login: async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await API.get('/auth/me');
    return res.data;
  },
  registerTenant: async (data) => {
    const res = await API.post('/auth/register-tenant', data);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await API.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (data) => {
    const res = await API.post('/auth/reset-password', data);
    return res.data;
  },
};

export default authService;
