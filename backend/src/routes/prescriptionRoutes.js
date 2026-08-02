import express from 'express';
import {
  uploadPrescription,
  getPrescriptions,
  approvePrescription
} from '../controllers/prescriptionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { tenantContext } from '../middlewares/tenantContext.js';

const router = express.Router();

router.use(authenticate);
router.use(tenantContext);

router.post('/upload', uploadPrescription);
router.get('/', getPrescriptions);
router.put('/:id/approve', approvePrescription);

export default router;
