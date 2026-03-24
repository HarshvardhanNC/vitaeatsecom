const Coupon = require('../models/Coupon');

// @desc    Get coupon by code (validate)
// @route   GET /api/coupons/:code
// @access  Private
const validateCoupon = async (req, res) => {
  try {
    const couponUrlCode = req.params.code ? req.params.code.toUpperCase() : '';
    
    // Support "HEALTHY20" as an evergreen prototype code
    if (couponUrlCode === 'HEALTHY20') {
      return res.json({ discountPercent: 20 });
    }

    // Referral Code Detection Logic: VITA-XXXXXX
    if (couponUrlCode.startsWith('VITA-')) {
      const suffix = couponUrlCode.split('-')[1];
      if (suffix && suffix.length === 6) {
        const User = require('../models/User');
        
        // Use aggregation to cast ObjectId to String for suffix matching
        const referrers = await User.aggregate([
          { $addFields: { idStr: { $toString: "$_id" } } },
          { $match: { idStr: { $regex: suffix + '$', $options: 'i' } } },
          { $limit: 1 }
        ]);

        const referrer = referrers.length > 0 ? referrers[0] : null;
        
        if (referrer) {
          // Rule: Cannot refer yourself
          if (referrer._id.toString() === req.user._id.toString()) {
             return res.status(400).json({ message: 'You cannot use your own referral code.' });
          }
          return res.json({ discountPercent: 20, isReferral: true });
        }
      }
      return res.status(404).json({ message: 'Invalid referral code.' });
    }

    const coupon = await Coupon.findOne({ code: couponUrlCode, isActive: true });
    
    if (coupon) {
      if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
        return res.status(400).json({ message: 'Coupon expired' });
      }
      res.json({ discountPercent: coupon.discountPercent });
    } else {
      res.status(404).json({ message: 'Coupon not found or inactive' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  validateCoupon
};
