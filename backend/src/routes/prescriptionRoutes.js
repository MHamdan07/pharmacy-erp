import express from 'express';
import {
  uploadPrescription,
  getPrescriptions,
  approvePrescription
} from '../controllers/prescriptionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(attachTenant);

router.post('/upload', uploadPrescription);
router.get('/', getPrescriptions);
router.put('/:id/approve', approvePrescription);

export default router;
