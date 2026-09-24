require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/error');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'EventForge API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/organizations', require('./routes/organization.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/venues', require('./routes/venue.routes'));
app.use('/api/speakers', require('./routes/speaker.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/tickets', require('./routes/ticket.routes'));
app.use('/api/registrations', require('./routes/registration.routes'));
app.use('/api/coupons', require('./routes/coupon.routes'));
app.use('/api/sponsors', require('./routes/sponsor.routes'));
app.use('/api/announcements', require('./routes/announcement.routes'));
app.use('/api/attendance', require('./routes/attendance.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

module.exports = app;
