import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

type Props = {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
};

function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
}

export function EditableInspectionMap({ latitude, longitude, onLocationChange }: Props) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={14}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onLocationChange={onLocationChange} />
      <Marker position={[latitude, longitude]} />
    </MapContainer>
  );
}