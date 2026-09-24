const Organization = require('../models/Organization');

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Private/Platform Admin
exports.getOrganizations = async (req, res, next) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get single organization
// @route   GET /api/organizations/:id
// @access  Private/Platform Admin
exports.getOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Create new organization
// @route   POST /api/organizations
// @access  Private/Platform Admin
exports.createOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.create(req.body);

    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
// @access  Private/Platform Admin
exports.updateOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!organization) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
// @access  Private/Platform Admin
exports.deleteOrganization = async (req, res, next) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
