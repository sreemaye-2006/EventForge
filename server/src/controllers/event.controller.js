// Controllers for Event management

const Event = require('../models/Event');
const Venue = require('../models/Venue');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Session = require('../models/Session');
const Speaker = require('../models/Speaker');

// @desc    Get public events (paginated)
// @route   GET /api/events/public
// @access  Public
exports.getPublicEvents = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, status, search, upcoming } = req.query;
    const filter = { isPublic: true, status: 'PUBLISHED' };
    if (category) filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    if (status) filter.status = status;
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (upcoming === 'true') filter.startDate = { $gte: new Date() };

    const events = await Event.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ startDate: 1 })
      .populate('venueId', 'name address city location')
      .populate('organizationId', 'name logo');
    const total = await Event.countDocuments(filter);
    
    // Normalize data with id and location
    const formattedEvents = events.map(ev => {
      const obj = ev.toObject();
      obj.id = obj._id;
      obj.location = obj.venueId ? `${obj.venueId.name}${obj.venueId.city ? ', ' + obj.venueId.city : ''}` : (obj.venueId?.location || 'Online / TBA');
      obj.date = obj.startDate;
      return obj;
    });

    res.status(200).json({ success: true, count: formattedEvents.length, total, data: formattedEvents });
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
      .populate('venueId')
      .populate('organizationId', 'name logo');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    
    const ticketTypes = await Ticket.find({ eventId: event._id, status: 'ACTIVE' });
    const sessions = await Session.find({ eventId: event._id }).populate('venueId').populate('speakerIds');
    
    const eventObj = event.toObject();
    eventObj.id = eventObj._id;
    eventObj.date = eventObj.startDate;
    eventObj.location = eventObj.venueId ? `${eventObj.venueId.name}` : 'TBA';
    eventObj.ticketTypes = ticketTypes.map(t => ({ ...t.toObject(), id: t._id }));
    eventObj.schedule = sessions.map(s => ({
      ...s.toObject(),
      id: s._id,
      time: s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      date: s.startTime
    }));

    res.status(200).json({ success: true, data: eventObj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get events for logged in user (organizer, admin, staff, or attendee)
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    const filter = {};
    const userRole = (req.user?.role || '').toUpperCase();

    if (userRole === 'ORGANIZER') {
      filter.organizerId = req.user._id;
    } else if (userRole === 'ADMIN') {
      if (req.query.organizationId) filter.organizationId = req.query.organizationId;
    } else if (userRole === 'STAFF') {
      filter.staffIds = req.user._id;
    } else {
      // ATTENDEE or general authenticated browsing
      filter.isPublic = true;
      filter.status = 'PUBLISHED';
    }

    if (req.query.upcoming === 'true') {
      filter.startDate = { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }; // Include today
    }
    if (req.query.category) {
      filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const events = await Event.find(filter)
      .populate('venueId', 'name address city location')
      .populate('organizationId', 'name logo')
      .sort({ startDate: 1 });

    const formattedEvents = events.map(ev => {
      const obj = ev.toObject();
      obj.id = obj._id;
      obj.date = obj.startDate;
      obj.location = obj.venueId ? `${obj.venueId.name}${obj.venueId.city ? ', ' + obj.venueId.city : ''}` : (obj.venueId?.location || 'Online / TBA');
      return obj;
    });

    res.status(200).json({ success: true, count: formattedEvents.length, data: formattedEvents });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single event (protected or public)
// @route   GET /api/events/:id
// @access  Private / Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('venueId')
      .populate('organizationId', 'name logo')
      .populate('staffIds', 'name email');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const ticketTypes = await Ticket.find({ eventId: event._id });
    const sessions = await Session.find({ eventId: event._id }).populate('venueId').populate('speakerIds');
    const speakers = await Speaker.find({ organizationId: event.organizationId }).populate('userId', 'name email avatar');

    const eventObj = event.toObject();
    eventObj.id = eventObj._id;
    eventObj.date = eventObj.startDate;
    eventObj.location = eventObj.venueId ? `${eventObj.venueId.name}${eventObj.venueId.city ? ', ' + eventObj.venueId.city : ''}` : 'Main Venue';
    eventObj.ticketTypes = ticketTypes.map(t => ({ ...t.toObject(), id: t._id }));
    eventObj.schedule = sessions.map(s => ({
      ...s.toObject(),
      id: s._id,
      time: s.startTime ? new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      date: s.startTime
    }));
    eventObj.speakers = speakers.map(sp => ({
      ...sp.toObject(),
      id: sp._id,
      name: sp.userId?.name || 'Featured Speaker',
      role: sp.designation || 'Keynote Speaker',
      imageUrl: sp.profileImage || sp.userId?.avatar || ''
    }));

    res.status(200).json({ success: true, data: eventObj });
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
    if (req.user.role === 'ORGANIZER') data.organizerId = req.user._id;
    if (!data.organizationId && req.user.organizationId) data.organizationId = req.user.organizationId;
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
    await Event.findByIdAndDelete(req.params.id);
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
