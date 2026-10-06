const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
} = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMyNotifications)
  .post(createNotification);

router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', markAsRead);

module.exports = router;
