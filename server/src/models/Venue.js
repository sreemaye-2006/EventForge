const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  name: { type: String, required: [true, 'Venue name is required'], trim: true },
  location: { type: String, default: '' },
  address: { type: String, default: '' },
  capacity: { type: Number, required: [true, 'Capacity is required'], min: 1 },
  facilities: [{ type: String }],
  floor: { type: String, default: '' },
  roomNumber: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Venue', venueSchema);
