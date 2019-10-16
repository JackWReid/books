const express = require('express');
const router = express.Router();
const readingController = require('../controllers/reading');
const authController = require('../controllers/auth');

// GET User's reading
router.get('/:uid', readingController.getUserReading);

// PUT User currently reading
router.put('/current', authController.isAuthenticated, readingController.putUserCurrentReading);

// PUT User finish currently reading
router.put('/finish', authController.isAuthenticated, readingController.finishUserCurrentReading);

module.exports = router;
