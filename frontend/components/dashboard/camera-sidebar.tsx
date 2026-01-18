"use client";

import { Folder, Video, LayoutGrid } from "lucide-react";
import type { Camera } from "@/lib/cameras";

interface CameraSidebarProps {
  cameras: Camera[];
  activeCameraId: string | null;
  onSelectCamera: (cameraId: string | null) => void;
}

export default function CameraSidebar({
  cameras,
  activeCameraId,
  onSelectCamera,
}: CameraSidebarProps) {
  return (
    <div className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
          Explorer
        </h2>

        <button
          onClick={() => onSelectCamera(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition
            ${
              activeCameraId === null
                ? "bg-neutral-900 text-white border-l-2 border-red-600"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
        >
          <LayoutGrid className="w-4 h-4" />
          View All Feeds
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-2 flex items-center gap-2 text-neutral-500 text-xs px-2">
          <Folder className="w-3 h-3" />
          CAMERAS
        </div>

        <div className="space-y-1">
          {cameras.map((camera) => (
            <button
              key={camera.id}
              onClick={() => onSelectCamera(camera.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition truncate
                ${
                  activeCameraId === camera.id
                    ? "bg-neutral-900 text-white border-l-2 border-red-600"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
            >
              <Video className="w-3 h-3 shrink-0" />
              <span className="truncate">{camera.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
