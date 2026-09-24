const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse back to object
    let parsedQuery = JSON.parse(queryStr);

    // Access control mapping
    if (req.user && req.user.role === 'Platform Admin') {
      // Platform Admin can see all events
    } else if (req.user && req.user.role === 'Organizer') {
      // Organizers can see all their events and published events from others
      parsedQuery = { 
        $or: [
          { organizer: req.user.id },
          { isPublished: true, ...parsedQuery }
        ]
      };
    } else {
      // Public / ordinary users can only see published events
      parsedQuery.isPublished = true;
    }

    query = Event.find(parsedQuery);

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Event.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const events = await query.populate('venue').populate('speakers');

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: events.length,
      pagination,
      data: events
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('venue').populate('speakers');

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Check if event is published or user is owner/admin
    if (!event.isPublished) {
      if (!req.user || (req.user.role !== 'Platform Admin' && event.organizer.toString() !== req.user.id)) {
        return res.status(403).json({ success: false, error: 'Not authorized to access this event' });
      }
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Organizer
exports.createEvent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.organizer = req.user.id;

    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Organizer, Platform Admin
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Make sure user is event owner or platform admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Platform Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Organizer, Platform Admin
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    // Make sure user is event owner or platform admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Platform Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
