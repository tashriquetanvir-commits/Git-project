const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Event", eventSchema);