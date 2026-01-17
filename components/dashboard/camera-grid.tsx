"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";

const DUMMY_CAMERAS = [
  { id: "cam-1", name: "Entrance", location: "Front Door" },
  { id: "cam-2", name: "Lobby", location: "Main Lobby" },
  { id: "cam-3", name: "Parking Lot A", location: "North Lot" },
  { id: "cam-4", name: "Parking Lot B", location: "South Lot" },
  { id: "cam-5", name: "Back Alley", location: "Rear Exit" },
  { id: "cam-6", name: "Office Floor", location: "2nd Floor" },
];

interface CameraGridProps {
  onCameraClick: (cameraId: string) => void;
  onAddAlert: (cameraId: string, cameraName: string) => void;
  selectedCameraId: string | null;
}

export default function CameraGrid({
  onCameraClick,
  onAddAlert,
  selectedCameraId,
}: CameraGridProps) {
  const [activeCameras, setActiveCameras] = useState<Set<string>>(
    new Set(["cam-1"]),
  );

  const toggleCamera = (cameraId: string) => {
    const newSet = new Set(activeCameras);
    if (newSet.has(cameraId)) {
      newSet.delete(cameraId);
    } else {
      newSet.add(cameraId);
    }
    setActiveCameras(newSet);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {DUMMY_CAMERAS.map((camera) => {
          const isActive = activeCameras.has(camera.id);
          const isSelected = selectedCameraId === camera.id;

          return (
            <div
              key={camera.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all transform ${
                isSelected
                  ? "ring-2 ring-blue-500 scale-105"
                  : "ring-1 ring-slate-700"
              } ${isActive ? "bg-slate-800 hover:ring-slate-600" : "bg-slate-900 opacity-50"}`}
              onClick={() => {
                toggleCamera(camera.id);
                if (isActive) {
                  onCameraClick(camera.id);
                }
              }}
            >
              <div className="w-full aspect-video bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center relative">
                {isActive && (
                  <>
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-red-500 font-mono">
                        LIVE
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">
                      {camera.name}
                    </span>
                  </>
                )}
                {!isActive && (
                  <span className="text-slate-600 text-sm">Offline</span>
                )}
              </div>

              <div className="p-3 bg-slate-900 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-white">
                  {camera.name}
                </h3>
                <p className="text-xs text-slate-400">{camera.location}</p>
              </div>

              {isActive && (
                <div className="p-2 bg-slate-800 border-t border-slate-700 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddAlert(camera.id, camera.name);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-900/50 hover:bg-red-900 text-red-300 text-xs py-1 rounded px-2 transition-colors"
                  >
                    <AlertCircle size={14} />
                    Alert
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
