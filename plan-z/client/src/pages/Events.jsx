const events = [
  {
    id: 1,
    title: "Tech Innovation Summit",
    category: "Technology",
    location: "Dhaka",
    date: "20 June 2026",
    price: "৳500",
  },
  {
    id: 2,
    title: "Music Night 2026",
    category: "Concert",
    location: "Chittagong",
    date: "25 June 2026",
    price: "৳800",
  },
  {
    id: 3,
    title: "Startup Networking Meetup",
    category: "Business",
    location: "Dhaka",
    date: "30 June 2026",
    price: "Free",
  },
];

function Events() {
  return (
    <main className="page">
      <h1>Browse Events</h1>
      <p>Find events by category, location, and date.</p>

      <div className="event-grid">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <span>{event.category}</span>
            <h3>{event.title}</h3>
            <p>{event.location}</p>
            <p>{event.date}</p>
            <strong>{event.price}</strong>
            <button>View Details</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Events;