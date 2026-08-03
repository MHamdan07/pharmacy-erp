import express from 'express';
import {
  checkDrugInteractions,
  suggestGenericAlternatives,
  getAIDemandForecast
} from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(attachTenant);

router.post('/check-interactions', checkDrugInteractions);
router.post('/suggest-alternatives', suggestGenericAlternatives);
router.get('/demand-forecast', getAIDemandForecast);

export default router;
