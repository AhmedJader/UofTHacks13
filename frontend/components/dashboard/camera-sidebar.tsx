"use client";

import { CAMERAS } from "@/lib/cameras";
import { Folder, Video, LayoutGrid } from "lucide-react";

interface CameraSidebarProps {
    activeCameraId: string | null;
    onSelectCamera: (cameraId: string | null) => void;
}

export default function CameraSidebar({
    activeCameraId,
    onSelectCamera,
}: CameraSidebarProps) {
    return (
        <div className="w-64 border-r border-slate-800 bg-slate-950/50 flex flex-col h-full">
            <div className="p-4 border-b border-slate-800">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Explorer
                </h2>

                <button
                    onClick={() => onSelectCamera(null)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${activeCameraId === null
                            ? "bg-blue-600/20 text-blue-400"
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                        }`}
                >
                    <LayoutGrid className="w-4 h-4" />
                    <span>View All Feeds</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500 text-xs font-medium px-2">
                    <Folder className="w-3 h-3" />
                    <span>CAMERAS</span>
                </div>

                <div className="space-y-1">
                    {CAMERAS.map((camera) => (
                        <button
                            key={camera.id}
                            onClick={() => onSelectCamera(camera.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left truncate ${activeCameraId === camera.id
                                    ? "bg-blue-600/20 text-blue-400 border-l-2 border-blue-500"
                                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border-l-2 border-transparent"
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
