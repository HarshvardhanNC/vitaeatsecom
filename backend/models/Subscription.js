const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  planType: { 
    type: String, 
    enum: ['Weekly', 'Monthly', 'Quarterly'], 
    required: true 
  },
  mealsPerWeek: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Paused', 'Cancelled'], 
    default: 'Active' 
  },
  nextDelivery: { 
    type: Date, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
