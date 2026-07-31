import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant);

router.get('/', getNotifications);
router.put('/read-all', markAsRead);

export default router;
