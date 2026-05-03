import { useEffect, useState } from "react";

function AdminDashboard() {
  const [events, setEvents] = useState([]);

  const API_URL = "http://127.0.0.1:5000/api/events";

  // fetch all events
  const fetchEvents = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setEvents(data);
  };

  // delete event
  const deleteEvent = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchEvents(); // refresh list
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <h3>All Events</h3>

      {events.map((event) => (
        <div key={event._id} style={{ marginBottom: "10px" }}>
          <b>{event.title}</b> - {event.location}

          <button
            onClick={() => deleteEvent(event._id)}
            style={{
              marginLeft: "10px",
              backgroundColor: "red",
              color: "white",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;