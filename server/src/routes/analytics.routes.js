const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/platform', authorize('ADMIN'), analyticsController.getPlatformAnalytics);
router.get('/:eventId', authorize('ORGANIZER', 'ADMIN'), analyticsController.getEventAnalytics);

module.exports = router;
