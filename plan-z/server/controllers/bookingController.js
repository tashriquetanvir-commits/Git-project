const Booking = require("../models/Booking");
const Event = require("../models/Event");

// @route   POST /api/bookings
// @desc    Create a new booking (mock payment)
// @access  Private (Attendee)
const createBooking = async (req, res) => {
  try {
    const { eventId, quantity, ticketType, paymentMethod } = req.body;

    if (!eventId || !quantity) {
      return res.status(400).json({ message: "Event ID and quantity are required" });
    }

    // Check if event exists and is approved
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.status !== "approved") {
      return res.status(400).json({ message: "Cannot book tickets for an unapproved event" });
    }

    const totalPrice = event.price * quantity;

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      ticketType: ticketType || "General",
      quantity,
      totalPrice,
      paymentStatus: "Completed", // Mocking direct completion for now
      paymentMethod: paymentMethod || "Mock",
    });

    // Populate event info for the response
    const populatedBooking = await Booking.findById(booking._id).populate("event", "title date location");

    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error("Create booking error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/bookings/my-bookings
// @desc    Get logged in user's bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date location venue price")
      .sort("-createdAt");

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Get my bookings error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/bookings/event/:eventId/attendees
// @desc    Get attendees for a specific event
// @access  Private (Organizer of the event, or Admin)
const getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check authorization: Must be the organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view attendees for this event" });
    }

    const bookings = await Booking.find({ event: eventId })
      .populate("user", "name email")
      .sort("-createdAt");

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Get event attendees error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getEventAttendees,
};
