const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  merchandise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Merchandise",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  priceAtPurchase: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
