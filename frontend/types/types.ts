export interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  message: string;
  timestamp: number; // epoch milliseconds ONLY
  severity: "low" | "medium" | "high";
}
