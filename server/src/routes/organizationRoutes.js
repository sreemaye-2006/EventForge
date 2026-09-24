const express = require('express');
const {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizationController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Apply protection to all organization routes
router.use(protect);
router.use(authorize('Platform Admin'));

router
  .route('/')
  .get(getOrganizations)
  .post(createOrganization);

router
  .route('/:id')
  .get(getOrganization)
  .put(updateOrganization)
  .delete(deleteOrganization);

module.exports = router;
