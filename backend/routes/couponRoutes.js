const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:code').get(protect, validateCoupon);

module.exports = router;
