const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String, required: [true, 'Company name is required'], trim: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  website: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'],
    default: 'PENDING'
  },
  brandAssets: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Sponsor', sponsorSchema);
