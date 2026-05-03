import { useEffect, useState } from "react";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const API_URL = "http://127.0.0.1:5000/api/events";

  const fetchEvents = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setEvents(data);
  };

  const addEvent = async () => {
    if (!title.trim() || !location.trim()) {
      alert("Please fill all fields");
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, location }),
    });

    setTitle("");
    setLocation("");
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Admin can add and remove events from here.</p>

      <h2>Add Event</h2>

      <input
        type="text"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Event location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button onClick={addEvent}>Add Event</button>

      <hr />

      <h2>All Events</h2>

      {events.map((event) => (
        <div key={event._id} style={{ marginBottom: "15px" }}>
          <h3>{event.title}</h3>
          <p>{event.location}</p>

          <button
            onClick={() => deleteEvent(event._id)}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;