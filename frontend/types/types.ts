export interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  message: string;
  timestamp: number; // epoch ms
  severity: "low" | "medium" | "high";
}
