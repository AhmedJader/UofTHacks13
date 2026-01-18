export type Camera = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  location: string;
  src: string; // video file path
  severity: "high" | "medium" | "low";
};

// 🔑 SINGLE SOURCE OF TRUTH
export const CAMERAS: Camera[] = [
  {
    id: "cam-1",
    name: "Downtown",
    location: "City Center",
    lat: 43.65107,
    lng: -79.347015,
    src: "/cctv/downtown.mp4",
    severity: "high",
  },
  {
    id: "cam-2",
    name: "Incident 1",
    location: "Sector 4",
    lat: 43.6629,
    lng: -79.3957,
    src: "/cctv/incident1.mp4",
    severity: "low",
  },
  {
    id: "cam-3",
    name: "Incident 2",
    location: "Sector 7",
    lat: 43.668,
    lng: -79.401,
    src: "/cctv/incident2.mp4",
    severity: "medium",
  },
  {
    id: "cam-4",
    name: "Incident 3",
    location: "Sector 9",
    lat: 43.645,
    lng: -79.38,
    src: "/cctv/incident3.mp4",
    severity: "high",
  },
  {
    id: "cam-5",
    name: "TTC Station",
    location: "Subway Platform",
    lat: 43.656,
    lng: -79.38,
    src: "/cctv/ttc1.mp4",
    severity: "high",
  },
];
