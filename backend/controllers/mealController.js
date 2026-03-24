const Meal = require('../models/Meal');

// @desc    Fetch all meals
// @route   GET /api/meals
// @access  Public
const getMeals = async (req, res) => {
  try {
    const { dietTags } = req.query;
    let query = {};
    if (dietTags) {
      const tagsArray = typeof dietTags === 'string' ? dietTags.split(',') : dietTags;
      query.dietTags = { $in: tagsArray };
    }
    const meals = await Meal.find(query);
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a meal
// @route   POST /api/meals
// @access  Private/Admin
const createMeal = async (req, res) => {
  try {
    const { name, price, calories, image, stock, protein, carbs, fats, dietTags, ingredients, oilType, sugarLevel } = req.body;
    
    const mealName = name || 'Sample name';
    const mealPrice = price !== undefined ? price : 0;
    const mealCalories = calories !== undefined ? calories : 0;
    const mealImage = image || 'https://via.placeholder.com/150';
    const mealStock = stock !== undefined ? stock : 0;

    const meal = new Meal({
      name: mealName,
      price: mealPrice,
      calories: mealCalories,
      image: mealImage,
      stock: mealStock,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      dietTags: dietTags || [],
      ingredients: ingredients || [],
      oilType: oilType || 'Standard',
      sugarLevel: sugarLevel || 'medium'
    });
    const createdMeal = await meal.save();
    res.status(201).json(createdMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a meal
// @route   PUT /api/meals/:id
// @access  Private/Admin
const updateMeal = async (req, res) => {
  try {
    const { name, price, calories, image, stock, protein, carbs, fats, dietTags, ingredients, oilType, sugarLevel } = req.body;
    const meal = await Meal.findById(req.params.id);

    if (meal) {
      meal.name = name || meal.name;
      meal.price = price !== undefined ? price : meal.price;
      meal.calories = calories !== undefined ? calories : meal.calories;
      meal.image = image || meal.image;
      meal.stock = stock !== undefined ? stock : meal.stock;

      meal.protein = protein !== undefined ? protein : meal.protein;
      meal.carbs = carbs !== undefined ? carbs : meal.carbs;
      meal.fats = fats !== undefined ? fats : meal.fats;
      meal.dietTags = dietTags || meal.dietTags;
      meal.ingredients = ingredients || meal.ingredients;
      meal.oilType = oilType || meal.oilType;
      meal.sugarLevel = sugarLevel || meal.sugarLevel;

      const updatedMeal = await meal.save();
      res.json(updatedMeal);
    } else {
      res.status(404).json({ message: 'Meal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
// @access  Private/Admin
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (meal) {
      await meal.deleteOne();
      res.json({ message: 'Meal removed' });
    } else {
      res.status(404).json({ message: 'Meal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create custom user bowl dynamically
// @route   POST /api/meals/custom
// @access  Private
const createCustomMeal = async (req, res) => {
  try {
    const { price, calories, protein, carbs, fats, ingredients } = req.body;
    
    const meal = new Meal({
      name: 'Custom Signature Bowl',
      price: price || 0,
      calories: calories || 0,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
      stock: 999,
      protein: protein || 0,
      carbs: carbs || 0,
      fats: fats || 0,
      dietTags: ['Custom'],
      ingredients: ingredients || [],
      isCustom: true,
      category: 'Custom'
    });
    
    const createdMeal = await meal.save();
    res.status(201).json(createdMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMeals, createMeal, updateMeal, deleteMeal, createCustomMeal };
