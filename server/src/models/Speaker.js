const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  bio: { type: String, default: '' },
  designation: { type: String, default: '' },
  company: { type: String, default: '' },
  expertise: [{ type: String }],
  profileImage: { type: String, default: '' },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  availability: [{ type: String }],
  presentationMaterials: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Speaker', speakerSchema);
