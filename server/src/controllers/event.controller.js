// Controllers for Event management

const Event = require('../models/Event');
const Venue = require('../models/Venue');
const User = require('../models/User');

// @desc    Get public events (paginated)
// @route   GET /api/events/public
// @access  Public
exports.getPublicEvents = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, status, search } = req.query;
    const filter = { isPublic: true, status: 'PUBLISHED' };
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const events = await Event.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ startDate: 1 })
      .populate('organizationId', 'name logo');
    const total = await Event.countDocuments(filter);
    res.status(200).json({ success: true, count: events.length, total, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single public event by slug
// @route   GET /api/events/public/:slug
// @access  Public
exports.getPublicEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, isPublic: true, status: 'PUBLISHED' })
      .populate('organizationId', 'name logo');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get events for logged in organizer (or admin)
// @route   GET /api/events
// @access  Private (ORGANIZER, ADMIN)
exports.getEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'ORGANIZER') {
      filter.organizerId = req.user._id;
    } else if (req.user.role === 'ADMIN') {
      // admin can filter by organization via query param
      if (req.query.organizationId) filter.organizationId = req.query.organizationId;
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const events = await Event.find(filter).populate('venueId', 'name');
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single event (protected)
// @route   GET /api/events/:id
// @access  Private (owner or admin)
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('venueId', 'name');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    // Authorization: organizer of the event, staff assigned, or admin
    if (req.user.role !== 'ADMIN' && !event.organizerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (ORGANIZER, ADMIN)
exports.createEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    // Set organizer based on role
    if (req.user.role === 'ORGANIZER') data.organizerId = req.user._id;
    // Ensure organizationId is present and belongs to user (handled by middleware elsewhere)
    const event = await Event.create(data);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (owner or admin)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (req.user.role !== 'ADMIN' && !event.organizerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (owner or admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (req.user.role !== 'ADMIN' && !event.organizerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await event.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Publish event
// @route   PUT /api/events/:id/publish
// @access  Private (owner or admin)
exports.publishEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (req.user.role !== 'ADMIN' && !event.organizerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    event.status = 'PUBLISHED';
    await event.save();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Cancel event
// @route   PUT /api/events/:id/cancel
// @access  Private (owner or admin)
exports.cancelEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (req.user.role !== 'ADMIN' && !event.organizerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    event.status = 'CANCELLED';
    await event.save();
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Duplicate event (creates a copy with DRAFT status)
// @route   POST /api/events/:id/duplicate
// @access  Private (owner or admin)
exports.duplicateEvent = async (req, res) => {
  try {
    const original = await Event.findById(req.params.id);
    if (!original) return res.status(404).json({ success: false, message: 'Original event not found' });
    if (req.user.role !== 'ADMIN' && !original.organizerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const dupData = original.toObject();
    delete dupData._id;
    delete dupData.slug; // new slug will be generated on save
    dupData.title = `${dupData.title} (Copy)`;
    dupData.status = 'DRAFT';
    const duplicate = await Event.create(dupData);
    res.status(201).json({ success: true, data: duplicate });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get staff assigned to an event
// @route   GET /api/events/:id/staff
// @access  Private (owner or admin)
exports.getEventStaff = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('staffIds', 'name email role');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (req.user.role !== 'ADMIN' && !event.organizerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: event.staffIds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add staff to an event
// @route   POST /api/events/:id/staff
// @access  Private (owner or admin)
exports.addEventStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (req.user.role !== 'ADMIN' && !event.organizerId.equals(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (!event.staffIds.includes(staffId)) event.staffIds.push(staffId);
    await event.save();
    const populated = await event.populate('staffIds', 'name email role');
    res.status(200).json({ success: true, data: populated.staffIds });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
