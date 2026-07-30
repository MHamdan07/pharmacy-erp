import Subscription from '../models/Subscription.js';
import Pharmacy from '../models/Pharmacy.js';

export const subscriptionGatekeeper = async (req, res, next) => {
  try {
    // 1. SuperAdmin / Platform Owner bypasses pharmacy subscription gatekeeper
    if (req.user && req.user.role === 'SuperAdmin') {
      return next();
    }

    if (!req.pharmacyId) {
      return next();
    }

    // 2. Fetch Active Subscription
    let sub = await Subscription.findOne({ pharmacy: req.pharmacyId });

    if (!sub) {
      const pharmacy = await Pharmacy.findById(req.pharmacyId);
      if (pharmacy && pharmacy.subscriptionStatus) {
        if (pharmacy.subscriptionStatus === 'suspended') {
          return res.status(403).json({
            subscriptionSuspended: true,
            message: 'ACCOUNT SUSPENDED: Your pharmacy account has been suspended by the SaaS platform administrator. Please contact support.'
          });
        }
        if (pharmacy.subscriptionStatus === 'expired') {
          return res.status(403).json({
            subscriptionExpired: true,
            message: 'SUBSCRIPTION EXPIRED: Your subscription has expired. Please renew your subscription to access ERP modules.'
          });
        }
      }
      return next();
    }

    const now = new Date();
    const expiryDate = sub.expiresAt || sub.renewalDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 3. Check for Automatic Expiration
    if (now > expiryDate) {
      sub.status = 'expired';
      await sub.save();
      await Pharmacy.findByIdAndUpdate(req.pharmacyId, { subscriptionStatus: 'expired' });
      return res.status(403).json({
        subscriptionExpired: true,
        message: 'SUBSCRIPTION EXPIRED: Your billing period has ended. Please renew your subscription to access ERP modules.'
      });
    }

    // 4. Enforce Status Locks
    if (sub.status === 'suspended') {
      return res.status(403).json({
        subscriptionSuspended: true,
        message: 'ACCOUNT SUSPENDED: Your pharmacy company account has been suspended by the SaaS platform administrator. Please contact support.'
      });
    }

    if (sub.status === 'expired') {
      return res.status(403).json({
        subscriptionExpired: true,
        message: 'SUBSCRIPTION EXPIRED: Your subscription has expired. Please renew your subscription to access ERP modules.'
      });
    }

    if (sub.status === 'pending_payment' || sub.status === 'payment_failed') {
      return res.status(403).json({
        paymentFailed: true,
        message: 'PAYMENT REQUIRED: Waiting for payment confirmation to unlock ERP modules.'
      });
    }

    if (sub.status === 'under_review') {
      return res.status(403).json({
        underReview: true,
        message: 'PAYMENT UNDER REVIEW: Your subscription payment is currently being verified by the platform team.'
      });
    }

    if (sub.status === 'none') {
      return res.status(403).json({
        subscriptionRequired: true,
        message: 'SUBSCRIPTION REQUIRED: No active subscription found for this company. Please select a plan to unlock Pharmacy ERP.'
      });
    }

    // CANCELLED status before expiration date -> ALLOW access until expiration date!
    // ACTIVE or TRIAL status -> ALLOW access!
    next();
  } catch (error) {
    console.error('Subscription Gatekeeper Middleware Error:', error);
    next(error);
  }
};
