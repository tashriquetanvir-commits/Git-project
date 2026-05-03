const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PLAN-Z API running");
});

app.get("/api/events", (req, res) => {
  const events = [
    { id: 1, title: "Tech Summit", location: "Dhaka" },
    { id: 2, title: "Music Night", location: "Chittagong" },
  ];

  res.json(events);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});