import { useEffect, useState } from "react";

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <main className="page">
      <h1>Browse Events</h1>
      <p>Find events by category, location, and date.</p>

      <div className="event-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Events;