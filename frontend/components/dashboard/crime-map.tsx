"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

type MapZone = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  severity: "high" | "medium" | "low";
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const DEFAULT_CENTER = {
  lat: 43.6532,
  lng: -79.3832,
};

const MOCK_ZONES: MapZone[] = [
  {
    id: "A",
    lat: 43.65107,
    lng: -79.347015,
    label: "Zone A - Alert",
    severity: "high",
  },
  {
    id: "B",
    lat: 43.6629,
    lng: -79.3957,
    label: "Zone B - Active",
    severity: "low",
  },
];

export default function CrimeMap() {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={13}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] },
          ],
        }}
      >
        {MOCK_ZONES.map((zone) => (
          <Marker
            key={zone.id}
            position={{ lat: zone.lat, lng: zone.lng }}
            label={zone.id}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
