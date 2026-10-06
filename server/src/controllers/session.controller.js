const formatTime = (d) => {
  return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

exports.createSession = async (req, res) => {
  try {
    const { eventId, title, description, category, track, room, startTime, endTime, venueId, speakerIds, capacity, streamUrl } = req.body;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ success: false, message: 'Session end time must be after start time' });
    }

    // Check for room/venue overlap (two sessions in the same room/venue overlapping in time)
    const roomQuery = {
      eventId,
      _id: { $ne: req.params.id },
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    };
    if (room) {
      roomQuery.room = room;
    } else if (venueId) {
      roomQuery.venueId = venueId;
    }

    const venueConflict = await Session.findOne(roomQuery);
    if (venueConflict) {
      const roomName = venueConflict.room || 'The selected venue/room';
      return res.status(400).json({
        success: false,
        message: `${roomName} is already booked from ${formatTime(venueConflict.startTime)} to ${formatTime(venueConflict.endTime)} for "${venueConflict.title}".`
      });
    }

    // Check for speaker overlap
    if (speakerIds && speakerIds.length > 0) {
      const speakerConflict = await Session.findOne({
        eventId,
        _id: { $ne: req.params.id },
        speakerIds: { $in: speakerIds },
        $or: [
          { startTime: { $lt: end }, endTime: { $gt: start } }
        ]
      }).populate({
        path: 'speakerIds',
        populate: { path: 'userId', select: 'name' }
      });

      if (speakerConflict) {
        return res.status(400).json({
          success: false,
          message: `One or more selected speakers are already assigned to session "${speakerConflict.title}" from ${formatTime(speakerConflict.startTime)} to ${formatTime(speakerConflict.endTime)}.`
        });
      }
    }

    const session = await Session.create({
      eventId,
      title,
      description,
      category: category || 'General',
      track: track || 'Main Track',
      room: room || 'Main Hall',
      startTime: start,
      endTime: end,
      venueId,
      speakerIds: speakerIds || [],
      capacity: capacity || 100,
      streamUrl: streamUrl || ''
    });

    const populatedSession = await Session.findById(session._id)
      .populate({ path: 'speakerIds', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('venueId');

    res.status(201).json({ success: true, data: populatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const filter = req.query.eventId ? { eventId: req.query.eventId } : {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.track) filter.track = req.query.track;
    
    const sessions = await Session.find(filter)
      .populate({ path: 'speakerIds', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('venueId')
      .sort({ startTime: 1 });
      
    res.status(200).json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate({ path: 'speakerIds', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('venueId');
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });

    const startTime = req.body.startTime ? new Date(req.body.startTime) : session.startTime;
    const endTime = req.body.endTime ? new Date(req.body.endTime) : session.endTime;
    const room = req.body.room || session.room;
    const venueId = req.body.venueId || session.venueId;
    const speakerIds = req.body.speakerIds || session.speakerIds;

    // Check room conflict
    const roomQuery = {
      eventId: session.eventId,
      _id: { $ne: session._id },
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
    };
    if (room) roomQuery.room = room;
    else if (venueId) roomQuery.venueId = venueId;

    const venueConflict = await Session.findOne(roomQuery);
    if (venueConflict) {
      return res.status(400).json({
        success: false,
        message: `${venueConflict.room || 'The selected room'} is already booked from ${formatTime(venueConflict.startTime)} to ${formatTime(venueConflict.endTime)}.`
      });
    }

    // Check speaker conflict
    if (speakerIds && speakerIds.length > 0) {
      const speakerConflict = await Session.findOne({
        eventId: session.eventId,
        _id: { $ne: session._id },
        speakerIds: { $in: speakerIds },
        $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
      });
      if (speakerConflict) {
        return res.status(400).json({
          success: false,
          message: `One or more speakers are booked for session "${speakerConflict.title}" at this time.`
        });
      }
    }

    const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate({ path: 'speakerIds', populate: { path: 'userId', select: 'name email avatar' } })
      .populate('venueId');

    res.status(200).json({ success: true, data: updatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
