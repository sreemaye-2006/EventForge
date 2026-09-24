const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('ATTENDEE'), feedbackController.submitFeedback);
router.get('/session/:sessionId', protect, authorize('ORGANIZER'), feedbackController.getSessionFeedback);

module.exports = router;
