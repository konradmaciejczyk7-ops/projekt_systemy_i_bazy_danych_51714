import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{
      display: "flex",
      gap: "20px",
      padding: "15px",
      background: "#222",
    }}>
      <Link style={{ color: "white" }} to="/">Home</Link>
      <Link style={{ color: "white" }} to="/reservations">Reservations</Link>
      <Link style={{ color: "white" }} to="/rooms">Rooms</Link>

      <Link style={{ color: "white", marginLeft: "auto" }} to="/login">
        Login
      </Link>
      <Link style={{ color: "white" }} to="/register">
        Register
      </Link>
    </div>
  );
}