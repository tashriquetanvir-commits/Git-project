import "./App.css";

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2>PLAN-Z</h2>
        <div>
          <a>Home</a>
          <a>Events</a>
          <a>Login</a>
          <button>Register</button>
        </div>
      </nav>

      <section className="hero">
        <h1>Discover, Book, and Manage Events Easily</h1>
        <p>
          PLAN-Z is an event management and ticketing platform for attendees,
          organizers, and admins.
        </p>
        <button>Browse Events</button>
      </section>
    </div>
  );
}

export default App;