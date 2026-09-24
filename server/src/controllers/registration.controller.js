const Registration = require('../models/Registration');
const Ticket = require('../models/Ticket');
const Coupon = require('../models/Coupon');
const QRCode = require('qrcode');
const mongoose = require('mongoose');

exports.createRegistration = async (req, res) => {
  try {
    const { eventId, ticketTypeId, couponCode } = req.body;
    const attendeeId = req.user.id;

    const ticket = await Ticket.findById(ticketTypeId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    let finalPrice = ticket.price;
    let discount = 0;
    
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, eventId });
      if (!coupon || !coupon.active || coupon.expiryDate < new Date() || coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
      }
      
      if (coupon.discountType === 'PERCENTAGE') {
        discount = ticket.price * (coupon.discountValue / 100);
      } else {
        discount = coupon.discountValue;
      }
      
      finalPrice = Math.max(0, ticket.price - discount);
      coupon.usedCount += 1;
      await coupon.save();
    }

    const registrationsCount = await Registration.countDocuments({ ticketTypeId, status: { $ne: 'CANCELLED' } });
    
    let status = 'APPROVED';
    if (registrationsCount >= ticket.capacity) {
      status = 'WAITLISTED';
    }

    const registrationId = new mongoose.Types.ObjectId();
    const qrDataStr = JSON.stringify({ registrationId, eventId, attendeeId });
    const qrCode = await QRCode.toDataURL(qrDataStr);

    const registration = await Registration.create({
      _id: registrationId,
      eventId,
      attendeeId,
      ticketTypeId,
      originalPrice: ticket.price,
      discount,
      finalPrice,
      couponCode,
      status,
      qrCode,
      qrData: qrDataStr
    });

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ attendeeId: req.user.id }).populate('eventId ticketTypeId');
    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('eventId ticketTypeId');
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOneAndUpdate(
      { _id: req.params.id, attendeeId: req.user.id },
      { status: 'CANCELLED' },
      { new: true }
    );
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId }).populate('attendeeId ticketTypeId');
    res.status(200).json({ success: true, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { code, eventId } = req.query;
    const coupon = await Coupon.findOne({ code, eventId });
    if (!coupon || !coupon.active || coupon.expiryDate < new Date() || coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
    }
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.approveRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(req.params.id, { status: 'APPROVED' }, { new: true });
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const registration = await Registration.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.status(200).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
