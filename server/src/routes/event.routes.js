const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const ctrl = require('../controllers/event.controller');

// Public & discoverable routes
router.get('/public', ctrl.getPublicEvents);
router.get('/public/:slug', ctrl.getPublicEventBySlug);
router.get('/', optionalAuth, ctrl.getEvents);
router.get('/:id', optionalAuth, ctrl.getEvent);

// Protected routes (Organizers / Admins)
router.post('/', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.createEvent);
router.put('/:id', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.updateEvent);
router.delete('/:id', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.deleteEvent);
router.put('/:id/publish', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.publishEvent);
router.put('/:id/cancel', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.cancelEvent);
router.post('/:id/duplicate', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.duplicateEvent);
router.get('/:id/staff', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.getEventStaff);
router.post('/:id/staff', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.addEventStaff);

module.exports = router;
