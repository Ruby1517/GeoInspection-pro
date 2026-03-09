import { useAuth } from "../auth/AuthContext";
import { Navbar } from "../components/Navbar";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>GeoInspection Pro</h1>
        <p>Welcome, {user?.full_name}</p>
        <p>Your role: {user?.role}</p>
      </div>
    </>
  );
}