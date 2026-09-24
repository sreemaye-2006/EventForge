const Deliverable = require('../models/Deliverable');

exports.createDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.create(req.body);
    res.status(201).json({ success: true, data: deliverable });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDeliverables = async (req, res) => {
  try {
    const filter = req.query.eventId ? { eventId: req.query.eventId } : {};
    const deliverables = await Deliverable.find(filter);
    res.status(200).json({ success: true, data: deliverables });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findById(req.params.id);
    if (!deliverable) return res.status(404).json({ success: false, message: 'Deliverable not found' });
    res.status(200).json({ success: true, data: deliverable });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!deliverable) return res.status(404).json({ success: false, message: 'Deliverable not found' });
    res.status(200).json({ success: true, data: deliverable });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteDeliverable = async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndDelete(req.params.id);
    if (!deliverable) return res.status(404).json({ success: false, message: 'Deliverable not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
