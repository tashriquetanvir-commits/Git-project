const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  eventTitle: String,
  userEmail: String,
  quantity: Number,
  totalPrice: Number,
  paymentStatus: {
    type: String,
    default: "Pending Payment",
  },
});

module.exports = mongoose.model("Booking", bookingSchema);