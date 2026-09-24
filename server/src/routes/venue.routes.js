const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/venue.controller');

router.use(protect);

router.route('/')
  .get(ctrl.getVenues)
  .post(authorize('ORGANIZER', 'ADMIN'), ctrl.createVenue);

router.route('/:id')
  .get(ctrl.getVenue)
  .put(authorize('ORGANIZER', 'ADMIN'), ctrl.updateVenue)
  .delete(authorize('ORGANIZER', 'ADMIN'), ctrl.deleteVenue);

module.exports = router;
