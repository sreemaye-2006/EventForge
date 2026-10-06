const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');

router.use(protect);
router.use(authorize('STAFF', 'ORGANIZER', 'ADMIN'));

// @desc    Get staff check-in stats for today
// @route   GET /api/staff/stats/today
router.get('/stats/today', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const totalExpected = await Registration.countDocuments({ status: { $ne: 'CANCELLED' } });
    const todayCheckins = await Registration.countDocuments({ status: 'CHECKED_IN', checkedInAt: { $gte: startOfDay } });
    const activeEventsCount = await Event.countDocuments({ status: { $in: ['PUBLISHED', 'ONGOING'] } });

    const recent = await Registration.find({ status: 'CHECKED_IN' })
      .sort({ checkedInAt: -1 })
      .limit(10)
      .populate('attendeeId', 'name')
      .populate('eventId', 'title');

    const recentCheckins = recent.map(r => ({
      attendeeName: r.attendeeId?.name || 'Attendee',
      eventName: r.eventId?.title || 'Event',
      timestamp: r.checkedInAt || r.updatedAt || new Date()
    }));

    res.status(200).json({
      success: true,
      data: {
        todayCheckins,
        totalExpected,
        activeEventsCount,
        recentCheckins
      },
      todayCheckins,
      totalExpected,
      activeEventsCount,
      recentCheckins
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Check-in attendee by QR ticket data
// @route   POST /api/staff/checkin
router.post('/checkin', async (req, res) => {
  try {
    const { ticketId, eventId, registrationId } = req.body;
    const regId = ticketId || registrationId;

    if (!regId) {
      return res.status(400).json({ success: false, message: 'Ticket ID is required' });
    }

    const registration = await Registration.findById(regId)
      .populate('attendeeId', 'name email')
      .populate('ticketTypeId', 'name price')
      .populate('eventId', 'title');

    if (!registration) {
      return res.status(404).json({ success: false, message: 'Ticket / Registration not found' });
    }

    if (eventId && registration.eventId?._id?.toString() !== eventId.toString()) {
      return res.status(400).json({ success: false, message: 'Ticket is for a different event' });
    }

    if (registration.status === 'CHECKED_IN') {
      return res.status(400).json({ 
        success: false, 
        message: `Already checked in at ${new Date(registration.checkedInAt).toLocaleTimeString()}` 
      });
    }

    registration.status = 'CHECKED_IN';
    registration.checkedInAt = new Date();
    await registration.save();

    res.status(200).json({
      success: true,
      data: {
        attendeeName: registration.attendeeId?.name || 'Attendee',
        ticketTypeName: registration.ticketTypeId?.name || 'Standard Pass',
        eventName: registration.eventId?.title || 'Event',
        checkedInAt: registration.checkedInAt
      },
      attendeeName: registration.attendeeId?.name || 'Attendee',
      ticketTypeName: registration.ticketTypeId?.name || 'Standard Pass'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
