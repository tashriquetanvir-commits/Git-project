const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const Event = require("./models/Event");

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

/* Attendee/public: only approved events */
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find({ status: "approved" });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Admin: all events */
app.get("/api/admin/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Add event: default pending */
app.post("/api/events", async (req, res) => {
  try {
    const { title, location } = req.body;

    const newEvent = new Event({
      title,
      location,
      status: "pending",
    });

    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* Delete event */
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

/* Approve event */
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

/* Admin login */
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@test.com" && password === "admin123") {
      const token = jwt.sign({ role: "admin" }, "secretkey", {
        expiresIn: "1h",
      });

      return res.json({ token });
    }

    res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});