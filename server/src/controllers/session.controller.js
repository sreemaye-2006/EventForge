const Session = require('../models/Session');

exports.createSession = async (req, res) => {
  try {
    const { eventId, title, description, startTime, endTime, venueId, speakerIds, capacity } = req.body;

    // Check for venue overlap
    const venueConflict = await Session.findOne({
      eventId,
      venueId,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });
    if (venueConflict) {
      return res.status(400).json({ success: false, message: 'Venue is already booked for this time.' });
    }

    // Check for speaker overlap
    if (speakerIds && speakerIds.length > 0) {
      const speakerConflict = await Session.findOne({
        eventId,
        speakerIds: { $in: speakerIds },
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
        ]
      });
      if (speakerConflict) {
        return res.status(400).json({ success: false, message: 'One or more speakers are booked for another session at this time.' });
      }
    }

    const session = await Session.create({
      eventId, title, description, startTime, endTime, venueId, speakerIds, capacity
    });

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const filter = req.query.eventId ? { eventId: req.query.eventId } : {};
    const sessions = await Session.find(filter).populate('speakerIds');
    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('speakerIds');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
