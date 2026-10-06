const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Event = require('../models/Event');
const Venue = require('../models/Venue');
const Ticket = require('../models/Ticket');
const Speaker = require('../models/Speaker');
const Session = require('../models/Session');
const Sponsor = require('../models/Sponsor');
const Coupon = require('../models/Coupon');
const User = require('../models/User');

router.use(protect);
router.use(authorize('ORGANIZER', 'ADMIN'));

// Events for organizer
router.get('/events', async (req, res) => {
  try {
    const filter = req.user.role === 'ADMIN' ? {} : { organizerId: req.user._id };
    const events = await Event.find(filter).populate('venueId').sort({ startDate: 1 });
    const formatted = events.map(e => {
      const obj = e.toObject();
      return {
        ...obj,
        id: obj._id,
        type: obj.eventType || 'Conference',
        date: obj.startDate
      };
    });
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const { title, startDate, endDate, type, category, description } = req.body;
    const event = await Event.create({
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      eventType: type || 'Conference',
      category: category || 'Technology',
      description: description || '',
      organizerId: req.user._id,
      organizationId: req.user.organizationId || req.user._id,
      status: 'PUBLISHED',
      isPublic: true
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('venueId');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const obj = event.toObject();
    res.status(200).json({
      ...obj,
      id: obj._id,
      type: obj.eventType || 'Conference'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/events/:id', async (req, res) => {
  try {
    const { title, startDate, endDate, type, category, description } = req.body;
    const updates = {};
    if (title) updates.title = title;
    if (startDate) updates.startDate = new Date(startDate);
    if (endDate) updates.endDate = new Date(endDate);
    if (type) updates.eventType = type;
    if (category) updates.category = category;
    if (description !== undefined) updates.description = description;

    const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Tickets
router.get('/events/:eventId/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find({ eventId: req.params.eventId });
    const formatted = tickets.map(t => ({
      ...t.toObject(),
      id: t._id,
      quantity: t.capacity
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/events/:eventId/tickets', async (req, res) => {
  try {
    const { name, price, quantity, type } = req.body;
    const ticket = await Ticket.create({
      eventId: req.params.eventId,
      name,
      price: Number(price),
      capacity: Number(quantity) || 100,
      status: 'ACTIVE'
    });
    res.status(201).json({ ...ticket.toObject(), id: ticket._id, quantity: ticket.capacity });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/events/:eventId/tickets/:ticketId', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.ticketId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Venues
router.get('/events/:eventId/venues', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const orgId = event?.organizationId || req.user.organizationId;
    const venues = await Venue.find({ $or: [{ eventId: req.params.eventId }, { organizationId: orgId }] });
    const formatted = venues.map(v => ({ ...v.toObject(), id: v._id }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/events/:eventId/venues', async (req, res) => {
  try {
    const { name, address, capacity } = req.body;
    const event = await Event.findById(req.params.eventId);
    const venue = await Venue.create({
      organizationId: event?.organizationId || req.user.organizationId || req.user._id,
      eventId: req.params.eventId,
      name,
      address,
      capacity: Number(capacity) || 100
    });
    // Set as event venue if not set
    if (event && !event.venueId) {
      event.venueId = venue._id;
      await event.save();
    }
    res.status(201).json({ ...venue.toObject(), id: venue._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/events/:eventId/venues/:venueId', async (req, res) => {
  try {
    await Venue.findByIdAndDelete(req.params.venueId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Speakers
router.get('/events/:eventId/speakers', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    const orgId = event?.organizationId || req.user.organizationId;
    const speakers = await Speaker.find({ organizationId: orgId }).populate('userId', 'name email avatar');
    const formatted = speakers.map(s => ({
      ...s.toObject(),
      id: s._id,
      name: s.userId?.name || s.name || 'Speaker',
      bio: s.bio || '',
      imageUrl: s.profileImage || s.userId?.avatar || ''
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/events/:eventId/speakers', async (req, res) => {
  try {
    const { name, bio, imageUrl } = req.body;
    const event = await Event.findById(req.params.eventId);
    const orgId = event?.organizationId || req.user.organizationId || req.user._id;
    
    // Create or find a speaker user
    const email = `speaker_${Date.now()}@eventforge.com`;
    const spUser = await User.create({
      name,
      email,
      password: 'password123',
      role: 'SPEAKER',
      avatar: imageUrl || ''
    });

    const speaker = await Speaker.create({
      userId: spUser._id,
      organizationId: orgId,
      bio: bio || '',
      profileImage: imageUrl || ''
    });

    res.status(201).json({
      ...speaker.toObject(),
      id: speaker._id,
      name,
      bio,
      imageUrl
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/events/:eventId/speakers/:speakerId', async (req, res) => {
  try {
    await Speaker.findByIdAndDelete(req.params.speakerId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sessions
router.get('/events/:eventId/sessions', async (req, res) => {
  try {
    const sessions = await Session.find({ eventId: req.params.eventId })
      .populate('venueId')
      .populate('speakerIds');
    const formatted = sessions.map(s => ({
      ...s.toObject(),
      id: s._id
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/events/:eventId/sessions', async (req, res) => {
  try {
    const { title, startTime, endTime, capacity, venueId, speakerId } = req.body;
    const session = await Session.create({
      eventId: req.params.eventId,
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      capacity: Number(capacity) || 100,
      venueId: venueId || null,
      speakerIds: speakerId ? [speakerId] : []
    });
    res.status(201).json({ ...session.toObject(), id: session._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/events/:eventId/sessions/:sessionId', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.sessionId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sponsors
router.get('/events/:eventId/sponsors', async (req, res) => {
  try {
    const sponsors = await Sponsor.find({ eventId: req.params.eventId });
    const formatted = sponsors.map(s => ({ ...s.toObject(), id: s._id }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/events/:eventId/sponsors', async (req, res) => {
  try {
    const { name, tier, logoUrl, websiteUrl } = req.body;
    const event = await Event.findById(req.params.eventId);
    const sponsor = await Sponsor.create({
      organizationId: event?.organizationId || req.user.organizationId || req.user._id,
      eventId: req.params.eventId,
      name,
      tier: tier || 'Gold',
      logoUrl: logoUrl || '',
      websiteUrl: websiteUrl || ''
    });
    res.status(201).json({ ...sponsor.toObject(), id: sponsor._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/events/:eventId/sponsors/:sponsorId', async (req, res) => {
  try {
    await Sponsor.findByIdAndDelete(req.params.sponsorId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Coupons
router.get('/events/:eventId/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find({ eventId: req.params.eventId });
    const formatted = coupons.map(c => ({
      ...c.toObject(),
      id: c._id,
      discountPercentage: c.discountValue,
      validUntil: c.expiryDate,
      usageLimit: c.maxUses
    }));
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/events/:eventId/coupons', async (req, res) => {
  try {
    const { code, discountPercentage, validUntil, usageLimit } = req.body;
    const coupon = await Coupon.create({
      eventId: req.params.eventId,
      code: code.toUpperCase(),
      discountType: 'PERCENTAGE',
      discountValue: Number(discountPercentage),
      expiryDate: new Date(validUntil),
      maxUses: Number(usageLimit) || 100,
      active: true
    });
    res.status(201).json({
      ...coupon.toObject(),
      id: coupon._id,
      discountPercentage: coupon.discountValue,
      validUntil: coupon.expiryDate,
      usageLimit: coupon.maxUses
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/events/:eventId/coupons/:couponId', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.couponId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
