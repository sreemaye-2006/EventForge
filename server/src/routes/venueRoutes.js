const express = require('express');
const {
  getVenues,
  getVenue,
  createVenue,
  updateVenue,
  deleteVenue
} = require('../controllers/venueController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getVenues)
  .post(protect, authorize('Organizer', 'Platform Admin'), createVenue);

router
  .route('/:id')
  .get(getVenue)
  .put(protect, authorize('Organizer', 'Platform Admin'), updateVenue)
  .delete(protect, authorize('Organizer', 'Platform Admin'), deleteVenue);

module.exports = router;
