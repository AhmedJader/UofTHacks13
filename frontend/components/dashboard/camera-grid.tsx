"use client";

import { CAMERAS } from "@/lib/cameras";

export type CameraAnalysis = {
  cameraId: string;
  analysis: string;
  timestamp: number;
  flagged: boolean;
};

interface CameraGridProps {
  analyses: CameraAnalysis[];
  activeCameraId: string | null;
  onSelectCamera: (cameraId: string) => void;
}

export default function CameraGrid({
  analyses,
  activeCameraId,
  onSelectCamera,
}: CameraGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {CAMERAS.map((camera) => {
        const latest = analyses
          .filter((a) => a.cameraId === camera.id)
          .sort((a, b) => b.timestamp - a.timestamp)[0];

        return (
          <button
            key={camera.id}
            onClick={() => onSelectCamera(camera.id)}
            className={`
              group rounded-xl overflow-hidden border transition
              ${
                activeCameraId === camera.id
                  ? "border-blue-500 ring-2 ring-blue-500/40"
                  : "border-slate-800 hover:border-slate-600"
              }
            `}
          >
            <div className="aspect-video bg-black">
              <video
                src={camera.src}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 bg-slate-950 text-left">
              <h3 className="text-sm font-medium">{camera.name}</h3>
              <p className="text-xs text-slate-400">{camera.location}</p>

              {latest?.flagged && (
                <p className="text-xs text-red-400 mt-1">
                  Flagged activity detected
                </p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
