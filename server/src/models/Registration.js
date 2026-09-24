const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticketTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
  registrationNumber: { type: String, unique: true },
  originalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'WAITLISTED', 'CHECKED_IN'],
    default: 'PENDING'
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'REFUNDED'],
    default: 'PENDING'
  },
  qrCode: { type: String, default: '' },
  qrData: { type: String, default: '' },
  checkedInAt: { type: Date },
  waitlistPosition: { type: Number },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

registrationSchema.index({ eventId: 1 });
registrationSchema.index({ attendeeId: 1 });
registrationSchema.index({ eventId: 1, attendeeId: 1 });

registrationSchema.pre('save', function (next) {
  if (!this.registrationNumber) {
    this.registrationNumber = 'REG-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
