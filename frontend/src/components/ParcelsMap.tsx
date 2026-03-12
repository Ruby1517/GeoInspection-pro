import { MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import type { Inspection } from "../types/inspection";
import type { Parcel } from "../types/parcel";
import { parsePolygonWkt } from "../utils/wkt";

type Props = {
  parcels: Parcel[];
  inspections: Inspection[];
};

export function ParcelsMap({ parcels, inspections }: Props) {
  return (
    <MapContainer
      center={[36.7378, -119.7871]}
      zoom={14}
      style={{ height: "500px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {parcels.map((parcel) => (
        <Polygon key={parcel.id} positions={parsePolygonWkt(parcel.boundary_wkt)}>
          <Popup>
            <div>
              <strong>APN: {parcel.apn}</strong>
              <div>Zoning: {parcel.zoning_code}</div>
              <div>Owner: {parcel.owner_name}</div>
              <div>{parcel.address}</div>
            </div>
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
              <div>
                <strong>{inspection.inspection_number}</strong>
                <div>{inspection.title}</div>
                <div>Parcel ID: {inspection.parcel_id ?? "None"}</div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
