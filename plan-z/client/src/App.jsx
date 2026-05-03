import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Login from "./pages/Login";

function App() {
  return (
    <div>
      <nav className="navbar">
        <h2>PLAN-Z</h2>
        <div>
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/login">Login</Link>
          <button>Register</button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;