const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/session.controller');

router.use(protect);

router.route('/')
  .get(ctrl.getSessions)
  .post(authorize('ORGANIZER', 'ADMIN'), ctrl.createSession);

router.route('/:id')
  .get(ctrl.getSession)
  .put(authorize('ORGANIZER', 'ADMIN'), ctrl.updateSession)
  .delete(authorize('ORGANIZER', 'ADMIN'), ctrl.deleteSession);

module.exports = router;
