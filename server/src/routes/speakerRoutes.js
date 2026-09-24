const express = require('express');
const {
  getSpeakers,
  getSpeaker,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker
} = require('../controllers/speakerController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getSpeakers)
  .post(protect, authorize('Organizer', 'Platform Admin'), createSpeaker);

router
  .route('/:id')
  .get(getSpeaker)
  .put(protect, authorize('Organizer', 'Speaker', 'Platform Admin'), updateSpeaker)
  .delete(protect, authorize('Organizer', 'Platform Admin'), deleteSpeaker);

module.exports = router;
