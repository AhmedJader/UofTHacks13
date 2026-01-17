"use client";

import { useState, useEffect } from "react";
import { Alert } from "@/types/types";

const DUMMY_CAMERAS = [
  { id: "cam-1", name: "Entrance", location: "Front Door" },
  { id: "cam-2", name: "Lobby", location: "Main Lobby" },
  { id: "cam-3", name: "Parking Lot A", location: "North Lot" },
  { id: "cam-4", name: "Parking Lot B", location: "South Lot" },
  { id: "cam-5", name: "Back Alley", location: "Rear Exit" },
  { id: "cam-6", name: "Office Floor", location: "2nd Floor" },
];

interface CameraAnalysisResponse {
  cameraId: string;
  alert: boolean;
}

interface CameraGridProps {
  alerts: Alert[];
  onCameraClick: (cameraId: string) => void;
  onAddAlert: (cameraId: string, cameraName: string) => void;
  selectedCameraId: string | null;
}

export default function CameraGrid({
  alerts,
  onCameraClick,
  onAddAlert,
  selectedCameraId,
}: CameraGridProps) {
  const [selectedCamera, setSelectedCamera] = useState<Set<string>>(
    new Set(["cam-1"]),
  );
  const [cameraAnalysis, setCameraAnalysis] = useState<
    Record<string, CameraAnalysisResponse>
  >({});
  const [previousAnalysis, setPreviousAnalysis] = useState<
    Record<string, CameraAnalysisResponse>
  >({});

  const fetchCameraAnalysis = async () => {
    try {
      // TODO: Replace this with actual TwelveLabs API call
      // const response = await fetch('/api/analyze-cameras');
      // const data = await response.json();
      // setCameraAnalysis(data);

      const fakeResponse: Record<string, CameraAnalysisResponse> = {};
      DUMMY_CAMERAS.forEach((camera) => {
        fakeResponse[camera.id] = {
          cameraId: camera.id,
          alert: Math.random() > 0.7,
        };
      });

      fakeResponse &&
        Object.entries(fakeResponse).forEach(([cameraId, analysis]) => {
          const previousHadAlert = previousAnalysis[cameraId]?.alert || false;
          const nowHasAlert = analysis.alert;

          // If the camera just detected an alert (wasn't detecting before)
          if (nowHasAlert && !previousHadAlert) {
            const camera = DUMMY_CAMERAS.find((c) => c.id === cameraId);
            if (camera) {
              onAddAlert(camera.id, camera.name);
            }
          }
        });

      setPreviousAnalysis(fakeResponse);
      setCameraAnalysis(fakeResponse);
    } catch (error) {
      console.error("Failed to fetch camera analysis:", error);
    }
  };

  useEffect(() => {
    fetchCameraAnalysis();

    const interval = setInterval(fetchCameraAnalysis, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {DUMMY_CAMERAS.map((camera) => {
          const hasApiAlert = cameraAnalysis[camera.id]?.alert || false;

          console.log("Camera:", camera.id, "API Alert:", hasApiAlert);

          return (
            <div
              key={camera.id}
              onClick={() => onCameraClick(camera.id)}
              className={`group relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                camera.id === selectedCameraId
                  ? "ring-2 ring-blue-500"
                  : "ring-1 ring-slate-700 hover:ring-slate-400"
              } ${hasApiAlert ? "bg-slate-800" : "bg-slate-900 opacity-50"}`}
            >
              <div className="w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center relative">
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-500 font-mono">LIVE</span>
                </div>
                <span
                  className={`text-sm ${hasApiAlert ? "text-slate-500" : "text-slate-600"}`}
                >
                  {camera.name}
                </span>
              </div>

              <div className="p-3 bg-slate-900 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-white">
                  {camera.name}
                </h3>
                <p
                  className={`text-xs ${hasApiAlert ? "text-red-400" : "text-slate-400"}`}
                >
                  {camera.location}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
