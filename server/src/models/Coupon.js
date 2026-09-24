const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  code: { type: String, required: [true, 'Coupon code is required'], uppercase: true, trim: true },
  discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' },
  discountValue: { type: Number, required: true, min: 0 },
  maxUses: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  minimumAmount: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

couponSchema.index({ eventId: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Coupon', couponSchema);
