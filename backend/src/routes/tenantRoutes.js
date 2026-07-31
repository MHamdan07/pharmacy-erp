import express from 'express';
import {
  registerTenant,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranches,
  getPharmacyDetails,
  updatePharmacyDetails
} from '../controllers/tenantController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';

const router = express.Router();

// Public: Onboard a new Pharmacy Organization
router.post('/register', registerTenant);

// Protected: Manage Branches and Pharmacy Details
router.use(protect, attachTenant);

// Pharmacy Tenant Internal Routes
router.get('/pharmacy', getPharmacyDetails);
router.put('/pharmacy', authorizeRoles('Owner', 'Admin'), updatePharmacyDetails);
router.get('/branches', getBranches);
router.post('/branches', authorizeRoles('Owner', 'Admin'), createBranch);
router.put('/branches/:id', authorizeRoles('Owner', 'Admin'), updateBranch);
router.delete('/branches/:id', authorizeRoles('Owner', 'Admin'), deleteBranch);

export default router;
