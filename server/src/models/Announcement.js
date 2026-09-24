const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  message: { type: String, required: [true, 'Message is required'] },
  priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'], default: 'NORMAL' },
  targetAudience: {
    type: String,
    enum: ['ALL', 'ATTENDEES', 'SPEAKERS', 'STAFF', 'SPONSORS'],
    default: 'ALL'
  },
  publishedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
