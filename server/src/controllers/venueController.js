const Venue = require('../models/Venue');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public
exports.getVenues = async (req, res, next) => {
  try {
    const venues = await Venue.find();
    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public
exports.getVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ success: false, error: 'Venue not found' });
    }

    res.status(200).json({ success: true, data: venue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new venue
// @route   POST /api/venues
// @access  Private/Organizer
exports.createVenue = async (req, res, next) => {
  try {
    req.body.organizer = req.user.id;

    const venue = await Venue.create(req.body);

    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private/Organizer
exports.updateVenue = async (req, res, next) => {
  try {
    let venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ success: false, error: 'Venue not found' });
    }

    if (venue.organizer.toString() !== req.user.id && req.user.role !== 'Platform Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this venue' });
    }

    venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: venue });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete venue
// @route   DELETE /api/venues/:id
// @access  Private/Organizer
exports.deleteVenue = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).json({ success: false, error: 'Venue not found' });
    }

    if (venue.organizer.toString() !== req.user.id && req.user.role !== 'Platform Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this venue' });
    }

    await venue.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
