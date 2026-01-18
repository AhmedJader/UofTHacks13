"use client";

import React, { useEffect, useRef } from "react";
import {
  FilesetResolver,
  ObjectDetector,
  PoseLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

type TrackedPerson = {
  id: number;
  bbox: DOMRect;
  lastSeen: number;
};

let PERSON_ID = 0;

export default function PoseOverlayMulti({
  videoRef,
  cameraId, // <-- IMPORTANT: pass cameraId so we can reset cleanly on feed switch
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawerRef = useRef<DrawingUtils | null>(null);

  const offscreenRef = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const peopleRef = useRef<TrackedPerson[]>([]);

  // MediaPipe instances (kept in refs so the RAF loop always sees the latest)
  const detectorRef = useRef<ObjectDetector | null>(null);
  const poseRef = useRef<PoseLandmarker | null>(null);

  // RAF + throttling
  const rafIdRef = useRef<number | null>(null);
  const lastDetectTimeRef = useRef<number>(0);
  const lastPoseTimeRef = useRef<number>(0);

  // Tuning knobs (change freely)
  const IOU_THRESHOLD = 0.3;
  const TRACK_TTL = 600; // ms until we drop a person track
  const DETECT_EVERY_MS = 250; // run person detector ~4 FPS
  const POSE_EVERY_MS = 120; // run pose ~8 FPS (per tracked person, so keep sane)
  const PAD = 20;

  const iou = (a: DOMRect, b: DOMRect) => {
    const x1 = Math.max(a.x, b.x);
    const y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.width, b.x + b.width);
    const y2 = Math.min(a.y + a.height, b.y + b.height);

    const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const union = a.width * a.height + b.width * b.height - inter;
    return union === 0 ? 0 : inter / union;
  };

  const matchOrCreatePerson = (bbox: DOMRect) => {
    const now = performance.now();

    for (const p of peopleRef.current) {
      if (iou(p.bbox, bbox) > IOU_THRESHOLD) {
        p.bbox = bbox;
        p.lastSeen = now;
        return p;
      }
    }

    const person: TrackedPerson = {
      id: PERSON_ID++,
      bbox,
      lastSeen: now,
    };

    peopleRef.current.push(person);
    return person;
  };

  const cleanupPeople = () => {
    const now = performance.now();
    peopleRef.current = peopleRef.current.filter(
      (p) => now - p.lastSeen < TRACK_TTL
    );

    // Also cleanup offscreen canvases for removed people
    const alive = new Set(peopleRef.current.map((p) => p.id));
    for (const key of offscreenRef.current.keys()) {
      if (!alive.has(key)) offscreenRef.current.delete(key);
    }
  };

  const hardResetState = () => {
    peopleRef.current = [];
    offscreenRef.current.clear();
    drawerRef.current = null;
    PERSON_ID = 0;
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      // Person detector
      detectorRef.current = await ObjectDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite",
          delegate: "CPU",
        },
        scoreThreshold: 0.4,
      });

      // Pose landmarker in VIDEO mode (more stable for continuous frames)
      poseRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task",
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        numPoses: 2, // optional: limit internal pose count
      });

      if (!cancelled) {
        // kick off loop
        const loop = () => {
          rafIdRef.current = requestAnimationFrame(loop);

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const detector = detectorRef.current;
          const pose = poseRef.current;

          if (!video || !canvas || !detector || !pose) return;

          // 🔒 Gate until the video actually has frames + dimensions
          // readyState >= 2 means we have current data
          if (
            video.readyState < 2 ||
            video.videoWidth === 0 ||
            video.videoHeight === 0
          ) {
            return;
          }

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Match overlay canvas to the video’s intrinsic resolution
          if (
            canvas.width !== video.videoWidth ||
            canvas.height !== video.videoHeight
          ) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (!drawerRef.current) drawerRef.current = new DrawingUtils(ctx);
          const drawer = drawerRef.current;

          const now = performance.now();

          // ----- Detection (throttled) -----
          // We only re-run detector occasionally; between runs we still draw last known bboxes.
          let ranDetection = false;

          if (now - lastDetectTimeRef.current >= DETECT_EVERY_MS) {
            lastDetectTimeRef.current = now;
            ranDetection = true;

            const dets = detector.detect(video).detections;

            for (const d of dets) {
              const cat = d.categories?.[0];
              if (!cat || cat.categoryName !== "person") continue;

              const bb = d.boundingBox;
              if (!bb) continue;

              const bbox = new DOMRect(
                bb.originX,
                bb.originY,
                bb.width,
                bb.height
              );

              matchOrCreatePerson(bbox);
            }
          }

          // If we didn’t run detection this frame, still keep lastSeen fresh a bit
          // so tracks don’t evaporate between throttled detections.
          if (!ranDetection) {
            // no-op; TTL + throttles handle it
          }

          // ----- Draw bboxes + Pose (throttled) -----
          // We can draw boxes every frame, but only run pose occasionally.
          const doPoseThisFrame = now - lastPoseTimeRef.current >= POSE_EVERY_MS;
          if (doPoseThisFrame) lastPoseTimeRef.current = now;

          for (const p of peopleRef.current) {
            const bbox = p.bbox;

            // Draw box
            ctx.strokeStyle = "#ff0055";
            ctx.lineWidth = 2;
            ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);

            ctx.fillStyle = "#ff0055";
            ctx.font = "12px monospace";
            ctx.fillText(`ID ${p.id}`, bbox.x + 4, bbox.y - 6);

            if (!doPoseThisFrame) continue;

            // ----- Crop (safe math) -----
            const cropX = Math.max(0, bbox.x - PAD);
            const cropY = Math.max(0, bbox.y - PAD);

            const cropW = Math.min(
              bbox.width + PAD * 2,
              video.videoWidth - cropX
            );
            const cropH = Math.min(
              bbox.height + PAD * 2,
              video.videoHeight - cropY
            );

            // 🔒 Prevent zero/invalid crops (THIS prevents your OpenCV crash)
            if (cropW <= 1 || cropH <= 1) continue;

            let off = offscreenRef.current.get(p.id);
            if (!off) {
              off = document.createElement("canvas");
              offscreenRef.current.set(p.id, off);
            }

            off.width = Math.floor(cropW);
            off.height = Math.floor(cropH);

            if (off.width === 0 || off.height === 0) continue;

            const offCtx = off.getContext("2d");
            if (!offCtx) continue;

            offCtx.clearRect(0, 0, off.width, off.height);
            offCtx.drawImage(
              video,
              cropX,
              cropY,
              cropW,
              cropH,
              0,
              0,
              off.width,
              off.height
            );

            // Pose detect in VIDEO mode
            const poseResult = pose.detectForVideo(off, now);

            if (!poseResult.landmarks || poseResult.landmarks.length === 0)
              continue;

            for (const lm of poseResult.landmarks) {
              // Translate crop-local normalized coords -> full video coords
              const translated = lm.map((pt) => ({
                x: pt.x * cropW + cropX,
                y: pt.y * cropH + cropY,
                z: pt.z,
                visibility: pt.visibility,
              }));

              drawer.drawConnectors(
                translated,
                PoseLandmarker.POSE_CONNECTIONS,
                { color: "#00ffcc", lineWidth: 2 }
              );

              drawer.drawLandmarks(translated, {
                color: "#ffffff",
                radius: 2,
              });
            }
          }

          cleanupPeople();
        };

        loop();
      }
    };

    init();

    return () => {
      cancelled = true;

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;

      detectorRef.current?.close();
      poseRef.current?.close();

      detectorRef.current = null;
      poseRef.current = null;

      hardResetState();
    };
  }, [videoRef]);

  // ✅ Reset tracking cleanly when camera feed changes
  useEffect(() => {
    hardResetState();
    lastDetectTimeRef.current = 0;
    lastPoseTimeRef.current = 0;
  }, [cameraId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}
