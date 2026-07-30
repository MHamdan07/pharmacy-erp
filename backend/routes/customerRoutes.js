import express from 'express';
import { getCustomers, createCustomer, getCustomerHistory } from '../controllers/customerController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant);

router.get('/customers', getCustomers);
router.post('/customers', createCustomer);
router.get('/customers/:id/history', getCustomerHistory);

export default router;
