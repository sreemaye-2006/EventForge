const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/attendance.controller');

router.use(protect);

router.post('/event-checkin', authorize('STAFF', 'ORGANIZER', 'ADMIN'), ctrl.checkInEvent);
router.post('/session-checkin', authorize('STAFF', 'ORGANIZER', 'ADMIN'), ctrl.checkInSession);
router.get('/event/:eventId/today', authorize('STAFF', 'ORGANIZER', 'ADMIN'), ctrl.getTodayCheckins);
router.get('/event/:eventId/stats', authorize('STAFF', 'ORGANIZER', 'ADMIN'), ctrl.getAttendanceStats);

module.exports = router;
