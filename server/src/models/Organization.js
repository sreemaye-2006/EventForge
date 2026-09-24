const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Organization name is required'], trim: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  website: { type: String, default: '' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subscriptionPlan: {
    type: String,
    enum: ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'],
    default: 'FREE'
  },
  subscriptionStatus: {
    type: String,
    enum: ['ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  settings: {
    allowPublicEvents: { type: Boolean, default: true },
    maxEvents: { type: Number, default: 10 },
    maxAttendeesPerEvent: { type: Number, default: 500 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);
