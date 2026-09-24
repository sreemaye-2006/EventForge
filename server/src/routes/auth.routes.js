const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/auth.controller');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', protect, ctrl.getMe);
router.put('/profile', protect, ctrl.updateProfile);

// Admin user management
router.get('/users', protect, authorize('ADMIN'), ctrl.getUsers);
router.put('/users/:id', protect, authorize('ADMIN'), ctrl.updateUser);
router.delete('/users/:id', protect, authorize('ADMIN'), ctrl.deleteUser);

module.exports = router;
