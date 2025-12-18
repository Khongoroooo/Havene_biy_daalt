// src/app/ul-hudluh/create/_LocationPicker.tsx
"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LeafletMouseEvent } from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Ensure marker images are available under /public (see README below)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

type Props = {
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
  onSelect: (lat: number, lng: number) => void;
};

function ClickHandler({ onSelect, initialLat, initialLng }: any) {
  const [pos, setPos] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e: LeafletMouseEvent) {
      setPos([e.latlng.lat, e.latlng.lng]);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    if (initialLat && initialLng) setPos([initialLat, initialLng]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return pos ? <Marker position={pos} /> : null;
}

export default function LocationPicker({ initialLat = 47.9186, initialLng = 106.9170, initialZoom = 12, onSelect }: Props) {
  return (
    <MapContainer center={[initialLat, initialLng]} zoom={initialZoom} style={{ height: "100%", width: "100%" }}>
      <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickHandler onSelect={onSelect} initialLat={initialLat} initialLng={initialLng} />
    </MapContainer>
  );
}
