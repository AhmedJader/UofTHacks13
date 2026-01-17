export interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  message: string;
  timestamp: Date;
  severity: "low" | "medium" | "high";
}
