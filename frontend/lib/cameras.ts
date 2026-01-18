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
    name: "Downtown — Yonge-Dundas",
    location: "1 Dundas St E, Toronto, ON M5B 2R8",
    lat: 43.656071,
    lng: -79.380280,
    src: "/cctv/downtown.mp4",
    severity: "high",
  },
  {
    id: "cam-2",
    name: "Incident 1 — Streetcar Front",
    location: "Streetcar - 505 (Front Cam)",
    lat: 43.662900,
    lng: -79.395700,
    src: "/cctv/incident1.mp4",
    severity: "low",
  },
  {
    id: "cam-3",
    name: "Incident 2 — Streetcar Back",
    location: "Streetcar - 505 (Back Cam)",
    lat: 43.668000,
    lng: -79.401000,
    src: "/cctv/incident2.mp4",
    severity: "medium",
  },
  {
    id: "cam-4",
    name: "Yorkdale Bus Terminal",
    location: "1 Yorkdale Road, Toronto, ON M6A 3A1",
    lat: 43.721830,
    lng: -79.442665,
    src: "/cctv/incident3.mp4",
    severity: "high",
  },
  {
    id: "cam-5",
    name: "Downtown North",
    location: "Yonge & Dundas Square",
    lat: 43.6572,
    lng: -79.3816,
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
