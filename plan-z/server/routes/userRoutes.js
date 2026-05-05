const express = require("express");
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// All user routes are Admin only
router.use(protect);
router.use(authorizeRoles("admin"));

router.route("/")
  .get(getAllUsers);

router.route("/:id")
  .delete(deleteUser);

router.route("/:id/role")
  .put(updateUserRole);

module.exports = router;
