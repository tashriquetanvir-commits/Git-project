const Merchandise = require("../models/Merchandise");
const MerchandiseOrder = require("../models/MerchandiseOrder");
const Event = require("../models/Event");

// @route   POST /api/merchandise
// @desc    Add merchandise for an event
// @access  Private (Organizer)
const createMerchandise = async (req, res) => {
  try {
    const { name, description, price, stock, eventId } = req.body;

    if (!name || !description || price === undefined || !eventId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to add merchandise for this event" });
    }

    const merchandise = await Merchandise.create({
      name,
      description,
      price,
      stock: stock || 0,
      event: eventId,
      organizer: req.user._id,
    });

    res.status(201).json(merchandise);
  } catch (err) {
    console.error("Create merchandise error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/merchandise/event/:eventId
// @desc    Get merchandise by event
// @access  Public
const getMerchandiseByEvent = async (req, res) => {
  try {
    const merchandise = await Merchandise.find({ event: req.params.eventId });
    res.status(200).json(merchandise);
  } catch (err) {
    console.error("Get merchandise error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   PUT /api/merchandise/:id
// @desc    Update merchandise
// @access  Private (Organizer)
const updateMerchandise = async (req, res) => {
  try {
    let merchandise = await Merchandise.findById(req.params.id);

    if (!merchandise) {
      return res.status(404).json({ message: "Merchandise not found" });
    }

    if (merchandise.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this merchandise" });
    }

    merchandise = await Merchandise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(merchandise);
  } catch (err) {
    console.error("Update merchandise error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   DELETE /api/merchandise/:id
// @desc    Delete merchandise
// @access  Private (Organizer)
const deleteMerchandise = async (req, res) => {
  try {
    const merchandise = await Merchandise.findById(req.params.id);

    if (!merchandise) {
      return res.status(404).json({ message: "Merchandise not found" });
    }

    if (merchandise.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this merchandise" });
    }

    await Merchandise.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Merchandise deleted successfully" });
  } catch (err) {
    console.error("Delete merchandise error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   POST /api/merchandise/purchase
// @desc    Purchase merchandise
// @access  Private (Attendee)
const purchaseMerchandise = async (req, res) => {
  try {
    const { merchandiseId, quantity } = req.body;

    if (!merchandiseId || !quantity) {
      return res.status(400).json({ message: "Merchandise ID and quantity are required" });
    }

    const merchandise = await Merchandise.findById(merchandiseId);
    if (!merchandise) {
      return res.status(404).json({ message: "Merchandise not found" });
    }

    if (merchandise.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const totalPrice = merchandise.price * quantity;

    // Create order
    const order = await MerchandiseOrder.create({
      user: req.user._id,
      merchandise: merchandiseId,
      quantity,
      totalPrice,
      status: "Completed",
    });

    // Reduce stock
    merchandise.stock -= quantity;
    await merchandise.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Purchase merchandise error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/merchandise/my-orders
// @desc    Get my merchandise orders
// @access  Private
const getMyMerchandiseOrders = async (req, res) => {
  try {
    const orders = await MerchandiseOrder.find({ user: req.user._id })
      .populate({
        path: "merchandise",
        select: "name price event",
        populate: {
          path: "event",
          select: "title",
        },
      })
      .sort("-createdAt");

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get my merchandise orders error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createMerchandise,
  getMerchandiseByEvent,
  updateMerchandise,
  deleteMerchandise,
  purchaseMerchandise,
  getMyMerchandiseOrders,
};
