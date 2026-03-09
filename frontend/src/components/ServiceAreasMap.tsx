import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import type { Inspection } from "../types/inspection";
import type { ServiceArea } from "../types/serviceArea";
import { parsePolygonWkt } from "../utils/wkt";

type Props = {
  serviceAreas: ServiceArea[];
  inspections: Inspection[];
};

export function ServiceAreasMap({ serviceAreas, inspections }: Props) {
  return (
    <MapContainer
      center={[36.7378, -119.7871]}
      zoom={12}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {serviceAreas.map((area) => (
        <Polygon key={area.id} positions={parsePolygonWkt(area.boundary_wkt)}>
          <Popup>
            <strong>{area.name}</strong>
            <div>{area.description}</div>
          </Popup>
        </Polygon>
      ))}

      {inspections.map((inspection) => {
        const lat = Number(inspection.latitude);
        const lng = Number(inspection.longitude);

        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

        return (
          <Marker key={inspection.id} position={[lat, lng]}>
            <Popup>
              <strong>{inspection.inspection_number}</strong>
              <div>{inspection.title}</div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}