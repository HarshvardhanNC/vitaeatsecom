const Subscription = require('../models/Subscription');

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private
const createSubscription = async (req, res) => {
  try {
    const { planType, mealsPerWeek, price } = req.body;

    const subscription = await Subscription.create({
      user: req.user._id,
      planType,
      mealsPerWeek,
      price,
      status: 'Active',
      startDate: new Date(),
      nextDelivery: new Date(new Date().setDate(new Date().getDate() + 7))
    });

    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user subscriptions
// @route   GET /api/subscriptions/mine
// @access  Private
const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update subscription status
// @route   PUT /api/subscriptions/:id/status
// @access  Private
const updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Strict schema enforcement
    if (!['Active', 'Paused', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid subscription state modification.' });
    }

    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found locally.' });
    }

    // Security verify ownership
    if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized metadata exception.' });
    }

    subscription.status = status;
    
    // Logic: If resuming from pause, auto-extend the next delivery sequence to mathematically secure the 7-day minimum
    if (status === 'Active') {
      subscription.nextDelivery = new Date(new Date().setDate(new Date().getDate() + 7));
    }

    const updatedSub = await subscription.save();
    res.json(updatedSub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSubscription,
  getMySubscriptions,
  updateSubscriptionStatus
};
