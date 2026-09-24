const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: [true, 'Package name is required'], trim: true },
  tier: { type: String, enum: ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'CUSTOM'], default: 'SILVER' },
  price: { type: Number, required: true, min: 0 },
  benefits: [{ type: String }],
  availableSlots: { type: Number, default: 5 },
  allocatedSlots: { type: Number, default: 0 },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
