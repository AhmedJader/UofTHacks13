export type Camera = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  location: string;
  src: string;
  severity: "high" | "medium" | "low";
};

export const CAMERAS: Camera[] = [
  {
    id: "cam-1",
    name: "Downtown",
    location: "1 Dundas St E, Toronto, ON M5B 2R8",
    lat: 43.65107,
    lng: -79.347015,
    src: "/cctv/downtown.mp4",
    severity: "high",
  },
  {
    id: "cam-2",
    name: "Incident 1",
    location: "Streetcar - 505 (Front Cam)",
    lat: 43.6629,
    lng: -79.3957,
    src: "/cctv/incident1.mp4",
    severity: "low",
  },
  {
    id: "cam-3",
    name: "Incident 2",
    location: "Streetcar - 505 (Back Cam)",
    lat: 43.668,
    lng: -79.401,
    src: "/cctv/incident2.mp4",
    severity: "medium",
  },
  {
    id: "cam-4",
    name: "Incident 3",
    location: "1 Yorkdale Road, Toronto, ON M6A 3A1",
    lat: 43.645,
    lng: -79.38,
    src: "/cctv/incident3.mp4",
    severity: "high",
  },
  {
    id: "cam-5",
    name: "Downtown North",
    location: "Yonge & Dundas Square",
    lat: 43.656,
    lng: -79.380,
    src: "/cctv/downtown2.mp4",
    severity: "medium",
  },
  {
    id: "cam-6",
    name: "Downtown South",
    location: "Union Station Area",
    lat: 43.648,
    lng: -79.385,
    src: "/cctv/downtown3.mp4",
    severity: "low",
  },
  {
    id: "cam-7",
    name: "Downtown West",
    location: "Queen & Spadina",
    lat: 43.652,
    lng: -79.390,
    src: "/cctv/downtown4.mp4",
    severity: "high",
  },
];
