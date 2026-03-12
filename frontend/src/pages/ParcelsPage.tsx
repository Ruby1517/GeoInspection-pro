import { useEffect, useState } from "react";
import { getInspections } from "../api/inspections";
import { getParcels } from "../api/parcels";
import { Navbar } from "../components/Navbar";
import { ParcelsMap } from "../components/ParcelsMap";
import type { Inspection } from "../types/inspection";
import type { Parcel } from "../types/parcel";

export function ParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [parcelData, inspectionData] = await Promise.all([
          getParcels(),
          getInspections(),
        ]);

        setParcels(parcelData);
        setInspections(inspectionData);
      } catch {
        setError("Failed to load parcels or inspections.");
      }
    }

    loadData();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>Parcels</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginBottom: "1.5rem" }}>
          <ParcelsMap parcels={parcels} inspections={inspections} />
        </div>

        <table cellPadding={10} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th align="left">APN</th>
              <th align="left">Zoning</th>
              <th align="left">Owner</th>
              <th align="left">Address</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel.id}>
                <td>{parcel.apn}</td>
                <td>{parcel.zoning_code}</td>
                <td>{parcel.owner_name}</td>
                <td>{parcel.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
