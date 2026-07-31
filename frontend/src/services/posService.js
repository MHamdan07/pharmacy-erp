import API from '../api/axios';

export const posService = {
  createSale: async (saleData) => {
    const res = await API.post('/pos/sales', saleData);
    return res.data;
  },
  searchMedicinesForPOS: async (query) => {
    const res = await API.get('/pos/search', { params: { query } });
    return res.data;
  },
  getRecentSales: async (params) => {
    const res = await API.get('/pos/recent', { params });
    return res.data;
  },
};

export default posService;
