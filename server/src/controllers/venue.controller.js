const Venue = require('../models/Venue');

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public / Private
exports.getVenues = async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) filter.eventId = req.query.eventId;
    if (req.query.organizationId) filter.organizationId = req.query.organizationId;

    const venues = await Venue.find(filter);
    res.status(200).json({
      success: true,
      count: venues.length,
      data: venues
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single venue
// @route   GET /api/venues/:id
// @access  Public / Private
exports.getVenue = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }
    res.status(200).json({ success: true, data: venue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new venue
// @route   POST /api/venues
// @access  Private (ORGANIZER, ADMIN)
exports.createVenue = async (req, res) => {
  try {
    const { name, location, address, capacity, facilities, floor, roomNumber, eventId, organizationId } = req.body;

    const venue = await Venue.create({
      name,
      location: location || '',
      address: address || '',
      capacity: capacity || 100,
      facilities: Array.isArray(facilities) ? facilities : [],
      floor: floor || '',
      roomNumber: roomNumber || '',
      eventId: eventId || null,
      organizationId: organizationId || req.user.organizationId || null
    });

    res.status(201).json({
      success: true,
      data: venue
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private (ORGANIZER, ADMIN)
exports.updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }

    res.status(200).json({ success: true, data: venue });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete venue
// @route   DELETE /api/venues/:id
// @access  Private (ORGANIZER, ADMIN)
exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
