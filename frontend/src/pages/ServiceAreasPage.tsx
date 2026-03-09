import { useEffect, useState } from "react";
import { getInspectionsInServiceArea, getServiceAreas } from "../api/serviceAreas";
import { Navbar } from "../components/Navbar";
import { ServiceAreasMap } from "../components/ServiceAreasMap";
import type { Inspection } from "../types/inspection";
import type { ServiceArea } from "../types/serviceArea";

export function ServiceAreasPage() {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<number | "">("");
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAreas() {
      try {
        const data = await getServiceAreas();
        setServiceAreas(data);
        if (data.length > 0) {
          setSelectedAreaId(data[0].id);
        }
      } catch {
        setError("Failed to load service areas.");
      }
    }

    loadAreas();
  }, []);

  async function handleLoadInspections() {
    if (selectedAreaId === "") return;

    try {
      const data = await getInspectionsInServiceArea(Number(selectedAreaId));
      setInspections(data);
      setError("");
    } catch {
      setError("Failed to load inspections for service area.");
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>Service Areas</h1>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(Number(e.target.value))}
          >
            {serviceAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>

          <button onClick={handleLoadInspections}>Load Inspections in Area</button>
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ServiceAreasMap serviceAreas={serviceAreas} inspections={inspections} />

        <ul style={{ marginTop: "1rem" }}>
          {inspections.map((inspection) => (
            <li key={inspection.id}>
              {inspection.inspection_number} — {inspection.title}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}