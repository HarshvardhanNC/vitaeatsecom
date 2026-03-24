const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Meal = require('../models/Meal');

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { shippingAddress, couponCode } = req.body;
    const cartItems = await CartItem.find({ user: req.user._id }).populate('meal');
    const validCartItems = cartItems.filter(item => item.meal !== null);

    if (validCartItems.length === 0) {
      if (cartItems.length > 0) await CartItem.deleteMany({ user: req.user._id });
      return res.status(400).json({ message: 'No valid order items found.' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Valid shipping address is strictly required.' });
    }

    // 1. Stock Validation Check
    for (const item of validCartItems) {
      if (item.meal.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.meal.name}. Only ${item.meal.stock} remaining.` });
      }
    }

    const orderItems = validCartItems.map(item => ({
      name: item.meal.name,
      quantity: item.quantity,
      image: item.meal.image,
      price: item.meal.price,
      meal: item.meal._id
    }));

    // Server-side Coupon & Mathematical Validation
    let discountPercent = 0;
    let referrerId = null;

    if (couponCode) {
      const couponUpper = couponCode.toUpperCase();
      
      if (couponUpper === 'HEALTHY20') {
        discountPercent = 0.20;
      } else if (couponUpper.startsWith('VITA-')) {
        const suffix = couponUpper.split('-')[1];
        const User = require('../models/User');
        
        const referrers = await User.aggregate([
          { $addFields: { idStr: { $toString: "$_id" } } },
          { $match: { idStr: { $regex: suffix + '$', $options: 'i' } } },
          { $limit: 1 }
        ]);

        const referrer = referrers.length > 0 ? referrers[0] : null;
        
        if (referrer && referrer._id.toString() !== req.user._id.toString()) {
          discountPercent = 0.20;
          referrerId = referrer._id;
        }
      } else {
        const Coupon = require('../models/Coupon');
        const validCoupon = await Coupon.findOne({ code: couponUpper, isActive: true });
        if (validCoupon) {
          discountPercent = validCoupon.discountPercent / 100;
        }
      }
    }

    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discountAmount = subtotal * discountPercent;
    
    // 2. Wallet Deduction Logic
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const walletUsed = Math.min(user.walletBalance || 0, (subtotal - discountAmount + 40));
    
    const totalAmount = subtotal - discountAmount + 40 - walletUsed; 

    // Create a Confirmed Order in DB instantly for prototype
    const dbOrder = new Order({
      orderItems,
      user: req.user._id,
      totalAmount,
      discountAmount,
      walletAmountUsed: walletUsed,
      shippingAddress,
      paymentStatus: 'Success',
      status: 'Confirmed'
    });
    
    await dbOrder.save();

    // Update Buyer's Wallet (Subtract what was used)
    if (walletUsed > 0) {
      user.walletBalance -= walletUsed;
      await user.save();
    }

    // Award Referrer Bounty (₹150)
    if (referrerId) {
      const referrerUser = await User.findById(referrerId);
      if (referrerUser) {
        referrerUser.walletBalance += 150;
        await referrerUser.save();
      }
    }

    // Decrease stock mapping
    for (const item of dbOrder.orderItems) {
      const dbMeal = await Meal.findById(item.meal);
      if (dbMeal) {
        dbMeal.stock -= item.quantity;
        await dbMeal.save();
      }
    }

    // Clear cart immediately
    await CartItem.deleteMany({ user: req.user._id });

    res.status(200).json({
      success: true,
      orderId: dbOrder._id
    });

  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ message: error.message || 'Something went wrong while creating the order' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const order = await Order.findById(dbOrderId);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.paymentStatus = 'Success';
      order.paymentId = razorpay_payment_id;
      order.status = 'Confirmed';
      await order.save();

      // Decrease stock mapping
      for (const item of order.orderItems) {
        const dbMeal = await Meal.findById(item.meal);
        if (dbMeal) {
          dbMeal.stock -= item.quantity;
          await dbMeal.save();
        }
      }

      // Clear cart
      await CartItem.deleteMany({ user: req.user._id });

      res.status(200).json({ message: "Payment verified successfully", orderId: order._id });
    } else {
      // Invalid signature
      const order = await Order.findById(dbOrderId);
      if (order) {
        order.paymentStatus = 'Failed';
        await order.save();
      }
      return res.status(400).json({ message: "Invalid payment signature!" });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// @desc    Get Invoice Details
// @route   GET /api/payment/invoice/:orderId
// @access  Private
const getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure the user owns the order, or is an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this invoice' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment, getInvoice };
