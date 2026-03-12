import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/">Dashboard</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/inspections">Inspections</Link>
      <Link to="/inspections/new">Create Inspection</Link>
      <Link to="/inspections/nearby">Nearby Search</Link>
      <Link to="/service-areas">Service Areas</Link>
      <Link to="/parcels">Parcels</Link>

      <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
        {user && (
          <span>
            {user.full_name} ({user.role})
          </span>
        )}
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
