const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/description', protect, authorize('ORGANIZER'), aiController.generateEventDescription);
router.post('/speaker-bio', protect, authorize('ORGANIZER'), aiController.generateSpeakerBio);
router.post('/session-summary', protect, authorize('ORGANIZER'), aiController.generateSessionSummary);
router.post('/announcement', protect, authorize('ORGANIZER'), aiController.generateAnnouncement);
router.post('/recommendations', protect, authorize('ATTENDEE'), aiController.getRecommendations);

module.exports = router;
