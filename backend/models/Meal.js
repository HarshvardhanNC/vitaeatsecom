const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fats: {
    type: Number,
    default: 0
  },
  dietTags: [{
    type: String
  }],
  ingredients: [{
    type: String
  }],
  category: {
    type: String,
    required: true,
    default: 'All'
  },
  oilType: {
    type: String,
    default: 'None'
  },
  sugarLevel: {
    type: String,
    enum: ['zero', 'low', 'medium', 'high'],
    default: 'medium'
  },
  isCustom: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
