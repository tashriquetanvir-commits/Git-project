const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// All order routes require auth
router.use(protect);

router.post("/", createOrder);
router.get("/my-orders", getMyOrders);

module.exports = router;
