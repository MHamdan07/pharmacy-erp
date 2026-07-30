import express from 'express';
import { getExpiryAnalytics, triggerAlert } from '../controllers/expiryController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant);

router.get('/analytics', getExpiryAnalytics);
router.post('/trigger-alert', triggerAlert);

export default router;
