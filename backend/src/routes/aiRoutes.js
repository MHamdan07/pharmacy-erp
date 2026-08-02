import express from 'express';
import {
  checkDrugInteractions,
  suggestGenericAlternatives,
  getAIDemandForecast
} from '../controllers/aiController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { tenantContext } from '../middlewares/tenantContext.js';

const router = express.Router();

router.use(authenticate);
router.use(tenantContext);

router.post('/check-interactions', checkDrugInteractions);
router.post('/suggest-alternatives', suggestGenericAlternatives);
router.get('/demand-forecast', getAIDemandForecast);

export default router;
