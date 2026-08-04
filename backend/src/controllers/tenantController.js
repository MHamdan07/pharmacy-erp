import Pharmacy from '../models/Pharmacy.js';
import Branch from '../models/Branch.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import AuditLog from '../models/AuditLog.js';
import { generateTokens } from '../utils/generateTokens.js';

// Public endpoint: Register new Pharmacy Tenant + Initial Head Office Branch + Owner Account
export const registerTenant = async (req, res) => {
  const { pharmacyName, pharmacyCode, ownerName, ownerEmail, ownerPassword, phone, address } = req.body;

  try {
    const existingPharmacy = await Pharmacy.findOne({ code: pharmacyCode.toUpperCase() });
    if (existingPharmacy) {
      return res.status(400).json({ message: 'Pharmacy code already exists. Please choose another code.' });
    }

    const existingUser = await User.findOne({ email: ownerEmail.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Owner email address is already registered.' });
    }

    // 1. Create Pharmacy Tenant
    const pharmacy = await Pharmacy.create({
      name: pharmacyName,
      code: pharmacyCode.toUpperCase(),
      slug: pharmacyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      phone: phone || '',
      address: address || '',
      email: ownerEmail,
      plan: 'Professional',
      subscriptionStatus: 'active'
    });

    // 2. Create Initial Main Branch (HQ)
    const branch = await Branch.create({
      name: `${pharmacyName} Main Branch`,
      code: 'BR-01',
      pharmacy: pharmacy._id,
      phone: phone || '0000000000',
      address: address || 'Main Headquarter',
      isHeadquarter: true
    });

    // 3. Create Default Categories
    const defaultCategories = ['General', 'Antibiotics', 'Painkillers', 'Vitamins', 'First Aid', 'Personal Care'];
    await Category.insertMany(
      defaultCategories.map(cat => ({ name: cat, description: `Default ${cat} category`, pharmacy: pharmacy._id }))
    );

    // 4. Create Owner Account
    const owner = await User.create({
      name: ownerName,
      email: ownerEmail.toLowerCase(),
      password: ownerPassword,
      role: 'Owner',
      pharmacy: pharmacy._id,
      branch: branch._id,
      assignedBranches: [branch._id],
      phone: phone || ''
    });

    // Generate JWT access token
    const accessToken = generateTokens(res, owner._id);

    // Log Audit Event
    await AuditLog.create({
      pharmacy: pharmacy._id,
      branch: branch._id,
      user: owner._id,
      userName: owner.name,
      action: 'TENANT_REGISTERED',
      module: 'Tenant Management',
      details: `New Pharmacy Organization "${pharmacy.name}" (${pharmacy.code}) onboarded successfully.`
    });

    res.status(201).json({
      status: 'success',
      message: 'Pharmacy registered successfully',
      accessToken,
      pharmacy,
      branch,
      user: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        pharmacy: pharmacy._id,
        branch: branch._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new branch for an existing Pharmacy (Enforces Subscription Plan Limits)
export const createBranch = async (req, res) => {
  const { name, code, phone, address, receiptHeader, receiptFooter } = req.body;

  try {
    const existing = await Branch.findOne({ pharmacy: req.pharmacyId, code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: `Branch code '${code}' already exists in this pharmacy.` });
    }

    // 1. Check Subscription Plan Branch Limits
    const currentBranchCount = await Branch.countDocuments({ pharmacy: req.pharmacyId });
    const pharmacy = await Pharmacy.findById(req.pharmacyId);

    const planLimits = {
      Starter: 1,
      Professional: 3,
      Enterprise: 10,
      Unlimited: 999
    };
    const maxAllowed = planLimits[pharmacy?.plan || 'Professional'] || 3;

    if (currentBranchCount >= maxAllowed) {
      return res.status(403).json({
        message: `Branch creation limit reached (${currentBranchCount}/${maxAllowed}) for your ${pharmacy?.plan || 'Professional'} subscription plan. Please upgrade your subscription plan to add more branches.`
      });
    }

    // 2. Create New Branch
    const branch = await Branch.create({
      name,
      code: code.toUpperCase(),
      pharmacy: req.pharmacyId,
      phone,
      address,
      receiptHeader: receiptHeader || 'Thank you for visiting!',
      receiptFooter: receiptFooter || 'Get well soon!'
    });

    // 3. Auto-assign new branch to Pharmacy Owner(s)
    await User.updateMany(
      { pharmacy: req.pharmacyId, role: 'Owner' },
      { $addToSet: { assignedBranches: branch._id } }
    );

    // 4. Log Audit Trail
    await AuditLog.create({
      pharmacy: req.pharmacyId,
      branch: branch._id,
      user: req.userFull._id,
      userName: req.userFull.name,
      action: 'BRANCH_CREATED',
      module: 'Tenant Management',
      details: `Created new branch "${branch.name}" (${branch.code}). Branch count is now ${currentBranchCount + 1}/${maxAllowed}.`
    });

    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update existing Branch details (Owner/Admin)
export const updateBranch = async (req, res) => {
  const { name, code, phone, address, receiptHeader, receiptFooter } = req.body;

  try {
    const branch = await Branch.findOneAndUpdate(
      { _id: req.params.id, pharmacy: req.pharmacyId },
      {
        name,
        code: code?.toUpperCase(),
        phone,
        address,
        receiptHeader,
        receiptFooter
      },
      { new: true }
    );

    if (!branch) {
      return res.status(404).json({ message: 'Branch store not found' });
    }

    await AuditLog.create({
      pharmacy: req.pharmacyId,
      branch: branch._id,
      user: req.userFull._id,
      userName: req.userFull.name,
      action: 'BRANCH_UPDATED',
      module: 'Tenant Management',
      details: `Updated details for branch "${branch.name}" (${branch.code})`
    });

    res.json(branch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Branch Store (Owner/Admin)
export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findOne({ _id: req.params.id, pharmacy: req.pharmacyId });
    if (!branch) {
      return res.status(404).json({ message: 'Branch store not found' });
    }

    if (branch.isHeadquarter) {
      return res.status(400).json({ message: 'Cannot delete the Main Headquarter branch.' });
    }

    await Branch.deleteOne({ _id: branch._id });

    await AuditLog.create({
      pharmacy: req.pharmacyId,
      branch: req.branchId,
      user: req.userFull._id,
      userName: req.userFull.name,
      action: 'BRANCH_DELETED',
      module: 'Tenant Management',
      details: `Deleted branch store "${branch.name}" (${branch.code})`
    });

    res.json({ message: `Branch "${branch.name}" deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get branches of current Pharmacy (Filtered by Role permissions)
export const getBranches = async (req, res) => {
  try {
    let branches;
    if (['Owner', 'SuperAdmin'].includes(req.userFull?.role)) {
      // Pharmacy Owner or System SuperAdmin sees all branches of this pharmacy
      branches = await Branch.find({ pharmacy: req.pharmacyId }).sort({ createdAt: 1 });
    } else {
      // Non-owner staff (Branch Manager, Pharmacist, Cashier, etc.) ONLY see branches assigned to them
      const assignedIds = [
        req.userFull?.branch?._id || req.userFull?.branch,
        ...(req.userFull?.assignedBranches || []).map(b => b._id || b)
      ].filter(Boolean);

      branches = await Branch.find({
        pharmacy: req.pharmacyId,
        _id: { $in: assignedIds }
      }).sort({ createdAt: 1 });
    }

    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Pharmacy Details
export const getPharmacyDetails = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.pharmacyId);
    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Pharmacy Details & Settings (Owner Only)
export const updatePharmacyDetails = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.pharmacyId,
      req.body,
      { new: true, runValidators: true }
    );

    await AuditLog.create({
      pharmacy: req.pharmacyId,
      branch: req.branchId,
      user: req.userFull._id,
      userName: req.userFull.name,
      action: 'SETTINGS_UPDATED',
      module: 'Pharmacy Settings',
      details: `Updated pharmacy settings for "${pharmacy.name}"`
    });

    res.json(pharmacy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Suspend or Reactivate a Branch (Owner / Admin)
export const suspendBranch = async (req, res) => {
  try {
    const { branchId, status } = req.body; // status: 'active' | 'suspended'
    const branch = await Branch.findOneAndUpdate(
      { _id: branchId, pharmacy: req.pharmacyId },
      { isActive: status === 'active' },
      { new: true }
    );
    if (!branch) {
      return res.status(404).json({ message: 'Branch store not found' });
    }

    res.json({ message: `Branch status updated to ${status}`, branch });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Transfer Employee between branches (Owner / Admin)
export const transferEmployee = async (req, res) => {
  try {
    const { userId, targetBranchId } = req.body;
    const targetBranch = await Branch.findOne({ _id: targetBranchId, pharmacy: req.pharmacyId });
    if (!targetBranch) {
      return res.status(404).json({ message: 'Target branch store not found' });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, pharmacy: req.pharmacyId },
      { branch: targetBranch._id },
      { new: true }
    );

    res.json({ message: `Employee ${user?.name} transferred to ${targetBranch.name} successfully`, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

