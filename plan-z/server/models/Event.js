const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  location: String,

  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  },
});

module.exports = mongoose.model("Event", eventSchema);