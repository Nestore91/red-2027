"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const defaultCenter: [number, number] = [23.2494, -106.4111]; // Mazatlán

// Fix icon paths for Next
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function DraggableMarker({ lat, lon, onChange }: any) {
  const position: [number, number] = [
    lat ?? defaultCenter[0],
    lon ?? defaultCenter[1],
  ];

  const map = useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const m = e.target;
          const p = m.getLatLng();
          onChange(p.lat, p.lng);
          map.panTo(p);
        },
      }}
    />
  );
}

export default function LeafletMapInner({ lat, lon, onChange }: any) {
  const center: [number, number] = lat && lon ? [lat, lon] : defaultCenter;

  return (
    <div className="h-52 rounded-xl overflow-hidden border">
      <MapContainer center={center} zoom={13} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker lat={lat} lon={lon} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
