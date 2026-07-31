export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userFull || !req.userFull.role) {
      return res.status(403).json({ message: 'Access forbidden: No user role context' });
    }

    if (allowedRoles.includes(req.userFull.role) || req.userFull.role === 'Owner' || req.userFull.role === 'SuperAdmin') {
      return next();
    }

    return res.status(403).json({ message: `Access denied. Required roles: ${allowedRoles.join(', ')}` });
  };
};

export const authorizePermissions = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.userFull) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    if (['SuperAdmin', 'Owner', 'Admin'].includes(req.userFull.role)) {
      return next();
    }

    const userPerms = req.userFull.permissions || [];
    const hasPerm = requiredPermissions.every(perm => userPerms.includes(perm));

    if (!hasPerm) {
      return res.status(403).json({ message: `Requires permissions: ${requiredPermissions.join(', ')}` });
    }

    next();
  };
};

export default authorizeRoles;