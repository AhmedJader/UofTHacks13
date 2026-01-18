"use client";

import { useState, useRef } from "react";
import type { Camera } from "@/lib/cameras";
import type { CameraAnalysis } from "./camera-grid";
import { Button } from "@/components/ui/button";
import { MapPin, Video, AlertTriangle } from "lucide-react";
import PoseOverlayMulti from "../PoseOverlayMulti";

interface CameraSpotlightProps {
  cameras: Camera[];
  cameraId: string;
  analyses: CameraAnalysis[];
  onAnalyze: (cameraId: string) => Promise<void>;
}

export default function CameraSpotlight({
  cameras,
  cameraId,
  analyses,
  onAnalyze,
}: CameraSpotlightProps) {
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const camera = cameras.find((c) => c.id === cameraId);
  const cameraAnalyses = analyses.filter((a) => a.cameraId === cameraId);

  if (!camera) return null;

  const runAnalysis = async () => {
    setLoading(true);
    await onAnalyze(cameraId);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 bg-black border-b border-neutral-800 flex justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-neutral-400" />
            <h1 className="text-xl font-bold">{camera.name}</h1>
          </div>
          <div className="flex items-center gap-2 text-neutral-500 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            {camera.location}
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/40 border border-red-900/60 rounded-full">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="text-xs font-bold text-red-400 tracking-widest">
            LIVE
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video bg-black border border-neutral-800 rounded-xl overflow-hidden relative">
              <video
                ref={videoRef}
                src={camera.src}
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
              <PoseOverlayMulti
                videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                cameraId={cameraId}
              />
            </div>

            <div className="flex items-center justify-between bg-neutral-950 border border-neutral-800 rounded-lg p-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-300">
                  Context Analysis
                </h3>
                <p className="text-xs text-neutral-500">
                  Run semantic analysis on this feed
                </p>
              </div>
              <Button
                onClick={runAnalysis}
                disabled={loading}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700"
              >
                {loading ? "Analyzing…" : "Analyze Feed"}
              </Button>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col h-[600px]">
            <div className="p-4 border-b border-neutral-800">
              <h3 className="text-sm font-semibold">Activity Log</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cameraAnalyses.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                  <AlertTriangle className="w-8 h-8 opacity-20" />
                  <p className="text-sm">No analysis records</p>
                </div>
              ) : (
                cameraAnalyses.map((a, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-sm ${
                      a.flagged
                        ? "bg-red-950/30 border-red-900/60 text-red-300"
                        : "bg-neutral-900 border-neutral-800 text-neutral-300"
                    }`}
                  >
                    <div className="flex justify-between mb-2 text-xs text-neutral-500">
                      <span>{new Date(a.timestamp).toLocaleTimeString()}</span>
                      {a.flagged && (
                        <span className="text-red-400 font-bold">FLAGGED</span>
                      )}
                    </div>
                    {a.analysis}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
