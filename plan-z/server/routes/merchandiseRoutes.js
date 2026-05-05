const express = require("express");
const router = express.Router();

const {
  createMerchandise,
  getMerchandiseByEvent,
  updateMerchandise,
  deleteMerchandise,
  purchaseMerchandise,
  getMyMerchandiseOrders,
} = require("../controllers/merchandiseController");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// PUBLIC ROUTES
router.get("/event/:eventId", getMerchandiseByEvent);

// PROTECTED ROUTES
router.use(protect);

// Attendee/User Routes
router.post("/purchase", purchaseMerchandise);
router.get("/my-orders", getMyMerchandiseOrders);

// Organizer Routes
router.post("/", authorizeRoles("organizer"), createMerchandise);
router.put("/:id", authorizeRoles("organizer"), updateMerchandise);
router.delete("/:id", authorizeRoles("organizer"), deleteMerchandise);

module.exports = router;
