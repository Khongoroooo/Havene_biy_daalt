// src/app/ul-hudluh/[id]/_MapViewer.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Marker icon тохируулга
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

type Props = {
  latitude: number;
  longitude: number;
  locationText?: string;
  zoom?: number;
};

export default function MapViewer({ 
  latitude, 
  longitude, 
  locationText, 
  zoom = 15 
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Газрын зураг ачааллаж байна...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      scrollWheelZoom={false}
      dragging={true}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        {locationText && (
          <Popup>
            <div className="text-sm">
              <strong>Байршил:</strong><br />
              {locationText}<br />
              <span className="text-xs text-gray-500">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </span>
            </div>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
}