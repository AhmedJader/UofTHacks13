"use client";

import { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  TransitLayer,
  OverlayView,
} from "@react-google-maps/api";

import { Camera, CAMERAS } from "@/lib/cameras";

type Severity = "high" | "medium" | "low";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const DEFAULT_CENTER = {
  lat: 43.6532,
  lng: -79.3832,
};

const severityStyles: Record<Severity, string> = {
  high: "bg-red-600 text-white",
  medium: "bg-yellow-500 text-black",
  low: "bg-green-600 text-white",
};

const severityDot: Record<Severity, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-400",
  low: "bg-green-500",
};

/**
 * ✅ RESTORED + MERGED DARK STYLE
 * Transit + roads + labels all visible
 */
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#020617" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9ca3af" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#020617" }] },

  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca3af" }],
  },

  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#020617" }],
  },

  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },

  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#38bdf8" }, { weight: 0.5 }],
  },

  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
];

/**
 * Absolute pan with vertical offset (NO cumulative drift)
 */
function panToWithOffset(
  map: google.maps.Map,
  latLng: google.maps.LatLngLiteral,
  offsetY: number
) {
  const projection = map.getProjection();
  if (!projection) return;

  const point = projection.fromLatLngToPoint(
    new google.maps.LatLng(latLng.lat, latLng.lng)
  );
  if (!point) return;

  const zoom = map.getZoom();
  if (zoom == null) return;

  const scale = Math.pow(2, zoom);

  const worldPoint = new google.maps.Point(
    point.x,
    point.y - offsetY / scale
  );

  const newCenter = projection.fromPointToLatLng(worldPoint);
  if (!newCenter) return;

  map.panTo(newCenter);
}

function IncidentMarker({
  camera,
  active,
  onClick,
}: {
  camera: Camera;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <OverlayView
      position={{ lat: camera.lat, lng: camera.lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="
          relative -translate-x-1/2 -translate-y-1/2
          w-14 h-14 flex items-center justify-center
          cursor-pointer select-none
        "
      >
        <span
          className={`
            absolute w-9 h-9 rounded-full
            ${severityDot[camera.severity]}
            opacity-70 animate-pulse
          `}
        />

        <span
          className={`
            relative w-6 h-6 rounded-full
            ${severityDot[camera.severity]}
            border border-black/40
            transition-transform duration-200
            ${active ? "scale-125" : "scale-100"}
          `}
        />
      </div>
    </OverlayView>
  );
}

export default function CrimeMap() {
  const [activeCamera, setActiveCamera] = useState<Camera | null>(null);

  // 🔥 AI analysis state
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);

  // 🔥 Fetch Gemini analysis when camera changes
  useEffect(() => {
    if (!activeCamera) return;

    setLoadingAnalysis(true);
    setAnalysis(null);

    fetch(`/api/analyze-video?src=${activeCamera.src}`)
      .then((res) => res.json())
      .then((data) => {
        setAnalysis(data.analysis);
      })
      .catch(() => {
        setAnalysis("Analysis failed.");
      })
      .finally(() => {
        setLoadingAnalysis(false);
      });
  }, [activeCamera]);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={DEFAULT_CENTER}
        zoom={13}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: darkMapStyle,
        }}
      >
        <TransitLayer />

        {CAMERAS.map((camera) => (
          <IncidentMarker
            key={camera.id}
            camera={camera}
            active={activeCamera?.id === camera.id}
            onClick={() => {
              if (activeCamera?.id === camera.id) return;

              setActiveCamera(camera);

              if (!mapRef.current) return;

              requestAnimationFrame(() => {
                panToWithOffset(
                  mapRef.current!,
                  { lat: camera.lat, lng: camera.lng },
                  240
                );
              });
            }}
          />
        ))}

        {activeCamera && (
          <InfoWindow
            position={{
              lat: activeCamera.lat,
              lng: activeCamera.lng,
            }}
            onCloseClick={() => setActiveCamera(null)}
            options={{ disableAutoPan: true }}
          >
            <div className="w-[420px] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  {activeCamera.name}
                </h3>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${severityStyles[activeCamera.severity]}`}
                >
                  {activeCamera.severity}
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {activeCamera.location}
              </p>

              <video
                key={activeCamera.id}
                src={activeCamera.src}
                autoPlay
                controls
                muted
                playsInline
                className="w-full rounded-md"
              />

              <div className="rounded-md bg-slate-900 border border-slate-700 p-2 text-xs text-slate-300 space-y-1 min-h-[80px]">
                {loadingAnalysis && (
                  <span className="text-slate-400">Analyzing footage…</span>
                )}

                {!loadingAnalysis &&
                  analysis?.split("\n").map((line, i) => (
                    <div key={i} className="leading-snug">
                      {line}
                    </div>
                  ))}
              </div>

            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
