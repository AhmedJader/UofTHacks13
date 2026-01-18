"use client";

import { Button } from "@/components/ui/button";
import { CAMERAS } from "@/lib/cameras";
import { getAssetIfExists, insertAssetIntoDbIfNotExists } from "@/app/actions";

export type CameraAnalysis = {
  cameraId: string;
  analysis: string;
  timestamp: number;
  flagged: boolean;
};

interface AnalyzeVideoResponse {
  status: "success" | "error";
  video_id?: string;
  index_id?: string;
  analysis_text?: string;
  error?: string;
}

interface CameraGridProps {
  analyses: CameraAnalysis[];
  selectedCameraId: string | null;
  onCameraClick: (cameraId: string) => void;
  onFullscreen: (cameraId: string) => void;
  onAnalysisComplete: (analysis: CameraAnalysis) => void;
}

export default function CameraGrid({
  analyses,
  selectedCameraId,
  onCameraClick,
  onFullscreen,
  onAnalysisComplete,
}: CameraGridProps) {
  const latestAnalysisByCamera = Object.fromEntries(
    CAMERAS.map((camera) => {
      const latest = analyses
        .filter((a) => a.cameraId === camera.id)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      return [camera.id, latest];
    })
  );

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {CAMERAS.map((camera) => {
          const analysis = latestAnalysisByCamera[camera.id];
          const flagged = analysis?.flagged ?? false;

          return (
            <div
              key={camera.id}
              onClick={() => onCameraClick(camera.id)}
              className={`group relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                camera.id === selectedCameraId
                  ? "ring-2 ring-blue-500"
                  : "ring-1 ring-slate-700 hover:ring-slate-400"
              } ${flagged ? "bg-red-950/40" : "bg-slate-900"}`}
            >
              {/* Video */}
              <div className="w-full aspect-video bg-slate-950 relative">
                <video
                  src={camera.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-500 font-mono font-bold">
                    LIVE
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="p-3 bg-slate-900 border-t border-slate-700 space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  {camera.name}
                </h3>

                <p
                  className={`text-xs ${
                    flagged ? "text-red-400" : "text-slate-400"
                  }`}
                >
                  {flagged ? "Flagged activity detected" : camera.location}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full text-xs"
                  onClick={async (e) => {
                    e.stopPropagation();

                    try {
                      const asset = await getAssetIfExists(camera.src);

                      const res = await fetch(
                        "http://127.0.0.1:8000/api/analyze/video",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            video_source: camera.src,
                            existing_video_id: asset
                              ? asset.videoId
                              : null,
                            interval_seconds: 5,
                            frame_count: 6,
                          }),
                        }
                      );

                      const data: AnalyzeVideoResponse = await res.json();

                      console.log("Analyze response:", data);

                      if (data.status !== "success" || !data.analysis_text) {
                        console.error("Analysis failed:", data.error);
                        return;
                      }

                      await insertAssetIntoDbIfNotExists(
                        camera.src,
                        data.video_id!
                      );

                      onAnalysisComplete({
                        cameraId: camera.id,
                        analysis: data.analysis_text,
                        timestamp: Date.now(),
                        flagged:
                          /violence|weapon|fight|assault|panic|threat/i.test(
                            data.analysis_text
                          ),
                      });
                    } catch (err) {
                      console.error("Analyze feed failed:", err);
                    }
                  }}
                >
                  Analyze Feed
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
