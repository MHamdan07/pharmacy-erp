import express from 'express';
import {
  createPurchaseOrder, receivePurchaseStock, getPurchases,
  makeSupplierPayment, getSupplierHistory
} from '../controllers/purchaseController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(attachTenant);

router.get('/', getPurchases);
router.post('/orders', authorizeRoles('Owner', 'Admin', 'Inventory Manager', 'Branch Manager'), createPurchaseOrder);
router.post('/orders/:purchaseId/receive', authorizeRoles('Owner', 'Admin', 'Inventory Manager', 'Branch Manager'), receivePurchaseStock);
router.post('/supplier-payments', authorizeRoles('Owner', 'Admin', 'Inventory Manager', 'Branch Manager'), makeSupplierPayment);
router.get('/suppliers/:supplierId/history', getSupplierHistory);

export default router;
