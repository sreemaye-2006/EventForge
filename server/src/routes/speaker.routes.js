const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/speaker.controller');

router.use(protect);

router.route('/')
  .get(ctrl.getSpeakers)
  .post(authorize('ORGANIZER', 'ADMIN'), ctrl.createSpeaker);

router.route('/:id')
  .get(ctrl.getSpeaker)
  .put(ctrl.updateSpeaker)
  .delete(authorize('ORGANIZER', 'ADMIN'), ctrl.deleteSpeaker);

module.exports = router;
