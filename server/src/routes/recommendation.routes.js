const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Session = require('../models/Session');
const User = require('../models/User');
const Registration = require('../models/Registration');

router.use(protect);

// @desc    Get smart AI-powered recommended sessions for attendee
// @route   GET /api/recommendations
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const userInterests = user?.interests && user.interests.length > 0
      ? user.interests
      : ['AI', 'Cloud Computing', 'Web Development'];

    // Get user's registered events to avoid duplicate conflicts or recommend related tracks
    const userRegistrations = await Registration.find({ attendeeId: req.user._id, status: { $in: ['APPROVED', 'CONFIRMED', 'PENDING'] } })
      .populate('eventId', 'category tags title');

    const registeredEventCategories = userRegistrations.map(r => r.eventId?.category).filter(Boolean);

    const sessions = await Session.find({ status: { $ne: 'CANCELLED' } })
      .populate('eventId', 'title category tags startDate venueId')
      .populate({ path: 'speakerIds', populate: { path: 'userId', select: 'name company designation avatar' } })
      .limit(20)
      .sort({ startTime: 1 });

    const scored = sessions.map(s => {
      const obj = s.toObject();
      let matchScore = 40;
      const reasons = [];

      const searchContent = `${obj.title} ${obj.description} ${obj.category} ${obj.track} ${(obj.tags || []).join(' ')} ${obj.eventId?.category || ''}`.toLowerCase();

      // Check user interests
      userInterests.forEach(interest => {
        if (searchContent.includes(interest.toLowerCase())) {
          matchScore += 35;
          reasons.push(`matches your interest in ${interest}`);
        }
      });

      // Check past registered event categories
      registeredEventCategories.forEach(cat => {
        if (searchContent.includes(cat.toLowerCase())) {
          matchScore += 15;
          reasons.push(`aligned with your registered ${cat} events`);
        }
      });

      if (obj.speakerIds && obj.speakerIds.length > 0) {
        matchScore += 10;
        reasons.push(`features leading speaker ${obj.speakerIds[0]?.userId?.name || obj.speakerIds[0]?.name || 'expert'}`);
      }

      const primaryReason = reasons.length > 0
        ? `Recommended because this session ${reasons.slice(0, 2).join(' and ')}.`
        : `Recommended based on popular trending sessions at ${obj.eventId?.title || 'the conference'}.`;

      return {
        ...obj,
        id: obj._id,
        title: obj.title,
        track: obj.track || 'Main Track',
        room: obj.room || 'Main Hall',
        matchScore: Math.min(matchScore, 98),
        recommendationReason: primaryReason,
        time: obj.startTime ? new Date(obj.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
        date: obj.startTime ? new Date(obj.startTime).toLocaleDateString() : 'Today',
        event: {
          id: obj.eventId?._id,
          title: obj.eventId?.title || 'Tech Summit'
        }
      };
    });

    // Sort by highest match score
    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({ success: true, count: scored.length, data: scored.slice(0, 8) });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
