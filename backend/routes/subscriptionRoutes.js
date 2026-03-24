const express = require('express');
const router = express.Router();
const { createSubscription, getMySubscriptions, updateSubscriptionStatus } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createSubscription);
router.get('/mine', protect, getMySubscriptions);
router.put('/:id/status', protect, updateSubscriptionStatus);

module.exports = router;
