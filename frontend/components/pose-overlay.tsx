"use client";

import { useEffect, useRef } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

export default function PoseOverlay({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<DrawingUtils | null>(null);

  useEffect(() => {
    let landmarker: PoseLandmarker | null = null;
    let rafId: number;

    const startLoop = () => {
      const loop = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (
          !video ||
          !canvas ||
          !landmarker ||
          video.paused ||
          video.videoWidth === 0 ||
          video.videoHeight === 0
        ) {
          rafId = requestAnimationFrame(loop);
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          rafId = requestAnimationFrame(loop);
          return;
        }

        // Match canvas to video every frame (handles resize)
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const result = landmarker.detectForVideo(
          video,
          performance.now()
        );

        // ⛔ Nothing detected yet → don't draw
        if (!result.landmarks || result.landmarks.length === 0) {
          rafId = requestAnimationFrame(loop);
          return;
        }

        // Create DrawingUtils once
        if (!drawerRef.current) {
          drawerRef.current = new DrawingUtils(ctx);
        }

        const drawer = drawerRef.current;

        for (const landmarks of result.landmarks) {
          drawer.drawConnectors(
            landmarks,
            PoseLandmarker.POSE_CONNECTIONS,
            {
              color: "#00ffcc",
              lineWidth: 2,
            }
          );

          drawer.drawLandmarks(landmarks, {
            color: "#ffffff",
            radius: 2,
          });
        }

        rafId = requestAnimationFrame(loop);
      };

      loop();
    };

    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
          delegate: "CPU",
        },
        runningMode: "VIDEO",

        // ✅ Option B
        numPoses: 4,
        minPoseDetectionConfidence: 0.4,
        minTrackingConfidence: 0.4,
      });

      const video = videoRef.current;
      if (!video) return;

      if (video.readyState >= 2) {
        startLoop();
      } else {
        video.addEventListener("loadedmetadata", startLoop, {
          once: true,
        });
      }
    };

    init();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      landmarker?.close();
      drawerRef.current = null;
    };
  }, [videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
