const Announcement = require('../models/Announcement');
const Event = require('../models/Event');

exports.createAnnouncement = async (req, res) => {
  try {
    const { eventId, title, message, priority } = req.body;

    if (!eventId || !title || !message) {
      return res.status(400).json({ success: false, error: 'Event ID, title, and message are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }

    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Not authorized to create announcement for this event' });
    }

    const announcement = new Announcement({
      eventId,
      createdBy: req.user.id,
      title,
      message,
      priority: priority || 'normal'
    });

    await announcement.save();
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const filter = {};
    if (req.query.eventId) {
        filter.eventId = req.query.eventId;
    }
    const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, message, priority } = req.body;

    let announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    if (announcement.createdBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    announcement.title = title || announcement.title;
    announcement.message = message || announcement.message;
    announcement.priority = priority || announcement.priority;

    await announcement.save();
    res.status(200).json({ success: true, data: announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, error: 'Announcement not found' });
    }

    if (announcement.createdBy.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await announcement.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
