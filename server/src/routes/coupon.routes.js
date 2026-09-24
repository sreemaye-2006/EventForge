const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/coupon.controller');

router.use(protect);

router.route('/')
  .get(ctrl.getCoupons)
  .post(authorize('ORGANIZER', 'ADMIN'), ctrl.createCoupon);

router.post('/validate', ctrl.validateCoupon);

router.route('/:id')
  .get(ctrl.getCoupon)
  .put(authorize('ORGANIZER', 'ADMIN'), ctrl.updateCoupon)
  .delete(authorize('ORGANIZER', 'ADMIN'), ctrl.deleteCoupon);

module.exports = router;
