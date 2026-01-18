"use client";

import { CAMERAS } from "@/lib/cameras";
import { MapPin, Video } from "lucide-react";

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
              ${activeCameraId === camera.id
                ? "border-blue-500 ring-2 ring-blue-500/40"
                : "border-slate-800 hover:border-slate-600"
              }
            `}
          >
            <div className="aspect-video bg-black relative">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                <span className="text-[10px] font-bold text-red-500 tracking-widest">
                  LIVE
                </span>
              </div>
              <video
                src={camera.src}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 bg-slate-950 text-left">
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-medium">{camera.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-slate-500" />
                <p className="text-xs text-slate-400">{camera.location}</p>
              </div>

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
