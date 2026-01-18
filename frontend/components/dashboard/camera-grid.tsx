"use client";

import { useState, useEffect } from "react";
import { Alert } from "@/types/types";
import { Button } from "@/components/ui/button";
import { CAMERAS } from "@/lib/cameras";
import { getAssetIfExists, insertAssetIntoDbIfNotExists } from "@/app/actions";
interface CameraAnalysisResponse {
  cameraId: string;
  alert: boolean;
}

interface CameraGridProps {
  alerts: Alert[];
  onCameraClick: (cameraId: string) => void;
  onAddAlert: (cameraId: string, cameraName: string) => void;
  selectedCameraId: string | null;
}

export default function CameraGrid({
  alerts,
  onCameraClick,
  onAddAlert,
  selectedCameraId,
}: CameraGridProps) {
  const [selectedCamera, setSelectedCamera] = useState<Set<string>>(
    new Set(["cam-1"]),
  );
  const [cameraAnalysis, setCameraAnalysis] = useState<
    Record<string, CameraAnalysisResponse>
  >({});
  const [previousAnalysis, setPreviousAnalysis] = useState<
    Record<string, CameraAnalysisResponse>
  >({});

  const fetchCameraAnalysis = async () => {
    try {
      // TODO: Replace this with actual TwelveLabs API call
      // const response = await fetch('/api/analyze-cameras');
      // const data = await response.json();
      // setCameraAnalysis(data);

      const fakeResponse: Record<string, CameraAnalysisResponse> = {};
      CAMERAS.forEach((camera) => {
        fakeResponse[camera.id] = {
          cameraId: camera.id,
          alert: Math.random() > 0.7,
        };
      });

      fakeResponse &&
        Object.entries(fakeResponse).forEach(([cameraId, analysis]) => {
          const previousHadAlert = previousAnalysis[cameraId]?.alert || false;
          const nowHasAlert = analysis.alert;

          // If the camera just detected an alert (wasn't detecting before)
          if (nowHasAlert && !previousHadAlert) {
            const camera = CAMERAS.find((c) => c.id === cameraId);
            if (camera) {
              onAddAlert(camera.id, camera.name);
            }
          }
        });

      setPreviousAnalysis(fakeResponse);
      setCameraAnalysis(fakeResponse);
    } catch (error) {
      console.error("Failed to fetch camera analysis:", error);
    }
  };

  useEffect(() => {
    fetchCameraAnalysis();

    const interval = setInterval(fetchCameraAnalysis, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {CAMERAS.map((camera) => {
          const hasApiAlert = cameraAnalysis[camera.id]?.alert || false;

          return (
            <div
              key={camera.id}
              onClick={() => onCameraClick(camera.id)}
              className={`group relative rounded-lg overflow-hidden cursor-pointer transition-all ${
                camera.id === selectedCameraId
                  ? "ring-2 ring-blue-500"
                  : "ring-1 ring-slate-700 hover:ring-slate-400"
              } ${hasApiAlert ? "bg-slate-800" : "bg-slate-900 opacity-50"}`}
            >
              <div className="w-full aspect-video bg-slate-950 relative group-hover:opacity-90 transition-opacity">
                <video
                  src={camera.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-2 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-500 font-mono font-bold">
                    LIVE
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white font-mono">
                    {camera.name}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-white">
                  {camera.name}
                </h3>
                <p
                  className={`text-xs ${hasApiAlert ? "text-red-400" : "text-slate-400"}`}
                >
                  {camera.location}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full text-xs"
                  onClick={async (e) => {
                    e.stopPropagation();
                    console.log("Analyzing camera:", camera.id);
                    try {
                      const asset = await getAssetIfExists(camera.src);

                      console.log("Existing asset:", asset);

                      const res = await fetch(
                        "http://127.0.0.1:8000/api/analyze/video",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            video_source: camera.src,
                            existing_video_id: asset ? asset.videoId : null,
                            interval_seconds: 5,
                            frame_count: 6,
                          }),
                        },
                      );

                      const data = await res.json();

                      await insertAssetIntoDbIfNotExists(
                        camera.src,
                        data.video_id,
                      );
                      if (data.success) {
                        console.log("Analysis result:", data.result);
                        onAddAlert(camera.id, camera.name);
                      } else {
                        console.error("Analysis failed:", data.error);
                      }
                    } catch (error) {
                      console.error("Failed to call analysis API:", error);
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
