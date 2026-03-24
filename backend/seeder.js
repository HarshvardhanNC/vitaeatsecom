const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Meal = require('./models/Meal');
const User = require('./models/User');
const CartItem = require('./models/CartItem');
const meals = require('./data/meals');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Meal.deleteMany();
    // We don't delete users or carts to not lose testing data across seed runs later,
    // but for initial seed, it's fine.
    await User.deleteMany();
    await CartItem.deleteMany();

    // Persist Hardcoded Master Admin
    await User.create({
      name: 'VitaEats Master Admin',
      email: 'admin@vitaeats.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    await Meal.insertMany(meals);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Meal.deleteMany();
    await User.deleteMany();
    await CartItem.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
