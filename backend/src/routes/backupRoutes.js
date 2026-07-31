import express from 'express';
import {
  createBackup, getBackups, verifyBackupIntegrity, restoreBackup
} from '../controllers/backupController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant);

router.get('/', getBackups);
router.post('/create', authorizeRoles('Owner', 'Admin'), createBackup);
router.post('/:backupId/verify', authorizeRoles('Owner', 'Admin'), verifyBackupIntegrity);
router.post('/:backupId/restore', authorizeRoles('Owner', 'Admin'), restoreBackup);

export default router;
