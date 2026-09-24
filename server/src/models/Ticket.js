const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: [true, 'Ticket name is required'], trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0, default: 0 },
  capacity: { type: Number, required: true, min: 1 },
  soldCount: { type: Number, default: 0 },
  saleStart: { type: Date },
  saleEnd: { type: Date },
  benefits: [{ type: String }],
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SOLD_OUT'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

ticketSchema.virtual('availableCount').get(function () {
  return this.capacity - this.soldCount;
});

ticketSchema.virtual('isSoldOut').get(function () {
  return this.soldCount >= this.capacity;
});

module.exports = mongoose.model('Ticket', ticketSchema);
