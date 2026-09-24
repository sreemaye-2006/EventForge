const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Event title is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Technology', 'Business', 'Healthcare', 'Education', 'Entertainment', 'Finance', 'Marketing', 'Other'],
    default: 'Technology'
  },
  eventType: {
    type: String,
    enum: ['Conference', 'Workshop', 'Exhibition', 'Seminar', 'Corporate Meeting', 'Hackathon', 'Webinar'],
    default: 'Conference'
  },
  startDate: { type: Date, required: [true, 'Start date is required'] },
  endDate: { type: Date, required: [true, 'End date is required'] },
  registrationStart: { type: Date },
  registrationEnd: { type: Date },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  bannerImage: { type: String, default: '' },
  capacity: { type: Number, default: 100, min: 1 },
  status: {
    type: String,
    enum: ['DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT'
  },
  tags: [{ type: String }],
  staffIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

eventSchema.index({ organizationId: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1 });

eventSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
