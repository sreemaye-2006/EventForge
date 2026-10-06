const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: {
    type: String,
    enum: ['ADMIN', 'ORGANIZER', 'STAFF', 'SPEAKER', 'ATTENDEE', 'SPONSOR'],
    default: 'ATTENDEE'
  },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  interests: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.index({ organizationId: 1 });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'secret_jwt_key_eventforge_production_123',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = mongoose.model('User', userSchema);

