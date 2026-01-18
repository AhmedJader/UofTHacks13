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
      // ✅ reuse existing asset if present
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

      if (!res.ok) {
        console.error("Analyze failed:", await res.text());
        return;
      }

      const data: AnalyzeVideoResponse = await res.json();

      if (data.status !== "success" || !data.analysis_text) {
        console.error("Analysis error:", data.error);
        return;
      }

      // ✅ persist asset if newly created
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
      console.error("Analyze feed failed:", err);
    }
  };

  return (
    <main className="h-screen bg-linear-to-b from-slate-950 to-black text-white flex overflow-hidden font-mono">
      {/* Sidebar */}
      <CameraSidebar
        activeCameraId={activeCameraId}
        onSelectCamera={setActiveCameraId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight">
              Live Surveillance Dashboard
            </h1>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* View Area */}
        <div className="flex-1 overflow-hidden relative">
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
