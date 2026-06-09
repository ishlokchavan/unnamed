// ============================================================
//  THE BUILDING — a 2D floor-by-floor breakdown of the concept.
//  Derived from the concept transcript: an alt mixed-use cultural
//  hub in Al Barsha, Dubai (behind Art of Living).
//
//  Stack: 2B + G + 5 + Rooftop  (9 levels, read top → bottom).
//  Edit copy here; the <Building /> component adapts to the list.
// ============================================================

export type Zone = "rooftop" | "nightlife" | "community" | "office" | "retail" | "fnb" | "basement";

// hex map for canvas/SVG/JS contexts (CSS uses the matching classes)
export const ZONE_COLORS: Record<Zone, string> = {
  rooftop: "#e8a24a",
  nightlife: "#b46cff",
  community: "#5ec8c2",
  office: "#7f9cf5",
  retail: "#e87aa6",
  fnb: "#6fcf7f",
  basement: "#9a948a",
};

export type Floor = {
  id: string;        // short code shown on the elevation: "R", "L5"… "B2"
  level: string;     // long label
  name: string;      // working / lore name (the doc's open question — kept evocative)
  zone: Zone;        // drives the colour band
  summary: string;   // one-line function
  scope: string;     // size / scale note
  details: string[]; // what actually lives here, from the transcript
};

// Top of the building first, ground in the middle, basements last —
// so the array reads like a real elevation drawing.
export const FLOORS: Floor[] = [
  {
    id: "R",
    level: "Rooftop",
    name: "The Open Sky",
    zone: "rooftop",
    summary: "Adaptive indoor–outdoor nightlife & large-scale events.",
    scope: "Convertible · winter open / summer closed",
    details: [
      "Indoor–outdoor space that opens in winter and seals in summer.",
      "Bars, restaurants and clubs — programme flexes to whatever licences allow.",
      "Bookable as a single venue: concerts and events at scale.",
      "Rooftop theatre — musical plays & alternative performance Dubai lacks.",
    ],
  },
  {
    id: "L5",
    level: "Level 5",
    name: "The Vault",
    zone: "nightlife",
    summary: "Year-round indoor nightlife & immersive theatre.",
    scope: "Climate-controlled · runs every season",
    details: [
      "Indoor clubs and bars that don't depend on the weather.",
      "Immersive / performance theatre space.",
      "The all-season counterpart to the rooftop above.",
    ],
  },
  {
    id: "L4",
    level: "Level 4",
    name: "The Commons",
    zone: "community",
    summary: "Shared amenities, events & in-house atelier.",
    scope: "~⅛–¼ of the floorplate is communal",
    details: [
      "Meeting rooms, boardrooms and a shared networking café.",
      "Space for events, talks and workshops.",
      "In-house tailoring & garment-alteration atelier for the alt-fashion scene.",
      "Built for people to gather, not just transact.",
    ],
  },
  {
    id: "L3",
    level: "Level 3",
    name: "The Workshop",
    zone: "office",
    summary: "Micro-offices & co-working for homegrown brands.",
    scope: "200–400 sq ft units · combine 2–3 for more",
    details: [
      "Tiny offices (200–400 sq ft); join a few together if you need room.",
      "For homegrown alt brands and creators — not big corporates.",
      "Shared co-working zones woven through the floor.",
      "An incubator for the next generation of regional alt labels.",
    ],
  },
  {
    id: "L2",
    level: "Level 2",
    name: "The Gallery",
    zone: "retail",
    summary: "Premium retail — the anchor brands.",
    scope: "2,000–4,000 sq ft · capped, curated",
    details: [
      "Larger, premium units for well-known names (e.g. Chrome Hearts).",
      "Sizes capped at 2,000–4,000 sq ft to keep the mix dense and curated.",
      "No storage on the floor — stock lives off-site in Al Quoz / Barsha.",
      "Staff styled to each brand's world (elevated biker, etc.).",
    ],
  },
  {
    id: "L1",
    level: "Level 1",
    name: "The Bazaar",
    zone: "retail",
    summary: "Grassroots alt-retail — dense micro-units.",
    scope: "200–400 sq ft · combine up to ~800",
    details: [
      "Small homegrown units (200–400 sq ft); merge for ~800 sq ft.",
      "Fashion, jewellery, makeup, body-safe piercing — quality, not fast-fashion.",
      "Central kiosks plus perimeter-and-island shopping, Dubai-Mall style.",
      "The grassroots layer that paints the neutral canvas.",
    ],
  },
  {
    id: "G",
    level: "Ground",
    name: "The Threshold",
    zone: "fnb",
    summary: "F&B, character cafés & arrivals — all ages.",
    scope: "6–20 outlets · high foot traffic",
    details: [
      "Heavy F&B and restaurants, open to everyone regardless of age.",
      "Character & immersive dining: maid cafés, floor-seating Japanese, more.",
      "Central kiosks, photo booths and memory-making amenities.",
      "Climate-controlled bridge links across to the car-park building.",
    ],
  },
  {
    id: "B1",
    level: "Basement 1",
    name: "The Undercroft",
    zone: "basement",
    summary: "Underground clubs & late-night venues.",
    scope: "Below grade · night programme",
    details: [
      "Multiple nightclubs and late-night spaces.",
      "The building's nocturnal engine, tucked below the retail world.",
    ],
  },
  {
    id: "B2",
    level: "Basement 2",
    name: "The Deep",
    zone: "basement",
    summary: "Specialised venues & alternative businesses.",
    scope: "Lowest level · flexible use",
    details: [
      "Additional clubs and specialised alternative businesses.",
      "Whatever the licences and the community call for.",
    ],
  },
];

// Headline facts for the section intro — straight from the brief.
export const BUILDING_META = {
  location: "Al Barsha, Dubai — behind Art of Living",
  stack: "2B + G + 5 + Rooftop",
  area: "500,000 – 1,000,000 sq ft",
  parking: "Separate raw-cement multi-storey, linked by a climate-controlled bridge",
  look: "Fluid dark-glass box, Zaha Hadid / Opus by Omniyat",
  feel: "Gothic-meets-futurism · candle-warm amber light",
};
