"use client";

import { useState } from "react";
import CameraGrid, {
  CameraAnalysis,
} from "@/components/dashboard/camera-grid";
import AnalysisPanel from "@/components/dashboard/analysis-panel";

export default function DashboardPage() {
  const [analyses, setAnalyses] = useState<CameraAnalysis[]>([]);
  const [selectedCameraId, setSelectedCameraId] =
    useState<string | null>(null);
  const [fullscreenCameraId, setFullscreenCameraId] =
    useState<string | null>(null);

  const handleNewAnalysis = (analysis: CameraAnalysis) => {
    setAnalyses((prev) => [analysis, ...prev]);
  };

  if (fullscreenCameraId) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center relative">
        <button
          onClick={() => setFullscreenCameraId(null)}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Exit Fullscreen
        </button>

        <div className="w-[720px] h-[480px] bg-gray-900 flex items-center justify-center">
          Camera Feed — {fullscreenCameraId}
        </div>
      </div>
    );
  }

  return (
    <main className="w-full h-screen bg-slate-950 flex">
      <div className="w-3/4 border-r border-slate-800">
        <CameraGrid
          analyses={analyses}
          selectedCameraId={selectedCameraId}
          onCameraClick={setSelectedCameraId}
          onFullscreen={setFullscreenCameraId}
          onAnalysisComplete={handleNewAnalysis}
        />
      </div>

      <div className="w-1/4">
        <AnalysisPanel
          analyses={analyses}
          selectedCameraId={selectedCameraId}
        />
      </div>
    </main>
  );
}
