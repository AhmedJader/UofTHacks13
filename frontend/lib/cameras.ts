// lib/cameras.ts

export type Camera = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  location: string;
  src: string;
  severity: "high" | "medium" | "low";

  /** Whether this camera has a real, analyzable video feed */
  hasFeed: boolean;
};

export const CAMERAS: Camera[] = [
  // ===== REAL / ANALYZABLE CAMERAS =====

  {
    id: "cam-1",
    name: "Downtown — Yonge-Dundas",
    location: "1 Dundas St E, Toronto, ON M5B 2R8",
    lat: 43.656071,
    lng: -79.380280,
    src: "/cctv/downtown.mp4",
    severity: "high",
    hasFeed: true,
  },
  {
    id: "cam-2",
    name: "Incident 1 — Streetcar Front",
    location: "Streetcar - 505 (Front Cam)",
    lat: 43.6629,
    lng: -79.3957,
    src: "/cctv/incident1.mp4",
    severity: "low",
    hasFeed: true,
  },
  {
    id: "cam-3",
    name: "Incident 2 — Streetcar Back",
    location: "Streetcar - 505 (Back Cam)",
    lat: 43.668,
    lng: -79.401,
    src: "/cctv/incident2.mp4",
    severity: "medium",
    hasFeed: true,
  },
  {
    id: "cam-4",
    name: "Yorkdale Bus Terminal",
    location: "1 Yorkdale Rd, Toronto, ON M6A 3A1",
    lat: 43.72183,
    lng: -79.442665,
    src: "/cctv/incident3.mp4",
    severity: "high",
    hasFeed: true,
  },
  {
    id: "cam-5",
    name: "Downtown North",
    location: "Yonge & Dundas Square",
    lat: 43.6572,
    lng: -79.3816,
    src: "/cctv/downtown2.mp4",
    severity: "medium",
    hasFeed: true,
  },
  {
    id: "cam-6",
    name: "Downtown South",
    location: "Union Station Area",
    lat: 43.648,
    lng: -79.385,
    src: "/cctv/downtown3.mp4",
    severity: "low",
    hasFeed: true,
  },
  {
    id: "cam-7",
    name: "Downtown West",
    location: "Queen & Spadina",
    lat: 43.652,
    lng: -79.39,
    src: "/cctv/downtown4.mp4",
    severity: "high",
    hasFeed: true,
  },

  // ===== MAP-ONLY / FAKE CAMERAS =====

  {
    id: "cam-8",
    name: "Scarborough Transit Hub",
    location: "Kennedy Station Area",
    lat: 43.7326,
    lng: -79.2633,
    src: "/cctv/fake1.mp4",
    severity: "medium",
    hasFeed: false,
  },
  {
    id: "cam-9",
    name: "Etobicoke Civic Center",
    location: "399 The West Mall, Etobicoke",
    lat: 43.6448,
    lng: -79.5642,
    src: "/cctv/fake2.mp4",
    severity: "low",
    hasFeed: false,
  },
  {
    id: "cam-10",
    name: "North York Center Plaza",
    location: "Yonge & Sheppard",
    lat: 43.7615,
    lng: -79.4111,
    src: "/cctv/fake3.mp4",
    severity: "medium",
    hasFeed: false,
  },
  {
    id: "cam-11",
    name: "East Danforth Corridor",
    location: "Danforth Ave & Woodbine",
    lat: 43.6889,
    lng: -79.3176,
    src: "/cctv/fake4.mp4",
    severity: "low",
    hasFeed: false,
  },
  {
    id: "cam-12",
    name: "High Park West Entrance",
    location: "Bloor St W & High Park Ave",
    lat: 43.6557,
    lng: -79.4636,
    src: "/cctv/fake5.mp4",
    severity: "medium",
    hasFeed: false,
  },
  {
    id: "cam-13",
    name: "Don Mills Transit Loop",
    location: "Don Mills Rd & Eglinton Ave",
    lat: 43.7251,
    lng: -79.3406,
    src: "/cctv/fake6.mp4",
    severity: "high",
    hasFeed: false,
  },
  {
    id: "cam-14",
    name: "Harbourfront East Promenade",
    location: "Queens Quay E, Toronto",
    lat: 43.649,
    lng: -79.3568,
    src: "/cctv/fake7.mp4",
    severity: "low",
    hasFeed: false,
  },
  {
    id: "cam-15",
    name: "Weston Rail Crossing",
    location: "Weston Rd & Lawrence Ave",
    lat: 43.7004,
    lng: -79.5172,
    src: "/cctv/fake8.mp4",
    severity: "medium",
    hasFeed: false,
  },
  {
    id: "cam-16",
    name: "Rouge Hill GO Station",
    location: "Rouge Hill Station, Scarborough",
    lat: 43.7802,
    lng: -79.1316,
    src: "/cctv/fake9.mp4",
    severity: "low",
    hasFeed: false,
  },
  {
    id: "cam-17",
    name: "Exhibition Grounds South",
    location: "Exhibition Place",
    lat: 43.6335,
    lng: -79.4172,
    src: "/cctv/fake10.mp4",
    severity: "high",
    hasFeed: false,
  },
];

// ===== DOMAIN-SPECIFIC EXPORTS =====

// Dashboard MUST ONLY see real feeds
export const DASHBOARD_CAMERAS = CAMERAS.filter(c => c.hasFeed);

// Map can show everything
export const MAP_CAMERAS = CAMERAS;
