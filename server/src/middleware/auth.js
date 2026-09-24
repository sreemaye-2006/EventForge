const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_jwt_key_eventforge_production_123');
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error in authentication' });
  }
};

// Grant access to specific roles (case-insensitive & ADMIN always allowed)
exports.authorize = (...roles) => {
  const upperRoles = roles.map(r => r.toUpperCase());
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const userRole = (req.user.role || '').toUpperCase();
    if (userRole === 'ADMIN' || upperRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `User role ${req.user.role} is not authorized to access this route`
    });
  };
};

// Ensure organization access
exports.ensureOrganizationAccess = async (req, res, next) => {
  try {
    const orgId = req.params.orgId || req.body.organizationId || req.query.organizationId;
    if (!orgId) {
      return res.status(400).json({ success: false, message: 'Organization ID is required' });
    }

    if (req.user.role === 'ADMIN') {
      return next();
    }

    if (req.user.organizationId && req.user.organizationId.toString() === orgId.toString()) {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Not authorized to access this organization' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
