const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const regCtrl = require('../controllers/registration.controller');

router.use(protect);

router.get('/tickets', regCtrl.getRegistrations);
router.get('/tickets/:id', regCtrl.getRegistration);

module.exports = router;
