const Coupon = require('../models/Coupon');

exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const filter = req.query.eventId ? { eventId: req.query.eventId } : {};
    const coupons = await Coupon.find(filter);
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const code = req.body.code || req.query.code;
    const eventId = req.body.eventId || req.query.eventId;
    const ticketPrice = Number(req.body.ticketPrice || req.query.ticketPrice || 0);

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const query = { code: code.toUpperCase() };
    if (eventId) query.eventId = eventId;

    const coupon = await Coupon.findOne(query);
    if (!coupon || !coupon.active) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit has been reached' });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = ticketPrice > 0 ? (ticketPrice * (coupon.discountValue / 100)) : coupon.discountValue;
    } else {
      discountAmount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      data: coupon,
      coupon,
      discountAmount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      message: `Coupon applied: ${coupon.discountType === 'PERCENTAGE' ? coupon.discountValue + '% off' : '$' + coupon.discountValue + ' off'}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
