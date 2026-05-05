const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getEventAttendees,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// All booking routes require authentication
router.use(protect);

// POST /api/bookings - Create booking
router.post("/", createBooking);

// GET /api/bookings/my-bookings - View own bookings
router.get("/my-bookings", getMyBookings);

// GET /api/bookings/event/:eventId/attendees - View attendees for an event (Organizer/Admin)
router.get("/event/:eventId/attendees", authorizeRoles("organizer", "admin"), getEventAttendees);

module.exports = router;
