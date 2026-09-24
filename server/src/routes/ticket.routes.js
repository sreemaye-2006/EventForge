const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/ticket.controller');

router.use(protect);

router.route('/')
  .get(ctrl.getTickets)
  .post(authorize('ORGANIZER', 'ADMIN'), ctrl.createTicket);

router.route('/:id')
  .get(ctrl.getTicket)
  .put(authorize('ORGANIZER', 'ADMIN'), ctrl.updateTicket)
  .delete(authorize('ORGANIZER', 'ADMIN'), ctrl.deleteTicket);

module.exports = router;
