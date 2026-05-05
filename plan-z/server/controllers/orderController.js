const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Merchandise = require("../models/Merchandise");

// @route   POST /api/orders
// @desc    Create an order from cart checkout
// @access  Private (Attendee)
const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.merchandise");
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Verify stock and prepare order items
    for (const item of cart.items) {
      if (!item.merchandise) {
         return res.status(400).json({ message: "Invalid item in cart" });
      }
      
      const merch = await Merchandise.findById(item.merchandise._id);
      if (merch.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${merch.name}` });
      }

      orderItems.push({
        merchandise: merch._id,
        quantity: item.quantity,
        priceAtPurchase: merch.price
      });

      totalAmount += merch.price * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      status: "Completed" // Mock payment
    });

    // Decrease stock
    for (const item of orderItems) {
      await Merchandise.findByIdAndUpdate(item.merchandise, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route   GET /api/orders/my-orders
// @desc    Get logged in user orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.merchandise")
      .sort("-createdAt");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders
};
