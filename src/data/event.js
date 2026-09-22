export const EVENT = {
  organization: "CAMERABUFF",
  presents: "PRESENTS",
  title: "FRESHERS INDUCTION",
  date: "23 SEPTEMBER 2026",
  shortDate: "23.09.2026",
  time: "5:00 PM",
  venueLine1: "3RD FLOOR",
  venueLine2: "STUDENT AMENITIES CENTER",
  institute: "IIEST SHIBPUR",
  tagline: "THIS IS JUST THE OPENING SCENE.",
  instagramUrl: "https://www.instagram.com/camerabuff_iiests/",
  instagramHandle: "@camerabuff_iiests",
};

export const ARCHETYPES = [
  { key: "director", label: "THE DIRECTOR", line: "DIRECT THE STORY" },
  {
    key: "cinematographer",
    label: "THE CINEMATOGRAPHER",
    line: "CAPTURE THE FRAME",
  },
  { key: "storyteller", label: "THE STORYTELLER", line: "WRITE THE STORY" },
  { key: "creative", label: "THE CREATIVE", line: "DESIGN THE WORLD" },
  { key: "observer", label: "THE OBSERVER", line: "WATCH IT UNFOLD" },
];

export function generateTicketId() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `CB26-${n}`;
}

export function sanitizeName(name) {
  return name.trim().replace(/\s+/g, " ").slice(0, 24);
}

export function filenameFor(name) {
  const safe = sanitizeName(name).replace(/[^a-zA-Z0-9]+/g, "_") || "Fresher";
  return `CameraBuff_Ticket_${safe}.png`;
}
