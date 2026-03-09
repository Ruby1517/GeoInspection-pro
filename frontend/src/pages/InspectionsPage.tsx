import { useEffect, useState } from "react";
import { getInspections } from "../api/inspections";
import { InspectionsMap } from "../components/InspectionsMap";
import { Navbar } from "../components/Navbar";
import type { Inspection } from "../types/inspection";
import { Link } from "react-router-dom";

export function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInspections() {
      try {
        const data = await getInspections();
        setInspections(data);
      } catch {
        setError("Failed to load inspections.");
      }
    }

    loadInspections();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>Inspections</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginBottom: "1.5rem" }}>
          <InspectionsMap inspections={inspections} />
        </div>

        <table cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th align="left">Inspection #</th>
              <th align="left">Title</th>
              <th align="left">Status</th>
              <th align="left">Priority</th>
              <th align="left">Category ID</th>
              <th align="left">Latitude</th>
              <th align="left">Longitude</th>
              <th align="left">Address</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <tr key={inspection.id}>
                <td>{inspection.inspection_number}</td>
                <td>{inspection.title}</td>
                <td>{inspection.status}</td>
                <td>{inspection.priority}</td>
                <td>{inspection.category_id}</td>
                <td>{inspection.latitude}</td>
                <td>{inspection.longitude}</td>
                <td>{inspection.address}</td>
                <td>
                  <Link to={`/inspections/${inspection.id}`}>
                    {inspection.inspection_number}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}