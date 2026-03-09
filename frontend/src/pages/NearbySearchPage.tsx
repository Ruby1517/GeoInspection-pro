import { useState } from "react";
import { getNearbyInspections } from "../api/inspections";
import { InspectionsMap } from "../components/InspectionsMap";
import { Navbar } from "../components/Navbar";
import type { NearbyInspection } from "../types/inspection";

export function NearbySearchPage() {
  const [lat, setLat] = useState(36.7378);
  const [lng, setLng] = useState(-119.7871);
  const [radiusMeters, setRadiusMeters] = useState(2000);
  const [results, setResults] = useState<NearbyInspection[]>([]);
  const [error, setError] = useState("");

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      const data = await getNearbyInspections({
        lat,
        lng,
        radius_meters: radiusMeters,
      });
      setResults(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to search nearby inspections.");
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>Nearby Inspection Search</h1>

        <form
          onSubmit={handleSearch}
          style={{
            display: "grid",
            gap: "1rem",
            maxWidth: 500,
            marginBottom: "1.5rem",
          }}
        >
          <input
            type="number"
            step="0.000001"
            value={lat}
            onChange={(e) => setLat(Number(e.target.value))}
            placeholder="Latitude"
          />

          <input
            type="number"
            step="0.000001"
            value={lng}
            onChange={(e) => setLng(Number(e.target.value))}
            placeholder="Longitude"
          />

          <input
            type="number"
            value={radiusMeters}
            onChange={(e) => setRadiusMeters(Number(e.target.value))}
            placeholder="Radius in meters"
          />

          <button type="submit">Search Nearby</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginBottom: "1.5rem" }}>
          <InspectionsMap inspections={results} />
        </div>

        <table cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th align="left">Inspection #</th>
              <th align="left">Title</th>
              <th align="left">Distance (m)</th>
              <th align="left">Status</th>
              <th align="left">Priority</th>
              <th align="left">Address</th>
            </tr>
          </thead>
          <tbody>
            {results.map((inspection) => (
              <tr key={inspection.id}>
                <td>{inspection.inspection_number}</td>
                <td>{inspection.title}</td>
                <td>{inspection.distance_meters.toFixed(2)}</td>
                <td>{inspection.status}</td>
                <td>{inspection.priority}</td>
                <td>{inspection.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}