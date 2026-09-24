const Feedback = require('../models/Feedback');
const Registration = require('../models/Registration');
const Session = require('../models/Session');

exports.submitFeedback = async (req, res) => {
  try {
    const { sessionId, rating, comment } = req.body;
    const attendeeId = req.user.id;

    if (!sessionId || !rating) {
      return res.status(400).json({ success: false, error: 'Session ID and rating are required' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    const registration = await Registration.findOne({ attendeeId: attendeeId, eventId: session.eventId });
    if (!registration) {
      return res.status(403).json({ success: false, error: 'Not registered for this event' });
    }

    const existingFeedback = await Feedback.findOne({ attendeeId: attendeeId, sessionId: sessionId });
    if (existingFeedback) {
      return res.status(400).json({ success: false, error: 'Feedback already submitted for this session' });
    }

    const feedback = new Feedback({
      attendeeId: attendeeId,
      sessionId: sessionId,
      eventId: session.eventId,
      rating,
      comment
    });

    await feedback.save();

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getSessionFeedback = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const feedbacks = await Feedback.find({ sessionId: sessionId }).populate('attendeeId', 'name email');
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
