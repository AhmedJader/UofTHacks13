"use client";

import { MapPin, Video } from "lucide-react";
import type { Camera } from "@/lib/cameras";

export type CameraAnalysis = {
  cameraId: string;
  analysis: string;
  timestamp: number;
  flagged: boolean;
};

interface CameraGridProps {
  cameras: Camera[];
  analyses: CameraAnalysis[];
  activeCameraId: string | null;
  onSelectCamera: (cameraId: string) => void;
}

export default function CameraGrid({
  cameras,
  analyses,
  activeCameraId,
  onSelectCamera,
}: CameraGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cameras.map((camera) => {
        const latest = analyses
          .filter((a) => a.cameraId === camera.id)
          .sort((a, b) => b.timestamp - a.timestamp)[0];

        return (
          <button
            key={camera.id}
            onClick={() => onSelectCamera(camera.id)}
            className={`rounded-xl overflow-hidden border transition
              ${
                activeCameraId === camera.id
                  ? "border-red-600 ring-1 ring-red-600/40"
                  : "border-neutral-800 hover:border-neutral-600"
              }`}
          >
            <div className="aspect-video bg-black relative">
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/70 px-2 py-1 rounded-md border border-red-900/60">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
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

            <div className="p-3 bg-neutral-950 text-left">
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-4 h-4 text-neutral-400" />
                <h3 className="text-sm font-medium text-white">
                  {camera.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-neutral-500" />
                <p className="text-xs text-neutral-400">
                  {camera.location}
                </p>
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
