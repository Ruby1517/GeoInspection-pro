import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

type LocationPickerMapProps = {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
};

function LocationSelector({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onLocationSelect(lat, lng);
    },
  });

  return null;
}

export function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
}: LocationPickerMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationSelector onLocationSelect={onLocationSelect} />
      <Marker position={[latitude, longitude]} />
    </MapContainer>
  );
}