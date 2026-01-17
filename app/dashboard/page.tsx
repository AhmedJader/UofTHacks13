"use client";

import { useState } from "react";
import CameraGrid from "@/components/dashboard/camera-grid";
import AlertPanel from "@/components/dashboard/alert-panel";
import { Alert } from "@/types/types";

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      cameraId: "cam-1",
      cameraName: "Entrance",
      message: "Motion detected",
      timestamp: new Date(),
      severity: "high",
    },
  ]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>("1");
  const [fullscreenCameraId, setFullscreenCameraId] = useState<string | null>(
    null,
  );

  const handleCameraClick = (cameraId: string) => {
    const existingAlert = alerts.find((a) => a.cameraId === cameraId);
    if (existingAlert) {
      setSelectedAlertId(existingAlert.id);
    }
  };

  const handleAddAlert = (cameraId: string, cameraName: string) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      cameraId,
      cameraName,
      message: "Motion detected",
      timestamp: new Date(),
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as
        | "low"
        | "medium" // random for now until we get a response from twelvelabs
        | "high",
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setSelectedAlertId(newAlert.id);
  };

  const handleFullscreenAlert = () => {
    const selectedAlert = alerts.find((a) => a.id === selectedAlertId);
    if (selectedAlert) {
      setFullscreenCameraId(selectedAlert.cameraId);
    }
  };

  const handleCloseFullscreen = () => {
    setFullscreenCameraId(null);
  };

  if (fullscreenCameraId) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center relative">
        <button
          onClick={handleCloseFullscreen}
          className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Exit Fullscreen
        </button>
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Fullscreen View: {fullscreenCameraId}
            </p>
            <div className="w-96 h-96 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
              <span className="text-gray-500">
                Camera Feed - {fullscreenCameraId}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full h-screen bg-slate-950 flex flex-col">
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-white">CCTV Monitor</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time surveillance dashboard
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-3/4 border-r border-slate-700 overflow-auto">
          <CameraGrid
            onCameraClick={handleCameraClick}
            onAddAlert={handleAddAlert}
            selectedCameraId={
              selectedAlertId
                ? (alerts.find((a) => a.id === selectedAlertId)?.cameraId ??
                  null)
                : null
            }
          />
        </div>

        <div className="w-1/4 overflow-auto">
          <AlertPanel
            alerts={alerts}
            selectedAlertId={selectedAlertId}
            onSelectAlert={setSelectedAlertId}
            onFullscreen={handleFullscreenAlert}
            onDeleteAlert={(id) =>
              setAlerts((prev) => prev.filter((a) => a.id !== id))
            }
          />
        </div>
      </div>
    </main>
  );
}
