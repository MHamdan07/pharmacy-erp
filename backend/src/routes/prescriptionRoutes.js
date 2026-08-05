import express from 'express';
import {
  uploadPrescription,
  batchUploadPrescriptions,
  processOcrPreprocessing,
  reviewPrescription,
  convertPrescriptionToPosSale,
  getPrescriptionAnalytics,
  getPatientPrescriptionHistory,
  getInventoryAvailability,
  getPrescriptions,
  getPrescriptionById,
  searchPatients,
  searchDoctors,
  approvePrescription
} from '../controllers/prescriptionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(attachTenant);

router.get('/analytics', getPrescriptionAnalytics);
router.get('/patients/search', searchPatients);
router.get('/doctors/search', searchDoctors);
router.get('/inventory-availability', getInventoryAvailability);
router.get('/patient-history/:patientId', getPatientPrescriptionHistory);
router.get('/', getPrescriptions);
router.get('/:id', getPrescriptionById);
router.post('/upload', uploadPrescription);
router.post('/batch-upload', batchUploadPrescriptions);
router.post('/:id/process-ocr', processOcrPreprocessing);
router.put('/:id/review', reviewPrescription);
router.post('/:id/pos-convert', convertPrescriptionToPosSale);
router.put('/:id/approve', approvePrescription);

export default router;

