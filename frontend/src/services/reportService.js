import API from '../api/axios';

export const reportService = {
  getSalesReport: async (params) => {
    const res = await API.get('/reports/sales', { params });
    return res.data;
  },
  getInventoryReport: async () => {
    const res = await API.get('/reports/inventory');
    return res.data;
  },
  getProfitReport: async (params) => {
    const res = await API.get('/reports/profit', { params });
    return res.data;
  },
};

export default reportService;
