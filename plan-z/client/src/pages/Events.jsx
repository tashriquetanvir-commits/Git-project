import { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const API_URL = "http://127.0.0.1:5000/api/events";

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const addEvent = async () => {
    if (!title.trim() || !location.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          location,
        }),
      });

      const data = await res.json();
      console.log("Added:", data);

      setTitle("");
      setLocation("");
      fetchEvents();
    } catch (err) {
      console.log("Add error:", err);
    }
  };

  const deleteEvent = async (id) => {
    console.log("Deleting ID:", id);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log("Delete response:", data);

      fetchEvents();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Events</h1>

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

      {events.map((event) => (
        <div key={event._id} style={{ marginBottom: "15px" }}>
          <h3>{event.title}</h3>
          <p>{event.location}</p>

          <button
            onClick={() => deleteEvent(event._id)}
            style={{
              backgroundColor: "red",
              color: "white",
              marginTop: "5px",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Events;