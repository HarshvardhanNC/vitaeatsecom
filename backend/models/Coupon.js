const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
  },
  discountPercent: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 100 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  expiryDate: { 
    type: Date 
  },
  createdByAdmin: { 
    type: Boolean, 
    default: false 
  }, // true for promo codes (HEALTHY20), false for user referrals
  referredBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Coupon', couponSchema);
