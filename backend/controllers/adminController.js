const User = require('../models/User');
const Order = require('../models/Order');
const Meal = require('../models/Meal');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ role: 'user' });
    const ordersCount = await Order.countDocuments({});
    const mealsCount = await Meal.countDocuments({});

    // Calculate total revenue and aggregate Top Meals
    const orders = await Order.find({ status: { $ne: 'Pending' } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    const mealStats = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!mealStats[item.name]) {
          mealStats[item.name] = { count: 0, revenue: 0 };
        }
        mealStats[item.name].count += item.quantity;
        mealStats[item.name].revenue += (item.price * item.quantity);
      });
    });

    const topMeals = Object.keys(mealStats)
      .map(name => ({
        name,
        count: mealStats[name].count,
        revenue: mealStats[name].revenue
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // 7-Day Revenue Trend Logic
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      const dayRevenue = orders
        .filter(o => o.createdAt >= d && o.createdAt < nextD)
        .reduce((acc, o) => acc + o.totalAmount, 0);
      
      last7Days.push({ 
        day: d.toLocaleDateString('en-US', { weekday: 'short' }), 
        revenue: dayRevenue 
      });
    }

    // Recent Activity Stream
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    res.json({
      usersCount,
      ordersCount,
      mealsCount,
      totalRevenue,
      topMeals,
      last7Days,
      recentOrders,
      activeOrders: await Order.countDocuments({ status: { $in: ['Pending', 'Confirmed', 'Out for Delivery'] } })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
