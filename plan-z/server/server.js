const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Event = require("./models/Event");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   CONNECT TO MONGODB
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("PLAN-Z API running");
});

/* =========================
   GET EVENTS
========================= */
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ADD EVENT
========================= */
app.post("/api/events", async (req, res) => {
  try {
    const { title, location } = req.body;

    const newEvent = new Event({ title, location });
    await newEvent.save();

    res.json(newEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DELETE EVENT
========================= */
app.delete("/api/events/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ADMIN LOGIN (SIMPLE VERSION)
========================= */
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "admin@test.com" && password === "admin123") {
      const token = jwt.sign({ role: "admin" }, "secretkey", {
        expiresIn: "1h",
      });

      return res.json({ token });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (err) {
    console.log("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   SERVER
========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});