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

// Optional protect (attaches user if valid token present, otherwise proceeds without error)
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_jwt_key_eventforge_production_123');
        const user = await User.findById(decoded.id);
        if (user) req.user = user;
      } catch (err) {
        // Proceed as unauthenticated
      }
    }
    next();
  } catch (error) {
    next();
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

// Event-scoped authorization: guarantees only the event organizer, assigned staff, or platform admin can manage an event
exports.requireEventAccess = (roleRequired = 'ORGANIZER') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      if (req.user.role === 'ADMIN') {
        return next();
      }

      const Event = require('../models/Event');
      const eventId = req.params.eventId || req.params.id || req.body.eventId || req.query.eventId;

      if (!eventId) {
        return next(); // If no eventId in request params/body, proceed to controller validation
      }

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }

      const isOrganizer = event.organizerId && event.organizerId.toString() === req.user._id.toString();
      const isOrgOwner = event.organizationId && req.user.organizationId && event.organizationId.toString() === req.user.organizationId.toString();
      const isAssignedStaff = Array.isArray(event.staffIds) && event.staffIds.some(sId => sId.toString() === req.user._id.toString());

      if (roleRequired === 'STAFF' && (isOrganizer || isOrgOwner || isAssignedStaff)) {
        req.event = event;
        return next();
      }

      if (isOrganizer || isOrgOwner) {
        req.event = event;
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to manage this specific event'
      });
    } catch (error) {
      console.error('requireEventAccess error:', error);
      res.status(500).json({ success: false, message: 'Authorization error checking event access' });
    }
  };
};

// Aliases for compatibility
exports.authenticateUser = exports.protect;
exports.requireRole = exports.authorize;
