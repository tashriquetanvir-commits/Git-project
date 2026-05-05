const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
  getAllEventsAdmin,
  updateEventStatus,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// PUBLIC ROUTES
// GET /api/events - Get all approved events (with optional search/filter)
router.get("/", getEvents);

// GET /api/events/:id - Get single event by ID
router.get("/:id", getEventById);

// PROTECTED ROUTES

// ORGANIZER ROUTES
// POST /api/events - Create an event
router.post("/", protect, authorizeRoles("organizer"), createEvent);

// GET /api/events/organizer/my-events - Get organizer's own events
// Note: This must come before /:id otherwise "organizer" is treated as an id
router.get("/organizer/my-events", protect, authorizeRoles("organizer"), getOrganizerEvents);

// PUT /api/events/:id - Update an event
router.put("/:id", protect, authorizeRoles("organizer"), updateEvent);


// ADMIN ROUTES
// GET /api/events/admin/all - Get all events (all statuses)
router.get("/admin/all", protect, authorizeRoles("admin"), getAllEventsAdmin);

// PUT /api/events/admin/:id/status - Update event status (approve/reject)
router.put("/admin/:id/status", protect, authorizeRoles("admin"), updateEventStatus);


// ORGANIZER / ADMIN ROUTE
// DELETE /api/events/:id - Delete an event
router.delete("/:id", protect, authorizeRoles("organizer", "admin"), deleteEvent);

module.exports = router;
