const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  speakerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' }],
  title: { type: String, required: [true, 'Session title is required'], trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: '' },
  startTime: { type: Date, required: [true, 'Start time is required'] },
  endTime: { type: Date, required: [true, 'End time is required'] },
  capacity: { type: Number, default: 100 },
  status: {
    type: String,
    enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED'
  },
  tags: [{ type: String }],
  streamUrl: { type: String, default: '' }
}, { timestamps: true });

sessionSchema.index({ eventId: 1 });
sessionSchema.index({ venueId: 1 });
sessionSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('Session', sessionSchema);
