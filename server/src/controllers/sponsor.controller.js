const Sponsor = require('../models/Sponsor');

exports.createSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.create(req.body);
    res.status(201).json({ success: true, data: sponsor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSponsors = async (req, res) => {
  try {
    const filter = req.query.eventId ? { eventId: req.query.eventId } : {};
    const sponsors = await Sponsor.find(filter).populate('packageId');
    res.status(200).json({ success: true, data: sponsors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id).populate('packageId');
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.status(200).json({ success: true, data: sponsor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) return res.status(404).json({ success: false, message: 'Sponsor not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
