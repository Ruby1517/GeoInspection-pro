import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { Inspection } from "../types/inspection";

type InspectionsMapProps = {
  inspections: Inspection[];
};

const DEFAULT_CENTER: [number, number] = [36.7378, -119.7871];

export function InspectionsMap({ inspections }: InspectionsMapProps) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={12}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {inspections
        .filter((inspection) => inspection.latitude && inspection.longitude)
        .map((inspection) => {
          const lat = Number(inspection.latitude);
          const lng = Number(inspection.longitude);

          if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return null;
          }

          return (
            <Marker key={inspection.id} position={[lat, lng]}>
              <Popup>
                <div>
                  <strong>{inspection.inspection_number}</strong>
                  <div>{inspection.title}</div>
                  <div>Status: {inspection.status}</div>
                  <div>Priority: {inspection.priority}</div>
                  <div>{inspection.address}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}