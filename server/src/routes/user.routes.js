const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  toggleUserStatus,
  deleteUser
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.patch('/:id/toggle-status', toggleUserStatus);

module.exports = router;
