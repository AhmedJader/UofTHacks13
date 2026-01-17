"use client";

import { Alert } from "@/types/types";
import { Trash2, Maximize2 } from "lucide-react";

interface AlertPanelProps {
  alerts: Alert[];
  selectedAlertId: string | null;
  onSelectAlert: (id: string) => void;
  onFullscreen: () => void;
  onDeleteAlert: (id: string) => void;
}

export default function AlertPanel({
  alerts,
  selectedAlertId,
  onSelectAlert,
  onFullscreen,
  onDeleteAlert,
}: AlertPanelProps) {
  const selectedAlert = alerts.find((a) => a.id === selectedAlertId);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-900/30 border-red-700 text-red-300";
      case "medium":
        return "bg-yellow-900/30 border-yellow-700 text-yellow-300";
      case "low":
        return "bg-blue-900/30 border-blue-700 text-blue-300";
      default:
        return "bg-slate-700 border-slate-600 text-slate-300";
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-600 text-white";
      case "medium":
        return "bg-yellow-600 text-white";
      case "low":
        return "bg-blue-600 text-white";
      default:
        return "bg-slate-600 text-white";
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <h2 className="text-lg font-semibold text-white">Active Alerts</h2>
        <p className="text-xs text-slate-400 mt-1">{alerts.length} alert(s)</p>
      </div>

      {selectedAlert && (
        <div
          className={`p-4 border-b border-slate-700 ${getSeverityColor(selectedAlert.severity)}`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold">{selectedAlert.cameraName}</h3>
              <p className="text-sm opacity-80 mt-1">{selectedAlert.message}</p>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityBadgeColor(selectedAlert.severity)}`}
            >
              {selectedAlert.severity.toUpperCase()}
            </span>
          </div>
          <p className="text-xs opacity-60 mb-3">
            {selectedAlert.timestamp.toLocaleTimeString()}
          </p>
          <button
            onClick={onFullscreen}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            <Maximize2 size={16} />
            Fullscreen
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        {alerts.length === 0 ? (
          <div className="p-4 text-center text-slate-400">
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => onSelectAlert(alert.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedAlertId === alert.id
                    ? `border-blue-500 ${getSeverityColor(alert.severity)}`
                    : `border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200`
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold">{alert.cameraName}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${getSeverityBadgeColor(alert.severity)}`}
                  >
                    {alert.severity[0].toUpperCase()}
                  </span>
                </div>
                <p className="text-xs opacity-70 truncate">{alert.message}</p>
                <p className="text-xs opacity-50 mt-1">
                  {alert.timestamp.toLocaleTimeString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedAlert && (
        <div className="p-4 border-t border-slate-700 bg-slate-800">
          <button
            onClick={() => onDeleteAlert(selectedAlert.id)}
            className="w-full flex items-center justify-center gap-2 bg-red-900 hover:bg-red-800 text-red-200 font-semibold py-2 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Dismiss Alert
          </button>
        </div>
      )}
    </div>
  );
}
