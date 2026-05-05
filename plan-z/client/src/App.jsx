import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h2>PLAN-Z</h2>
        <Link to="/signup">Signup</Link>

        <div>
          <Link to="/">Home</Link> |{" "}
          <Link to="/events">Events</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}
          <Link to="/admin-login">Admin</Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </div>
  );
}

export default App;