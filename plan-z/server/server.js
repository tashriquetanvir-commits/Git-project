const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Event = require("./models/Event");
const User = require("./models/User");
const Booking = require("./models/Booking");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("PLAN-Z API running");
});

/* PUBLIC EVENTS */
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADMIN EVENTS */
app.get("/api/admin/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADD EVENT REQUEST */
app.post("/api/events", async (req, res) => {
  try {
    const { title, venue, location, price, description } = req.body;

    const newEvent = new Event({
      title,
      venue,
      location,
      price,
      description,
      status: "pending",
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE EVENT */
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* APPROVE EVENT */
app.put("/api/admin/approve/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* USER SIGNUP */
app.post("/api/users/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* USER LOGIN */
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ADMIN LOGIN */
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@test.com" && password === "admin123") {
      const token = jwt.sign({ role: "admin" }, "secretkey", {
        expiresIn: "1h",
      });

      return res.json({ token, role: "admin" });
    }

    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* BOOK TICKET - PAYMENT PLACEHOLDER */
app.post("/api/bookings", async (req, res) => {
  try {
    const { eventId, eventTitle, userEmail, quantity, totalPrice } = req.body;

    const newBooking = new Booking({
      eventId,
      eventTitle,
      userEmail,
      quantity,
      totalPrice,
      paymentStatus: "Payment Placeholder - Not Paid Yet",
    });

    await newBooking.save();

    res.json({
      message: "Booking created with payment placeholder",
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* BOOKING HISTORY */
app.get("/api/bookings/:email", async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.params.email });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});