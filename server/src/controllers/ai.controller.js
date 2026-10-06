const aiService = require('../services/ai.service');
const Session = require('../models/Session');
const User = require('../models/User');

exports.generateEventAssistantPack = async (req, res) => {
  try {
    const { eventName, eventType, audience, industry, goals, topics, duration, location } = req.body;
    const pack = await aiService.generateEventAssistantPack({
      eventName,
      eventType,
      audience,
      industry,
      goals,
      topics,
      duration,
      location
    });
    res.status(200).json({ success: true, data: pack });
  } catch (error) {
    console.error('generateEventAssistantPack error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error generating AI event pack' });
  }
};

exports.generateEventDescription = async (req, res) => {
  try {
    const { prompt, title, keywords, topic, category, type } = req.body;
    const promptText = prompt || `Create an engaging description for an event titled "${title}". Category: ${category || 'Technology'}. Type: ${type || 'Conference'}.`;

    const description = await aiService.generateEventDescription(promptText, keywords, topic || category);
    res.status(200).json({ success: true, data: description, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error generating event description' });
  }
};

exports.generateSpeakerBio = async (req, res) => {
  try {
    const { name, background, expertise } = req.body;
    if (!name || !background) {
      return res.status(400).json({ success: false, message: 'Name and background are required' });
    }

    const bio = await aiService.generateSpeakerBio(name, background, expertise);
    res.status(200).json({ success: true, data: bio, bio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error generating speaker bio' });
  }
};

exports.generateSessionSummary = async (req, res) => {
  try {
    const { transcript, title } = req.body;
    if (!transcript) {
      return res.status(400).json({ success: false, message: 'Transcript or key points are required' });
    }

    const summary = await aiService.generateSessionSummary(transcript, title);
    res.status(200).json({ success: true, data: summary, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error generating session summary' });
  }
};

exports.generateAnnouncement = async (req, res) => {
  try {
    const { eventName, context, urgency } = req.body;
    if (!eventName || !context) {
      return res.status(400).json({ success: false, message: 'Event name and context are required' });
    }

    const announcement = await aiService.generateAnnouncement(eventName, context, urgency);
    res.status(200).json({ success: true, data: announcement, announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error generating announcement' });
  }
};

exports.generateSocialMediaPost = async (req, res) => {
  try {
    const post = await aiService.generateSocialMediaPost(req.body);
    res.status(200).json({ success: true, data: post, post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error generating social media post' });
  }
};

exports.generateEmailInvitation = async (req, res) => {
  try {
    const email = await aiService.generateEmailInvitation(req.body);
    res.status(200).json({ success: true, data: email, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error generating email invitation' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    let interests = req.body.attendeeInterests;
    if (!interests && req.user) {
      const user = await User.findById(req.user._id);
      interests = user?.interests || [];
    }

    let sessions = req.body.availableSessions;
    if (!sessions || sessions.length === 0) {
      sessions = await Session.find({ status: 'SCHEDULED' })
        .populate({ path: 'speakerIds', populate: { path: 'userId', select: 'name' } })
        .populate('eventId', 'title')
        .limit(20);
    }

    const recommendations = await aiService.recommendSessions(interests || ['Technology', 'AI'], sessions);
    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error generating recommendations' });
  }
};
