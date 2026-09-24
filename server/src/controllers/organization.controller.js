const Organization = require('../models/Organization');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Private (ADMIN)
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().populate('ownerId', 'name email');
    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single organization
// @route   GET /api/organizations/:id
// @access  Private (ADMIN, ORGANIZER)
exports.getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id).populate('ownerId', 'name email');

    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new organization
// @route   POST /api/organizations
// @access  Private (ADMIN, ORGANIZER)
exports.createOrganization = async (req, res) => {
  try {
    const { name, description, logo, website, subscriptionPlan } = req.body;
    const ownerId = req.user.role === 'ADMIN' && req.body.ownerId ? req.body.ownerId : req.user._id;

    const organization = await Organization.create({
      name,
      description,
      logo,
      website,
      subscriptionPlan: subscriptionPlan || 'FREE',
      ownerId
    });

    // Update user's organizationId if not already set
    if (!req.user.organizationId) {
      req.user.organizationId = organization._id;
      await req.user.save();
    }

    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
// @access  Private (ADMIN, ORGANIZER)
exports.updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
// @access  Private (ADMIN)
exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
