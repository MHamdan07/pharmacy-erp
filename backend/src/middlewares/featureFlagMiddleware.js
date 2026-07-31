import FeatureFlag from '../models/FeatureFlag.js';
import UsageLimit from '../models/UsageLimit.js';
import Subscription from '../models/Subscription.js';
import Branch from '../models/Branch.js';
import User from '../models/User.js';
import Medicine from '../models/Medicine.js';

// Middleware to enforce feature flag access
export const requireFeature = (flagName) => {
  return async (req, res, next) => {
    try {
      if (!req.pharmacyId) return next();

      // Check Active Subscription
      const sub = await Subscription.findOne({ pharmacy: req.pharmacyId });
      if (sub && sub.status === 'expired') {
        return res.status(403).json({
          message: 'Subscription Expired: Your pharmacy subscription has expired. Please renew to access this module.',
          subscriptionExpired: true
        });
      }

      // Check Feature Flags
      const flags = await FeatureFlag.findOne({ pharmacy: req.pharmacyId });
      if (flags && flags[flagName] === false) {
        return res.status(403).json({
          message: `Feature Locked: Your current subscription plan does not include '${flagName}'. Please upgrade your subscription.`,
          featureLocked: true,
          requiredFeature: flagName
        });
      }

      next();
    } catch (error) {
      console.error(`Feature flag check error (${flagName}):`, error);
      next();
    }
  };
};

// Middleware to enforce Branch creation limits
export const checkBranchLimit = async (req, res, next) => {
  try {
    if (!req.pharmacyId) return next();

    const limits = await UsageLimit.findOne({ pharmacy: req.pharmacyId });
    if (!limits) return next();

    const currentBranchesCount = await Branch.countDocuments({ pharmacy: req.pharmacyId });
    if (currentBranchesCount >= limits.maxBranches) {
      return res.status(403).json({
        message: `Branch Limit Reached: Your subscription plan allows up to ${limits.maxBranches} branch stores. Upgrade to create more branches.`,
        limitReached: true,
        maxBranches: limits.maxBranches
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to enforce User / Staff limits
export const checkUserLimit = async (req, res, next) => {
  try {
    if (!req.pharmacyId) return next();

    const limits = await UsageLimit.findOne({ pharmacy: req.pharmacyId });
    if (!limits) return next();

    const currentUsersCount = await User.countDocuments({
      pharmacy: req.pharmacyId,
      role: { $ne: 'SuperAdmin' },
      email: { $nin: ['owner@pharmacy.com', 'admin@yourcompany.com'] }
    });

    if (currentUsersCount >= limits.maxUsers) {
      return res.status(403).json({
        message: `User Limit Reached: Your subscription plan allows up to ${limits.maxUsers} staff members. Upgrade to invite more staff.`,
        limitReached: true,
        maxUsers: limits.maxUsers
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to enforce Medicine limits
export const checkMedicineLimit = async (req, res, next) => {
  try {
    if (!req.pharmacyId) return next();

    const limits = await UsageLimit.findOne({ pharmacy: req.pharmacyId });
    if (!limits) return next();

    const currentMedicinesCount = await Medicine.countDocuments({ pharmacy: req.pharmacyId });
    if (currentMedicinesCount >= limits.maxMedicines) {
      return res.status(403).json({
        message: `Medicine Limit Reached: Your subscription plan allows up to ${limits.maxMedicines} medicines. Upgrade to add more products.`,
        limitReached: true,
        maxMedicines: limits.maxMedicines
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
