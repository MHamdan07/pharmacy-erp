const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access forbidden: No user context found' });
    }

    const userPermissions = req.user.role.permissions || [];
    
    // "Owner" role bypasses granular checks
    if (req.user.role.name === 'Owner') {
      return next();
    }

    const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      return res.status(403).json({ 
        message: `Forbidden: Requires permission [${requiredPermissions.join(', ')}]` 
      });
    }

    next();
  };
};

export default authorize;