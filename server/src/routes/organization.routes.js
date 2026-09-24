const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/organization.controller');

router.use(protect);

router.route('/')
  .get(authorize('ADMIN'), ctrl.getOrganizations)
  .post(authorize('ADMIN'), ctrl.createOrganization);

router.route('/:id')
  .get(authorize('ADMIN', 'ORGANIZER'), ctrl.getOrganization)
  .put(authorize('ADMIN'), ctrl.updateOrganization)
  .delete(authorize('ADMIN'), ctrl.deleteOrganization);

module.exports = router;
