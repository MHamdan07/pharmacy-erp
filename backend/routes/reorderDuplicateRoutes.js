import express from 'express';
import {
  getReorderDashboard,
  getCriticalReorders,
  getHighReorders,
  generateReorderSuggestions,
  getDuplicateLogs,
  checkDuplicateRealtime,
  mergeDuplicateMedicines
} from '../controllers/reorderDuplicateController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant);

// Reorder Suggestions Routes
router.get('/reorder', getReorderDashboard);
router.get('/reorder/critical', getCriticalReorders);
router.get('/reorder/high', getHighReorders);
router.post('/reorder/generate', authorizeRoles('Owner', 'Admin', 'Manager', 'InventoryManager'), generateReorderSuggestions);

// Duplicate Detection & Merge Routes
router.get('/duplicates', getDuplicateLogs);
router.post('/duplicates/check', checkDuplicateRealtime);
router.post('/duplicates/merge', authorizeRoles('Owner', 'Admin'), mergeDuplicateMedicines);

export default router;
