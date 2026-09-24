const Speaker = require('../models/Speaker');

// @desc    Get all speakers
// @route   GET /api/speakers
// @access  Public
exports.getSpeakers = async (req, res, next) => {
  try {
    const speakers = await Speaker.find();
    res.status(200).json({
      success: true,
      count: speakers.length,
      data: speakers
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single speaker
// @route   GET /api/speakers/:id
// @access  Public
exports.getSpeaker = async (req, res, next) => {
  try {
    const speaker = await Speaker.findById(req.params.id);

    if (!speaker) {
      return res.status(404).json({ success: false, error: 'Speaker not found' });
    }

    res.status(200).json({ success: true, data: speaker });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new speaker
// @route   POST /api/speakers
// @access  Private/Organizer
exports.createSpeaker = async (req, res, next) => {
  try {
    req.body.organizer = req.user.id;

    const speaker = await Speaker.create(req.body);

    res.status(201).json({
      success: true,
      data: speaker
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update speaker
// @route   PUT /api/speakers/:id
// @access  Private/Organizer, Speaker
exports.updateSpeaker = async (req, res, next) => {
  try {
    let speaker = await Speaker.findById(req.params.id);

    if (!speaker) {
      return res.status(404).json({ success: false, error: 'Speaker not found' });
    }

    // Ensure user is the speaker themselves, the organizer who created the profile, or an admin
    if (speaker.user && speaker.user.toString() === req.user.id) {
      // It's the speaker updating their own profile
    } else if (speaker.organizer && speaker.organizer.toString() === req.user.id) {
      // It's the organizer who created it
    } else if (req.user.role === 'Platform Admin') {
      // It's a platform admin
    } else {
      return res.status(401).json({ success: false, error: 'Not authorized to update this speaker profile' });
    }

    speaker = await Speaker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: speaker });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete speaker
// @route   DELETE /api/speakers/:id
// @access  Private/Organizer, Platform Admin
exports.deleteSpeaker = async (req, res, next) => {
  try {
    const speaker = await Speaker.findById(req.params.id);

    if (!speaker) {
      return res.status(404).json({ success: false, error: 'Speaker not found' });
    }

    if (speaker.organizer && speaker.organizer.toString() !== req.user.id && req.user.role !== 'Platform Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this speaker profile' });
    }

    await speaker.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
