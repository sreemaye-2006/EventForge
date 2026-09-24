const aiService = require('../services/ai.service');

exports.generateEventDescription = async (req, res) => {
  try {
    const { prompt, keywords, topic } = req.body;
    if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required' });

    const description = await aiService.generateEventDescription(prompt, keywords, topic);
    res.status(200).json({ success: true, data: description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error generating event description' });
  }
};

exports.generateSpeakerBio = async (req, res) => {
  try {
    const { name, background, expertise } = req.body;
    if (!name || !background) return res.status(400).json({ success: false, error: 'Name and background are required' });

    const bio = await aiService.generateSpeakerBio(name, background, expertise);
    res.status(200).json({ success: true, data: bio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error generating speaker bio' });
  }
};

exports.generateSessionSummary = async (req, res) => {
  try {
    const { transcript, title } = req.body;
    if (!transcript) return res.status(400).json({ success: false, error: 'Transcript is required' });

    const summary = await aiService.generateSessionSummary(transcript, title);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error generating session summary' });
  }
};

exports.generateAnnouncement = async (req, res) => {
  try {
    const { eventName, context, urgency } = req.body;
    if (!eventName || !context) return res.status(400).json({ success: false, error: 'Event name and context are required' });

    const announcement = await aiService.generateAnnouncement(eventName, context, urgency);
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error generating announcement' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { attendeeInterests, availableSessions } = req.body;
    if (!attendeeInterests || !availableSessions) {
        return res.status(400).json({ success: false, error: 'Attendee interests and available sessions are required' });
    }

    const recommendations = await aiService.getRecommendations(attendeeInterests, availableSessions);
    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error generating recommendations' });
  }
};
