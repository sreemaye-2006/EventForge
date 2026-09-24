const Registration = require('../models/Registration');
const SessionAttendance = require('../models/SessionAttendance');
const Event = require('../models/Event');
const Session = require('../models/Session');

exports.checkInEvent = async (req, res) => {
  try {
    const { registrationId } = req.body;
    if (!registrationId) {
      return res.status(400).json({ success: false, error: 'Registration ID is required' });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    if (registration.status === 'CHECKED_IN') {
      return res.status(400).json({ success: false, error: 'User already checked in' });
    }

    registration.status = 'CHECKED_IN';
    registration.checkedInAt = new Date();
    await registration.save();

    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.checkInSession = async (req, res) => {
  try {
    const { registrationId, sessionId } = req.body;
    if (!registrationId || !sessionId) {
      return res.status(400).json({ success: false, error: 'Registration ID and Session ID are required' });
    }

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const existingAttendance = await SessionAttendance.findOne({
      registrationId,
      sessionId
    });

    if (existingAttendance) {
      return res.status(400).json({ success: false, error: 'Already checked in for this session' });
    }

    const attendance = new SessionAttendance({
      registrationId,
      sessionId,
      attendeeId: registration.attendeeId,
      eventId: session.eventId,
      checkedInAt: new Date(),
      checkedInBy: req.user.id
    });

    await attendance.save();

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getTodayCheckins = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const checkins = await Registration.find({
      eventId: req.params.eventId,
      status: 'CHECKED_IN',
      checkedInAt: { $gte: startOfDay }
    }).populate('attendeeId');
    res.status(200).json({ success: true, count: checkins.length, data: checkins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const total = await Registration.countDocuments({ eventId: req.params.eventId, status: { $ne: 'CANCELLED' } });
    const checkedIn = await Registration.countDocuments({ eventId: req.params.eventId, status: 'CHECKED_IN' });
    res.status(200).json({ success: true, data: { total, checkedIn, rate: total > 0 ? (checkedIn / total) : 0 } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
