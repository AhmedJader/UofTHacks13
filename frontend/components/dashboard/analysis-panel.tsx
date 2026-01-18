"use client";

import { CameraAnalysis } from "./camera-grid";

export default function AnalysisPanel({
  analyses,
  selectedCameraId,
}: {
  analyses: CameraAnalysis[];
  selectedCameraId: string | null;
}) {
  const visible = selectedCameraId
    ? analyses.filter((a) => a.cameraId === selectedCameraId)
    : analyses;

  if (visible.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        No analysis available
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-3 overflow-auto">
      {visible.map((a, i) => (
        <div
          key={i}
          className={`p-3 rounded border ${
            a.flagged
              ? "border-red-600 bg-red-950/40"
              : "border-slate-700 bg-slate-900"
          }`}
        >
          <div className="text-xs text-slate-400 mb-1">
            {a.cameraId} · {new Date(a.timestamp).toLocaleTimeString()}
          </div>
          <div className="text-sm text-slate-200">{a.analysis}</div>
        </div>
      ))}
    </div>
  );
}
