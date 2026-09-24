const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/registration.controller');

router.use(protect);

router.route('/')
  .get(ctrl.getRegistrations)
  .post(ctrl.createRegistration);

router.get('/event/:eventId', authorize('ORGANIZER', 'ADMIN', 'STAFF'), ctrl.getEventRegistrations);
router.get('/validate-coupon', ctrl.validateCoupon);

router.route('/:id')
  .get(ctrl.getRegistration)
  .delete(ctrl.cancelRegistration);

router.put('/:id/approve', authorize('ORGANIZER', 'ADMIN'), ctrl.approveRegistration);
router.put('/:id/status', authorize('ORGANIZER', 'ADMIN', 'STAFF'), ctrl.updateRegistrationStatus);

module.exports = router;
