import express from 'express';
import {
  getCategories, createCategory,
  getSuppliers, createSupplier,
  getMedicines, createMedicine, updateMedicine, deleteMedicine,
  getBatches, addBatch, updateBatch, deleteBatch
} from '../controllers/inventoryController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';
import { subscriptionGatekeeper } from '../middlewares/subscriptionGatekeeperMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant, subscriptionGatekeeper);

// Categories
router.get('/categories', getCategories);
router.post('/categories', createCategory);

// Suppliers
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);

// Medicines
router.get('/medicines', getMedicines);
router.post('/medicines', createMedicine);
router.put('/medicines/:id', updateMedicine);
router.delete('/medicines/:id', authorizeRoles('Owner', 'Admin'), deleteMedicine);

// Batches (FEFO inventory)
router.get('/batches', getBatches);
router.post('/batches', addBatch);
router.put('/batches/:id', updateBatch);
router.delete('/batches/:id', authorizeRoles('Owner', 'Admin'), deleteBatch);

export default router;
