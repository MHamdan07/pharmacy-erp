import Subscription from '../models/Subscription.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import FeatureFlag from '../models/FeatureFlag.js';
import UsageLimit from '../models/UsageLimit.js';
import Pharmacy from '../models/Pharmacy.js';
import Branch from '../models/Branch.js';
import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import AuditLog from '../models/AuditLog.js';

// Seed default plans into DB if empty
export const ensureDefaultPlansExist = async () => {
  const count = await SubscriptionPlan.countDocuments();
  if (count === 0) {
    await SubscriptionPlan.create([
      {
        name: 'Starter',
        price: 99,
        yearlyPrice: 990,
        billingCycle: 'monthly',
        description: 'For single location small pharmacies',
        limits: { maxBranches: 1, maxUsers: 3, maxMedicines: 500, maxStorageGB: 2, maxApiRequests: 5000 },
        features: {
          pos: true, inventory: true, medicines: true, expiry: true, barcode: true, qrScanner: true,
          reports: true, customers: true, multiBranch: false, accounting: false, purchaseApproval: false,
          sms: false, email: false, clinicalWarnings: false, auditLogs: false, riskMatrix: false,
          transfers: false, purchases: false, backups: false, aiForecast: false, voiceSearch: false, webhooks: false, apiAccess: false
        }
      },
      {
        name: 'Professional',
        price: 299,
        yearlyPrice: 2990,
        billingCycle: 'monthly',
        description: 'For growing multi-branch pharmacy chains',
        limits: { maxBranches: 5, maxUsers: 15, maxMedicines: 99999, maxStorageGB: 20, maxApiRequests: 50000 },
        features: {
          pos: true, inventory: true, medicines: true, expiry: true, barcode: true, qrScanner: true,
          reports: true, customers: true, multiBranch: true, accounting: true, purchaseApproval: true,
          sms: true, email: true, clinicalWarnings: true, auditLogs: true, riskMatrix: true,
          transfers: true, purchases: true, backups: true, aiForecast: false, voiceSearch: false, webhooks: false, apiAccess: false
        }
      },
      {
        name: 'Enterprise',
        price: 799,
        yearlyPrice: 7990,
        billingCycle: 'monthly',
        description: 'For large pharmacy chains requiring AI & unlimited scaling',
        limits: { maxBranches: 999, maxUsers: 999, maxMedicines: 999999, maxStorageGB: 100, maxApiRequests: 500000 },
        features: {
          pos: true, inventory: true, medicines: true, expiry: true, barcode: true, qrScanner: true,
          reports: true, customers: true, multiBranch: true, accounting: true, purchaseApproval: true,
          sms: true, email: true, clinicalWarnings: true, auditLogs: true, riskMatrix: true,
          transfers: true, purchases: true, backups: true, aiForecast: true, voiceSearch: true, webhooks: true, apiAccess: true
        }
      }
    ]);
  }
};

// Helper: Regenerate Feature Flags & Usage Limits for a Pharmacy based on Plan Name
export const syncPharmacyPlanFeatures = async (pharmacyId, planName) => {
  await ensureDefaultPlansExist();

  let planObj = await SubscriptionPlan.findOne({ name: planName });
  if (!planObj) {
    planObj = await SubscriptionPlan.findOne({ name: 'Professional' });
  }

  // Update or Create Subscription
  const renewalDate = new Date();
  renewalDate.setDate(renewalDate.getDate() + 30);

  let sub = await Subscription.findOne({ pharmacy: pharmacyId });
  if (!sub) {
    sub = await Subscription.create({
      pharmacy: pharmacyId,
      plan: planObj._id,
      planName: planObj.name,
      price: planObj.price,
      status: 'active',
      renewalDate,
      expiresAt: renewalDate,
      cancelAtPeriodEnd: false,
      autoRenew: true
    });
  } else {
    sub.plan = planObj._id;
    sub.planName = planObj.name;
    sub.price = planObj.price;
    sub.status = 'active';
    sub.renewalDate = renewalDate;
    sub.expiresAt = renewalDate;
    sub.cancelAtPeriodEnd = false;
    sub.cancelledAt = null;
    sub.autoRenew = true;
    await sub.save();
  }

  // Sync FeatureFlags
  await FeatureFlag.findOneAndUpdate(
    { pharmacy: pharmacyId },
    { pharmacy: pharmacyId, plan: planObj._id, ...planObj.features },
    { upsert: true, new: true }
  );

  // Sync UsageLimits
  await UsageLimit.findOneAndUpdate(
    { pharmacy: pharmacyId },
    { pharmacy: pharmacyId, plan: planObj._id, ...planObj.limits },
    { upsert: true, new: true }
  );

  // Also update Pharmacy model plan string & featureFlags
  await Pharmacy.findByIdAndUpdate(pharmacyId, {
    plan: planObj.name,
    subscriptionStatus: 'active',
    featureFlags: {
      barcode: planObj.features.barcode,
      qrScanner: planObj.features.qrScanner,
      sms: planObj.features.sms,
      email: planObj.features.email,
      multiBranch: planObj.features.multiBranch,
      auditLogs: planObj.features.auditLogs,
      aiForecast: planObj.features.aiForecast,
      clinicalWarnings: planObj.features.clinicalWarnings
    }
  });

  return sub;
};

