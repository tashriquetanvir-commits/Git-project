const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  venue: String,
  location: String,
  price: Number,
  description: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

module.exports = mongoose.model("Event", eventSchema);