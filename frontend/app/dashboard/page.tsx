"use client";

import { useState } from "react";
import CameraGrid, { CameraAnalysis } from "@/components/dashboard/camera-grid";
import CameraSidebar from "@/components/dashboard/camera-sidebar";
import CameraSpotlight from "@/components/dashboard/camera-spotlight";
import { CAMERAS } from "@/lib/cameras";
import {
  getAssetIfExists,
  insertAssetIntoDbIfNotExists,
} from "@/app/actions";

interface AnalyzeVideoResponse {
  status: "success" | "error";
  video_id?: string;
  analysis_text?: string;
  error?: string;
}

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<CameraAnalysis[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);

  const handleAnalyzeCamera = async (cameraId: string) => {
    const camera = CAMERAS.find((c) => c.id === cameraId);
    if (!camera) return;

    try {
      const asset = await getAssetIfExists(camera.src);

      const res = await fetch("http://127.0.0.1:8000/api/analyze/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_source: camera.src,
          existing_video_id: asset ? asset.videoId : null,
          interval_seconds: 5,
          frame_count: 6,
        }),
      });

      if (!res.ok) return;

      const data: AnalyzeVideoResponse = await res.json();
      if (data.status !== "success" || !data.analysis_text) return;

      if (data.video_id && !asset) {
        await insertAssetIntoDbIfNotExists(camera.src, data.video_id);
      }

      setAnalyses((prev) => [
        {
          cameraId,
          analysis: data.analysis_text!,
          timestamp: Date.now(),
          flagged: /violence|weapon|fight|assault|panic|threat/i.test(
            data.analysis_text!
          ),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="h-screen bg-black text-white flex overflow-hidden font-mono">
      <CameraSidebar
        activeCameraId={activeCameraId}
        onSelectCamera={setActiveCameraId}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 bg-black border-b border-neutral-800">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">
              Live Surveillance Dashboard
            </h1>
            <span className="text-xs text-neutral-500">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeCameraId ? (
            <CameraSpotlight
              cameraId={activeCameraId}
              analyses={analyses}
              onAnalyze={handleAnalyzeCamera}
            />
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <CameraGrid
                analyses={analyses}
                activeCameraId={null}
                onSelectCamera={setActiveCameraId}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
