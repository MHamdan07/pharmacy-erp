import express from 'express';
import {
  getMySubscription,
  getSubscriptionPlans,
  changeSubscriptionPlan,
  cancelSubscription,
  reactivateSubscription
} from '../controllers/subscriptionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { attachTenant } from '../middlewares/tenantMiddleware.js';
import { authorizeRoles } from '../middlewares/rbacMiddleware.js';

const router = express.Router();

router.use(protect, attachTenant);

router.get('/my-subscription', getMySubscription);
router.get('/plans', getSubscriptionPlans);
router.post('/change-plan', authorizeRoles('Owner', 'SuperAdmin', 'Admin'), changeSubscriptionPlan);
router.post('/change-plan/:pharmacyId', authorizeRoles('Owner', 'SuperAdmin'), changeSubscriptionPlan);
router.post('/cancel-subscription', authorizeRoles('Owner', 'SuperAdmin'), cancelSubscription);
router.post('/reactivate-subscription', authorizeRoles('Owner', 'SuperAdmin'), reactivateSubscription);

export default router;
