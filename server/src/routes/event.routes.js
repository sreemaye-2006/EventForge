const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/event.controller');

// Public routes
router.get('/public', ctrl.getPublicEvents);
router.get('/public/:slug', ctrl.getPublicEventBySlug);

// Protected routes
router.use(protect);

router.route('/')
  .get(ctrl.getEvents)
  .post(authorize('ORGANIZER', 'ADMIN'), ctrl.createEvent);

router.route('/:id')
  .get(ctrl.getEvent)
  .put(authorize('ORGANIZER', 'ADMIN'), ctrl.updateEvent)
  .delete(authorize('ORGANIZER', 'ADMIN'), ctrl.deleteEvent);

router.put('/:id/publish', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.publishEvent);
router.put('/:id/cancel', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.cancelEvent);
router.post('/:id/duplicate', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.duplicateEvent);
router.get('/:id/staff', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.getEventStaff);
router.post('/:id/staff', protect, authorize('ORGANIZER', 'ADMIN'), ctrl.addEventStaff);

module.exports = router;
