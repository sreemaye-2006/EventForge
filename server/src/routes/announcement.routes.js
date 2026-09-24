const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/announcement.controller');

router.use(protect);

router.route('/')
  .get(ctrl.getAnnouncements)
  .post(authorize('ORGANIZER', 'ADMIN'), ctrl.createAnnouncement);

router.route('/:id')
  .get(ctrl.getAnnouncement)
  .put(authorize('ORGANIZER', 'ADMIN'), ctrl.updateAnnouncement)
  .delete(authorize('ORGANIZER', 'ADMIN'), ctrl.deleteAnnouncement);

module.exports = router;
