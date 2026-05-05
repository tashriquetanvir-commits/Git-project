const Event = require("../models/Event");

// @route   POST /api/events
// @desc    Create an event (pending status by default)
// @access  Private (Organizer)
const createEvent = async (req, res) => {
  try {
    const { title, venue, location, price, description, date, category } = req.body;

    if (!title || !venue || !location || price === undefined || !description || !date || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEvent = await Event.create({
      title,
      venue,
      location,
      price,
      description,
      date,
      category,
      organizer: req.user._id,
      status: "pending",
    });

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Create event error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/events
// @desc    Get all approved events (with optional search/filter)
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search, category, location, date } = req.query;

    let query = { status: "approved" };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = { $regex: category, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (date) {
        // basic date matching
        const searchDate = new Date(date);
        const nextDay = new Date(searchDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query.date = { $gte: searchDate, $lt: nextDay };
    }

    const events = await Event.find(query).populate("organizer", "name email");
    res.status(200).json(events);
  } catch (err) {
    console.error("Get events error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error("Get event error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/events/organizer/my-events
// @desc    Get logged in organizer's events
// @access  Private (Organizer)
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    res.status(200).json(events);
  } catch (err) {
    console.error("Get organizer events error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Organizer)
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer of the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this event" });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(event);
  } catch (err) {
    console.error("Update event error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Organizer/Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is organizer or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/events/admin/all
// @desc    Get all events (for admin)
// @access  Private (Admin)
const getAllEventsAdmin = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json(events);
  } catch (err) {
    console.error("Admin get all events error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   PUT /api/events/admin/:id/status
// @desc    Update event status (approve/reject)
// @access  Private (Admin)
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    res.status(200).json(event);
  } catch (err) {
    console.error("Update event status error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
  getAllEventsAdmin,
  updateEventStatus,
};
