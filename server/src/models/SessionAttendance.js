const mongoose = require('mongoose');

const sessionAttendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration' },
  checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkedInAt: { type: Date, default: Date.now }
}, { timestamps: true });

sessionAttendanceSchema.index({ sessionId: 1, attendeeId: 1 }, { unique: true });

module.exports = mongoose.model('SessionAttendance', sessionAttendanceSchema);
