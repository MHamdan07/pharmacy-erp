import User from '../models/User.js';

export const attachTenant = async (req, res, next) => {
  try {
    if (!req.user || (!req.user.id && !req.user._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id || req.user._id;
    const user = await User.findById(userId)
      .populate('pharmacy')
      .populate('branch')
      .populate('assignedBranches');

    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not active or found' });
    }

    req.userFull = user;

    const pharmacy = user.pharmacy;
    if (!pharmacy) {
      return res.status(403).json({ message: 'No pharmacy associated with this user' });
    }

    // Determine active branch context: check X-Branch-ID header or fallback to assigned user.branch
    const headerBranchId = req.headers['x-branch-id'];
    let activeBranchId = user.branch ? user.branch._id.toString() : null;

    if (headerBranchId) {
      const canAccess =
        ['SuperAdmin', 'Owner', 'Admin'].includes(user.role) ||
        user.assignedBranches?.some(b => b._id.toString() === headerBranchId) ||
        user.branch?._id.toString() === headerBranchId;

      if (canAccess) {
        activeBranchId = headerBranchId;
      }
    }

    req.pharmacyId = pharmacy._id;
    req.branchId = activeBranchId;
    req.pharmacy = pharmacy;
    req.tenant = {
      pharmacyId: pharmacy._id,
      branchId: activeBranchId
    };

    return next();
  } catch (error) {
    return next(error);
  }
};