// Get My Pharmacy Subscription Details & Check Expiration Status
export const getMySubscription = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId;
    let sub = await Subscription.findOne({ pharmacy: pharmacyId }).populate('plan');

    if (!sub) {
      const pharmacy = await Pharmacy.findById(pharmacyId);
      sub = await syncPharmacyPlanFeatures(pharmacyId, pharmacy?.plan || 'Professional');
    }

    // Dynamic Expiration Check
    const now = new Date();
    const expiryDate = sub.expiresAt || sub.renewalDate || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (now > expiryDate && sub.status !== 'active') {
      sub.status = 'expired';
      await sub.save();
      await Pharmacy.findByIdAndUpdate(pharmacyId, { subscriptionStatus: 'expired' });
    }

    const featureFlags = await FeatureFlag.findOne({ pharmacy: pharmacyId });
    const usageLimits = await UsageLimit.findOne({ pharmacy: pharmacyId });

    // Calculate usage metrics
    const branchesUsed = await Branch.countDocuments({ pharmacy: pharmacyId });
    const usersUsed = await User.countDocuments({
      pharmacy: pharmacyId,
      role: { $ne: 'SuperAdmin' },
      email: { $nin: ['owner@pharmacy.com', 'admin@yourcompany.com'] }
    });
    const medicinesUsed = await Medicine.countDocuments({ pharmacy: pharmacyId });

    // Calculate remaining days until expiration
    const remainingDays = Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)));

    res.json({
      subscription: sub,
      featureFlags: featureFlags || {},
      usageLimits: usageLimits || {},
      usageStats: {
        branchesUsed,
        usersUsed,
        medicinesUsed,
        storageUsedGB: 0.4
      },
      remainingDays,
      expirationDateFormatted: expiryDate.toLocaleDateString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Available Subscription Plans
export const getSubscriptionPlans = async (req, res) => {
  try {
    await ensureDefaultPlansExist();
    const plans = await SubscriptionPlan.find({ status: 'active' }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request or Upgrade Subscription Plan
export const changeSubscriptionPlan = async (req, res) => {
  try {
    const { planName, billingCycle } = req.body;
    const targetPharmacyId = req.params.pharmacyId || req.pharmacyId;

    const sub = await syncPharmacyPlanFeatures(targetPharmacyId, planName);

    await AuditLog.create({
      pharmacy: targetPharmacyId,
      branch: req.branchId || null,
      user: req.userFull?._id || null,
      userName: req.userFull?.name || 'System',
      action: 'PLAN_UPDATED',
      module: 'SaaS Subscriptions',
      details: `Subscription plan updated to "${planName}"`
    });

    res.json({
      message: `Subscription successfully updated to ${planName} Plan!`,
      subscription: sub
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancel Subscription (cancelAtPeriodEnd = true, remains ACTIVE until expiration)
export const cancelSubscription = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId;

    let sub = await Subscription.findOne({ pharmacy: pharmacyId });
    if (!sub) {
      return res.status(404).json({ message: 'No active subscription found.' });
    }

    sub.status = 'cancelled';
    sub.cancelAtPeriodEnd = true;
    sub.cancelledAt = new Date();
    sub.autoRenew = false;
    await sub.save();

    await Pharmacy.findByIdAndUpdate(pharmacyId, { subscriptionStatus: 'cancelled' });

    await AuditLog.create({
      pharmacy: pharmacyId,
      branch: req.branchId || null,
      user: req.userFull?._id || null,
      userName: req.userFull?.name || 'System',
      action: 'SUBSCRIPTION_CANCELLED',
      module: 'SaaS Subscriptions',
      details: `Subscription cancelled (remains accessible until end of billing period: ${sub.renewalDate?.toLocaleDateString()})`
    });

    res.json({
      message: 'Subscription has been cancelled. Access remains active until the end of the billing period.',
      subscription: sub
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reactivate Subscription
export const reactivateSubscription = async (req, res) => {
  try {
    const pharmacyId = req.pharmacyId;
    const pharmacy = await Pharmacy.findById(pharmacyId);
    const planName = pharmacy?.plan || 'Professional';

    const sub = await syncPharmacyPlanFeatures(pharmacyId, planName);

    await AuditLog.create({
      pharmacy: pharmacyId,
      branch: req.branchId || null,
      user: req.userFull?._id || null,
      userName: req.userFull?.name || 'System',
      action: 'SUBSCRIPTION_REACTIVATED',
      module: 'SaaS Subscriptions',
      details: `Subscription reactivated successfully for pharmacy`
    });

    res.json({
      message: 'Subscription reactivated successfully!',
      subscription: sub
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
