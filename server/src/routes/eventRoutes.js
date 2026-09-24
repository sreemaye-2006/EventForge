const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const router = express.Router();

const { protect, authorize, attachUser } = require('../middleware/auth');

// attachUser is a middleware that adds req.user if token is present, but doesn't block if not.
// For routes that are public but behave differently for authenticated users.
// Assuming we can use protect and just let it fail if needed, or create a flexible one.
// Let's assume protect is strict. If so, we might need an optionalAuth for GET /events.
// Let's implement an optionalAuth or just use protect conditionally.
// For simplicity, we will define it inline if not present, but let's assume attachUser exists.
// Wait, the prompt says "require corresponding models and middleware/auth.js". 
// Let's stick to protect and authorize.
// For public GET requests, we can just omit protect but if we want role-based filtering, we need user info.
// We'll write a small try-catch middleware here to gracefully decode if token is provided.
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const extractUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id);
    } catch (err) {}
  }
  next();
};

router
  .route('/')
  .get(extractUser, getEvents)
  .post(protect, authorize('Organizer', 'Platform Admin'), createEvent);

router
  .route('/:id')
  .get(extractUser, getEvent)
  .put(protect, authorize('Organizer', 'Platform Admin'), updateEvent)
  .delete(protect, authorize('Organizer', 'Platform Admin'), deleteEvent);

module.exports = router;
