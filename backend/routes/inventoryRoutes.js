import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getSuppliers,
  createSupplier,
  updateSupplier,
  getMedicines,
  createMedicine,
  updateMedicine,
  getPurchaseOrders,
  createPurchaseOrder,
  updatePurchaseOrder,
  getPurchaseReceipts,
  createPurchaseReceipt,
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/categories', protect, getCategories);
router.post('/categories', protect, createCategory);
router.put('/categories/:id', protect, updateCategory);
router.delete('/categories/:id', protect, deleteCategory);

router.get('/suppliers', protect, getSuppliers);
router.post('/suppliers', protect, createSupplier);
router.put('/suppliers/:id', protect, updateSupplier);

router.get('/medicines', protect, getMedicines);
router.post('/medicines', protect, createMedicine);
router.put('/medicines/:id', protect, updateMedicine);

router.get('/purchase-orders', protect, getPurchaseOrders);
router.post('/purchase-orders', protect, createPurchaseOrder);
router.put('/purchase-orders/:id', protect, updatePurchaseOrder);

router.get('/purchase-receipts', protect, getPurchaseReceipts);
router.post('/purchase-receipts', protect, createPurchaseReceipt);

export default router;
