import express from 'express';
import { checkout, processSale, getSales, getSalesHistory, getSaleById } from '../controllers/posController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';
import { subscriptionGatekeeper } from '../middlewares/subscriptionGatekeeperMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant, subscriptionGatekeeper);

router.post('/sales', processSale);
router.post('/checkout', checkout);
router.get('/sales', getSales);
router.get('/sales/:id', getSaleById);

export default router;
