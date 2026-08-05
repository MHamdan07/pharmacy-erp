import API from '../api/axios';

export const prescriptionService = {
  getPrescriptions: async (params) => {
    const res = await API.get('/prescriptions', { params });
    return res.data;
  },
  getPrescriptionById: async (id) => {
    const res = await API.get(`/prescriptions/${id}`);
    return res.data;
  },
  uploadPrescription: async (data) => {
    const res = await API.post('/prescriptions/upload', data);
    return res.data;
  },
  batchUploadPrescriptions: async (data) => {
    const res = await API.post('/prescriptions/batch-upload', data);
    return res.data;
  },
  processOcrPreprocessing: async (id, data) => {
    const res = await API.post(`/prescriptions/${id}/process-ocr`, data);
    return res.data;
  },
  reviewPrescription: async (id, data) => {
    const res = await API.put(`/prescriptions/${id}/review`, data);
    return res.data;
  },
  approvePrescription: async (id, notes) => {
    const res = await API.put(`/prescriptions/${id}/approve`, { notes });
    return res.data;
  },
  convertToPosSale: async (id) => {
    const res = await API.post(`/prescriptions/${id}/pos-convert`);
    return res.data;
  },
  getAnalytics: async (params) => {
    const res = await API.get('/prescriptions/analytics', { params });
    return res.data;
  },
  searchPatients: async (q) => {
    const res = await API.get('/prescriptions/patients/search', { params: { q } });
    return res.data;
  },
  searchDoctors: async (q) => {
    const res = await API.get('/prescriptions/doctors/search', { params: { q } });
    return res.data;
  },
  getPatientHistory: async (patientId) => {
    const res = await API.get(`/prescriptions/patient-history/${patientId}`);
    return res.data;
  },
  getInventoryAvailability: async (medicineName) => {
    const res = await API.get('/prescriptions/inventory-availability', { params: { medicineName } });
    return res.data;
  }
};

export default prescriptionService;
