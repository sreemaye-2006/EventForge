const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/sponsor.controller');
const pkgCtrl = require('../controllers/package.controller');
const delivCtrl = require('../controllers/deliverable.controller');

router.use(protect);

// Packages
router.route('/packages')
  .get(pkgCtrl.getPackages)
  .post(authorize('ORGANIZER', 'ADMIN'), pkgCtrl.createPackage);

router.route('/packages/:id')
  .get(pkgCtrl.getPackage)
  .put(authorize('ORGANIZER', 'ADMIN'), pkgCtrl.updatePackage)
  .delete(authorize('ORGANIZER', 'ADMIN'), pkgCtrl.deletePackage);

// Deliverables
router.route('/deliverables')
  .get(delivCtrl.getDeliverables)
  .post(authorize('ORGANIZER', 'ADMIN'), delivCtrl.createDeliverable);

router.route('/deliverables/:id')
  .get(delivCtrl.getDeliverable)
  .put(delivCtrl.updateDeliverable)
  .delete(authorize('ORGANIZER', 'ADMIN'), delivCtrl.deleteDeliverable);

// Sponsors
router.route('/')
  .get(ctrl.getSponsors)
  .post(authorize('ORGANIZER', 'ADMIN'), ctrl.createSponsor);

router.route('/:id')
  .get(ctrl.getSponsor)
  .put(ctrl.updateSponsor)
  .delete(authorize('ORGANIZER', 'ADMIN'), ctrl.deleteSponsor);

module.exports = router;
