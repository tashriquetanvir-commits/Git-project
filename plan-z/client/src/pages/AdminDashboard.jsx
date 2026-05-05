import { useEffect, useState } from "react";

function AdminDashboard() {
  const [events, setEvents] = useState([]);

  const ADMIN_EVENTS_URL = "http://127.0.0.1:5000/api/admin/events";
  const EVENTS_URL = "http://127.0.0.1:5000/api/events";

  const fetchEvents = async () => {
    const res = await fetch(ADMIN_EVENTS_URL);
    const data = await res.json();
    setEvents(data);
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
      <p>Review organizer event requests and manage approved events.</p>

      <h2>Event Requests / All Events</h2>

      {events.map((event) => (
        <div key={event._id} style={{ marginBottom: "25px" }}>
          <h3>{event.title}</h3>
          <p>Venue: {event.venue || event.location}</p>
          <p>Location: {event.location}</p>
          <p>Price: {event.price ? `৳${event.price}` : "TBA"}</p>
          <p>Description: {event.description || "No description"}</p>
          <p>Status: {event.status || "pending"}</p>

          <button
            onClick={() => deleteEvent(event._id)}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete / Reject
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