import express from 'express';
import { getDashboardMetrics, getAuditLogs } from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant);

router.get('/dashboard-metrics', getDashboardMetrics);
router.get('/audit-logs', getAuditLogs);

export default router;
