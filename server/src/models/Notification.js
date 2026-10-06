const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Notification title is required'], trim: true },
  message: { type: String, required: [true, 'Notification message is required'] },
  type: {
    type: String,
    enum: ['REGISTRATION', 'EVENT_UPDATE', 'SESSION_CHANGE', 'TICKET', 'REMINDER', 'ANNOUNCEMENT', 'WAITLIST', 'SYSTEM'],
    default: 'SYSTEM'
  },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  data: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
