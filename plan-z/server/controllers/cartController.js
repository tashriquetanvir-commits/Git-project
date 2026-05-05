const Cart = require("../models/Cart");
const Merchandise = require("../models/Merchandise");

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.merchandise");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private (Attendee)
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private (Attendee)
const addToCart = async (req, res) => {
  try {
    const { merchandiseId, quantity } = req.body;

    if (!merchandiseId || !quantity) {
      return res.status(400).json({ message: "Merchandise ID and quantity required" });
    }

    const merchandise = await Merchandise.findById(merchandiseId);
    if (!merchandise) {
      return res.status(404).json({ message: "Merchandise not found" });
    }

    if (merchandise.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(item => item.merchandise.toString() === merchandiseId);

    if (itemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (merchandise.stock < newQuantity) {
         return res.status(400).json({ message: "Not enough stock for total quantity" });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({ merchandise: merchandiseId, quantity });
    }

    await cart.save();
    
    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate("items.merchandise");
    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route   PUT /api/cart/:itemId
// @desc    Update item quantity
// @access  Private (Attendee)
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params; // This is the merchandise ID

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.merchandise.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    const merchandise = await Merchandise.findById(itemId);
    if (merchandise.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.merchandise");
    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private (Attendee)
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.merchandise.toString() !== itemId);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.merchandise");
    res.status(200).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private (Attendee)
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
