"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

type Store = {
  _id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  visible: boolean;
};

const belgiumCenter: LatLngExpression = [50.8503, 4.3517];

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function MapZoomTo({ position }: { position: LatLngExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 13, { animate: true });
  }, [position, map]);
  return null;
}

export default function MapInner({
  stores,
  nearest,
}: {
  stores: Store[];
  nearest: Store | null;
}) {
  return (
    <div
      style={{
        height: 420,
        width: '100%',
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid #ccc",
      }}
    >
      <MapContainer
        center={belgiumCenter}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {stores.map((store) => (
          <Marker key={store._id} position={[store.lat, store.lng]}>
            <Popup>
              <strong>{store.name}</strong>
              <br />
              {store.address}
              <br />
              {store.postalCode} {store.city}
            </Popup>
          </Marker>
        ))}

        <MapZoomTo position={nearest ? [nearest.lat, nearest.lng] : null} />
      </MapContainer>
    </div>
  );
}
