const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/assistant-pack', authorize('ORGANIZER', 'ADMIN'), aiController.generateEventAssistantPack);
router.post('/description', authorize('ORGANIZER', 'ADMIN'), aiController.generateEventDescription);
router.post('/generate-description', authorize('ORGANIZER', 'ADMIN'), aiController.generateEventDescription);
router.post('/speaker-bio', authorize('ORGANIZER', 'ADMIN'), aiController.generateSpeakerBio);
router.post('/session-summary', authorize('ORGANIZER', 'ADMIN'), aiController.generateSessionSummary);
router.post('/announcement', authorize('ORGANIZER', 'ADMIN'), aiController.generateAnnouncement);
router.post('/social-post', authorize('ORGANIZER', 'ADMIN'), aiController.generateSocialMediaPost);
router.post('/email-invitation', authorize('ORGANIZER', 'ADMIN'), aiController.generateEmailInvitation);
router.post('/recommendations', aiController.getRecommendations);

module.exports = router;
