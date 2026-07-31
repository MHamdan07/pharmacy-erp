import API from '../api/axios';

export const inventoryService = {
  getMedicines: async (params) => {
    const res = await API.get('/inventory/medicines', { params });
    return res.data;
  },
  createMedicine: async (data) => {
    const res = await API.post('/inventory/medicines', data);
    return res.data;
  },
  updateMedicine: async (id, data) => {
    const res = await API.put(`/inventory/medicines/${id}`, data);
    return res.data;
  },
  addBatch: async (data) => {
    const res = await API.post('/inventory/batches', data);
    return res.data;
  },
  getBatches: async (params) => {
    const res = await API.get('/inventory/batches', { params });
    return res.data;
  },
  getCategories: async () => {
    const res = await API.get('/inventory/categories');
    return res.data;
  },
  getSuppliers: async () => {
    const res = await API.get('/inventory/suppliers');
    return res.data;
  },
};

export default inventoryService;
