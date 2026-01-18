"use client";

import { Camera, CAMERAS } from "@/lib/cameras";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

import { useState } from "react";

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

// const MOCK_ZONES: MapZone[] = [
//   {
//     id: "A",
//     lat: 43.65107,
//     lng: -79.347015,
//     label: "Zone A - Alert",
//     severity: "high",
//   },
//   {
//     id: "B",
//     lat: 43.6629,
//     lng: -79.3957,
//     label: "Zone B - Active",
//     severity: "low",
//   },
// ];

const severityStyles = {
  high: "bg-red-600 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-green-600 text-white",
};


const darkMapStyle = [
  /* Base map */
  { elementType: "geometry", stylers: [{ color: "#020617" }] }, // slate-950

  /* Text colors (keep labels readable) */
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }], // slate-400
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#020617" }], // blend into bg
  },

  /* Roads */
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }], // slate-800
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },

  /* Water */
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#020617" }],
  },

  /* Hide POIs completely */
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },

  /* Hide transit clutter */
  { featureType: "transit", stylers: [{ visibility: "off" }] },

  /* Hide admin boundaries but keep city name */
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
];


export default function CrimeMap() {
  const [activeCamera, setActiveCamera] = useState<Camera | null>(null);
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={13}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: darkMapStyle,
        }}
      >
      {CAMERAS.map((camera) => (
          <Marker
            key={camera.id}
            position={{ lat: camera.lat, lng: camera.lng }}
            icon={{
              url:
                camera.severity === "high"
                  ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  : camera.severity === "medium"
                  ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                  : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            }}
            onClick={() => setActiveCamera(camera)}
          />
        ))}

        {activeCamera && (
          <InfoWindow
            position={{ lat: activeCamera.lat, lng: activeCamera.lng }}
            onCloseClick={() => setActiveCamera(null)}
          >
            <div className="w-80"> {/* was w-64 */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">
                  {activeCamera.name}
                </h3>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${severityStyles[activeCamera.severity]}`}
                >
                  {activeCamera.severity}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-2">
                {activeCamera.location}
              </p>

              <video
                src={activeCamera.src}
                autoPlay
                controls
                muted
                className="w-full rounded-md"
              />
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
