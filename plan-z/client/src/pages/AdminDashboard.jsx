import { useEffect, useState } from "react";

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const ADMIN_EVENTS_URL = "http://127.0.0.1:5000/api/admin/events";
  const EVENTS_URL = "http://127.0.0.1:5000/api/events";

  const fetchEvents = async () => {
    const res = await fetch(ADMIN_EVENTS_URL);
    const data = await res.json();
    setEvents(data);
  };

  const addEvent = async () => {
    if (!title.trim() || !location.trim()) {
      alert("Please fill all fields");
      return;
    }

    await fetch(EVENTS_URL, {
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
    await fetch(`${EVENTS_URL}/${id}`, {
      method: "DELETE",
    });

    fetchEvents();
  };

  const approveEvent = async (id) => {
    await fetch(`http://127.0.0.1:5000/api/admin/approve/${id}`, {
      method: "PUT",
    });

    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Admin can add, approve, and remove events.</p>

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
        <div key={event._id} style={{ marginBottom: "20px" }}>
          <h3>{event.title}</h3>
          <p>{event.location}</p>
          <p>Status: {event.status || "pending"}</p>

          <button
            onClick={() => deleteEvent(event._id)}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete
          </button>

          {(event.status === "pending" || !event.status) && (
            <button
              onClick={() => approveEvent(event._id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "green",
                color: "white",
              }}
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;