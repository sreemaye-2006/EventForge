const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/:eventId', protect, authorize('ORGANIZER'), analyticsController.getEventAnalytics);

module.exports = router;
