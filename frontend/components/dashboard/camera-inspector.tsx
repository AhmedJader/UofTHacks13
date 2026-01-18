"use client";

import { useEffect, useCallback, useState } from "react";
import { CAMERAS } from "@/lib/cameras";
import { CameraAnalysis } from "./camera-grid";
import { Button } from "@/components/ui/button";
import { MapPin, Video } from "lucide-react";

export default function CameraInspector({
  cameraId,
  analyses,
  onAnalyze,
  onClose,
}: {
  cameraId: string | null;
  analyses: CameraAnalysis[];
  onAnalyze: (cameraId: string) => Promise<void>;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && cameraId && !loading) {
        onClose();
      }
    },
    [cameraId, loading, onClose]
  );

  useEffect(() => {
    if (!cameraId) return;
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc, cameraId]);

  if (!cameraId) return null;

  const camera = CAMERAS.find((c) => c.id === cameraId)!;
  const cameraAnalyses = analyses.filter((a) => a.cameraId === cameraId);

  const runAnalysis = async () => {
    setLoading(true);
    await onAnalyze(cameraId);
    setLoading(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-3xl rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Video className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-semibold">{camera.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-slate-500" />
                <p className="text-xs text-slate-400">{camera.location}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-white disabled:opacity-40"
            >
              ✕
            </button>
          </div>

          {/* Video */}
          <div className="aspect-video bg-black relative">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
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

          {/* Actions */}
          <div className="px-5 py-4 border-b border-slate-800">
            <Button
              className="w-full"
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? "Analyzing…" : "Analyze Feed"}
            </Button>
          </div>

          {/* Analysis */}
          <div className="px-5 py-4 max-h-[280px] overflow-y-auto space-y-3">
            {cameraAnalyses.length === 0 ? (
              <p className="text-sm text-slate-500">
                No analysis yet for this camera.
              </p>
            ) : (
              cameraAnalyses.map((a, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 text-sm border ${a.flagged
                    ? "border-red-600 bg-red-950/40"
                    : "border-slate-700 bg-slate-900"
                    }`}
                >
                  <div className="text-xs text-slate-400 mb-1">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </div>
                  {a.analysis}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
