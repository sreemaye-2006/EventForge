const Speaker = require('../models/Speaker');
const User = require('../models/User');

// @desc    Get all speakers
// @route   GET /api/speakers
// @access  Public / Private
exports.getSpeakers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.organizationId) filter.organizationId = req.query.organizationId;

    const speakers = await Speaker.find(filter).populate('userId', 'name email avatar');
    res.status(200).json({
      success: true,
      count: speakers.length,
      data: speakers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single speaker
// @route   GET /api/speakers/:id
// @access  Public / Private
exports.getSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id).populate('userId', 'name email avatar');
    if (!speaker) {
      return res.status(404).json({ success: false, message: 'Speaker not found' });
    }
    res.status(200).json({ success: true, data: speaker });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new speaker
// @route   POST /api/speakers
// @access  Private (ORGANIZER, ADMIN)
exports.createSpeaker = async (req, res) => {
  try {
    let { userId, name, email, bio, designation, company, expertise, profileImage, socialLinks, availability } = req.body;

    // If userId not provided, check or create a user with SPEAKER role
    if (!userId && email) {
      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        existingUser = await User.create({
          name: name || 'Speaker',
          email,
          password: 'Password123!',
          role: 'SPEAKER',
          organizationId: req.user.organizationId || null
        });
      }
      userId = existingUser._id;
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID or Email is required for speaker' });
    }

    const speaker = await Speaker.create({
      userId,
      organizationId: req.body.organizationId || req.user.organizationId || null,
      bio: bio || '',
      designation: designation || '',
      company: company || '',
      expertise: Array.isArray(expertise) ? expertise : [],
      profileImage: profileImage || '',
      socialLinks: socialLinks || {},
      availability: Array.isArray(availability) ? availability : []
    });

    const populated = await speaker.populate('userId', 'name email avatar');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update speaker
// @route   PUT /api/speakers/:id
// @access  Private (ORGANIZER, ADMIN, SPEAKER)
exports.updateSpeaker = async (req, res) => {
  try {
    let speaker = await Speaker.findById(req.params.id);
    if (!speaker) {
      return res.status(404).json({ success: false, message: 'Speaker not found' });
    }

    // Role check: Admin, Organizer, or the Speaker themselves
    if (
      req.user.role !== 'ADMIN' &&
      req.user.role !== 'ORGANIZER' &&
      speaker.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this speaker profile' });
    }

    speaker = await Speaker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('userId', 'name email avatar');

    res.status(200).json({ success: true, data: speaker });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete speaker
// @route   DELETE /api/speakers/:id
// @access  Private (ORGANIZER, ADMIN)
exports.deleteSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);
    if (!speaker) {
      return res.status(404).json({ success: false, message: 'Speaker not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
