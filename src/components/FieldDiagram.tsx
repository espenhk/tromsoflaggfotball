import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";

// Map field-diagram dot ids → /posisjoner slugs
const idToSlug: Record<string, string> = {
  QB: "quarterback",
  C: "center",
  "WR-L": "wide-receiver",
  "WR-R": "wide-receiver",
  "WR-S": "wide-receiver",
  R: "rusher",
  "DB-L": "defensive-back",
  "DB-R": "defensive-back",
  "DB-S": "safety",
  "DB-SA": "safety",
};

const positionFullNames: Record<string, string> = {
  QB: "QB – Quarterback",
  C: "C – Center",
  WR: "WR – Wide Receiver",
  RB: "RB – Running Back",
  R: "R – Rusher",
  DB: "DB – Defensive Back",
  S: "S – Safety",
};

const positionDescriptions: Record<string, string> = {
  QB: "Lagets playmaker og leder på banen. Kaster ballen til medspillere og styrer spillet.",
  C: "Starter hvert spill ved å snappe ballen til QB. Går deretter ut som mottaker eller blokkerer rusheren.",
  WR: "Løper ruter og fanger pasninger fra QB. Målet er å bli fri fra forsvareren og ta imot ballen.",
  RB: "Tar imot ballen fra QB og løper med den. Kan også brukes som mottaker på korte pasninger.",
  R: "Starter 7 yards fra ballen med hånden i året. Kan rushe mot QB så fort de klarer etter snap. Laget kan ha 0–2 rushere per spill.",
  DB: "Dekker motstanderens mottakere tett. Hindrer pasninger og drar flagget til ballbæreren.",
  S: "Siste skanse i forsvaret. Leser spillet bakfra, hjelper til med dekning og sikrer mot lange pasninger.",
};

type OffenseTabId = "formasjon" | "kastespill" | "løpespill";
type DefenseTabId = "formasjon" | "soneforsvar" | "mann-mot-mann";

const offenseTabs: { id: OffenseTabId; label: string }[] = [
  { id: "formasjon", label: "Formasjon" },
  { id: "kastespill", label: "Kastespill" },
  { id: "løpespill", label: "Løpespill" },
];

const defenseTabs: { id: DefenseTabId; label: string }[] = [
  { id: "formasjon", label: "Formasjon" },
  { id: "soneforsvar", label: "Soneforsvar" },
  { id: "mann-mot-mann", label: "Man-man" },
];

// ------------------------------------------------------------------
// Variant geometry — all positions/arrows are expressed in YARDS so
// arrows cover the same real distance regardless of total field length.
// ------------------------------------------------------------------
type FieldVariant = "classic" | "simple";

type VariantGeo = {
  totalLength: number;   // total field length in yards (top→bottom)
  endzone: number;       // endzone depth in yards (top + bottom)
  losFromBottomEz: number; // distance from inner edge of bottom endzone to ball
};

const VARIANTS: Record<FieldVariant, VariantGeo> = {
  // Front page: 30-yard field (5yd endzones + 20yd play area, ball at the 5)
  classic: { totalLength: 30, endzone: 5, losFromBottomEz: 5 },
  // Posisjoner: full 70-yard field (10yd endzones + 50yd play area, ball at the 5)
  simple:  { totalLength: 70, endzone: 10, losFromBottomEz: 5 },
};

// Helpers — y in % of field height (0=top, 100=bottom)
const losPct = (g: VariantGeo) => ((g.totalLength - g.endzone - g.losFromBottomEz) / g.totalLength) * 100;
const ydPct  = (g: VariantGeo) => 100 / g.totalLength;
// Convert "N yards upfield from LOS (toward defense / top)" to absolute y%
const upfield = (g: VariantGeo, ydAboveLos: number) => losPct(g) - ydAboveLos * ydPct(g);
// Convert "N yards behind LOS (own side / bottom)" to absolute y%
const behind  = (g: VariantGeo, ydBehindLos: number) => losPct(g) + ydBehindLos * ydPct(g);

// ------------------------------------------------------------------
// Zones (defensive) — defined in yards relative to LOS
// ------------------------------------------------------------------
const zoneAreasYd: Record<string, { cx: number; cyYd: number; rx: number; ryYd: number; color: string; border: string }> = {
  "DB-L":  { cx: 18, cyYd: 8,  rx: 16, ryYd: 6, color: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.4)" },
  "DB-R":  { cx: 82, cyYd: 8,  rx: 16, ryYd: 6, color: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.4)" },
  "DB-SA": { cx: 38, cyYd: 12, rx: 16, ryYd: 6, color: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.4)" },
  "DB-S":  { cx: 65, cyYd: 16, rx: 16, ryYd: 6, color: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.4)" },
};

type PlayerPosition = { topYd: number; left: number; label: string; color: string; id: string };
// topYd: yards relative to LOS; positive = upfield (toward defense), negative = behind LOS

// ------------------------------------------------------------------
// Offense formations & plays
// ------------------------------------------------------------------
// C is touching the ball (just behind it = 0.7 yd back)
// QB exactly 5yd off the ball
// WRs lined up at the LOS (0 yd)
const baseOffense = (tab: OffenseTabId): PlayerPosition[] => {
  const c: PlayerPosition = { topYd: -0.8, left: 50, label: "C", color: "bg-sky-400", id: "C" };
  const qb: PlayerPosition = { topYd: -5,   left: 50, label: "QB", color: "bg-amber-400", id: "QB" };
  if (tab === "løpespill") {
    return [
      c,
      // QB lines up directly behind C in run formations
      { ...qb, topYd: -3 },
      { topYd: -8, left: 50, label: "RB", color: "bg-emerald-400", id: "WR-S" },
      { topYd: 0,  left: 12, label: "WR", color: "bg-sky-400", id: "WR-L" },
      { topYd: 0,  left: 88, label: "WR", color: "bg-sky-400", id: "WR-R" },
    ];
  }
  // formasjon & kastespill — all WRs on the LOS
  return [
    c, qb,
    { topYd: 0, left: 12, label: "WR", color: "bg-sky-400", id: "WR-L" },
    { topYd: 0, left: 88, label: "WR", color: "bg-sky-400", id: "WR-R" },
    { topYd: 0, left: 72, label: "WR", color: "bg-sky-400", id: "WR-S" },
  ];
};

// Defense — DBs/Safeties closer to the ball
// "simple" variant uses real distances; "classic" compresses them so they fit
// the much shorter 20-yd front-page field.
const defenseFor = (variant: FieldVariant): PlayerPosition[] => {
  if (variant === "classic") {
    return [
      { topYd: 7, left: 63, label: "R",  color: "bg-orange-400", id: "R"    },
      { topYd: 5, left: 18, label: "DB", color: "bg-rose-400",   id: "DB-L" },
      { topYd: 5, left: 82, label: "DB", color: "bg-rose-400",   id: "DB-R" },
      { topYd: 9, left: 65, label: "S",  color: "bg-rose-400",   id: "DB-S" },
      { topYd: 7, left: 38, label: "S",  color: "bg-rose-400",   id: "DB-SA" },
    ];
  }
  return [
    { topYd: 7,  left: 63, label: "R",  color: "bg-orange-400", id: "R"    },
    { topYd: 7,  left: 18, label: "DB", color: "bg-rose-400",   id: "DB-L" },
    { topYd: 7,  left: 82, label: "DB", color: "bg-rose-400",   id: "DB-R" },
    { topYd: 14, left: 65, label: "S",  color: "bg-rose-400",   id: "DB-S" },
    { topYd: 11, left: 38, label: "S",  color: "bg-rose-400",   id: "DB-SA" },
  ];
};

// Convert player to absolute % top
const toAbs = (p: PlayerPosition, g: VariantGeo) => ({ ...p, top: losPct(g) - p.topYd * ydPct(g) });

const getManAssignments = (_tab: OffenseTabId): Record<string, string> => {
  return { "DB-L": "WR-L", "DB-SA": "C", "DB-S": "WR-S", "DB-R": "WR-R" };
};

// ------------------------------------------------------------------
// Plays — each route is a list of {x: leftPct, yYd: yards above LOS}
// Used on the /posisjoner page (simple variant) when a play is selected.
// ------------------------------------------------------------------
type RoutePoint = { x: number; yYd: number };
type Route = { id: string; color: string; points: RoutePoint[] };
type Play = {
  id: string;
  name: string;
  kind: "pass" | "run";
  // override player positions (yards relative to LOS) — keyed by id
  positions?: Partial<Record<string, { topYd: number; left: number; label?: string }>>;
  routes: Route[];
};

const ROUTE_BLUE   = "#60a5fa";
const ROUTE_GREEN  = "#4ade80";
const ROUTE_ORANGE = "#fb923c";
const ROUTE_BLACK  = "#1f2937";

// 5 PASS PLAYS (kastespill)
const passPlays: Play[] = [
  {
    id: "single-back-1",
    name: "Single Back – Play 1",
    kind: "pass",
    positions: {
      "WR-L": { topYd: 0, left: 18, label: "X" },
      "WR-R": { topYd: 0, left: 82, label: "Z" },
      "WR-S": { topYd: -7, left: 50, label: "Y" },
      C:      { topYd: -0.8, left: 50, label: "C" },
      QB:     { topYd: -5, left: 50, label: "Q" },
    },
    routes: [
      // X – slant in
      { id: "WR-L", color: ROUTE_BLUE,  points: [ {x:18,yYd:0}, {x:32,yYd:6} ] },
      // C – post up the seam then break right
      { id: "C",    color: ROUTE_BLACK, points: [ {x:50,yYd:-0.8}, {x:50,yYd:14}, {x:60,yYd:18} ] },
      // Y – flat right
      { id: "WR-S", color: ROUTE_GREEN, points: [ {x:50,yYd:-7}, {x:42,yYd:-3}, {x:30,yYd:-1} ] },
      // Z – curl
      { id: "WR-R", color: ROUTE_ORANGE,points: [ {x:82,yYd:0}, {x:75,yYd:7} ] },
    ],
  },
  {
    id: "spread-1",
    name: "Spread Formation – Play 1",
    kind: "pass",
    positions: {
      "WR-L": { topYd: 0,  left: 12, label: "X" },
      "WR-R": { topYd: 0,  left: 88, label: "Z" },
      "WR-S": { topYd: 0,  left: 65, label: "Y" },
      C:      { topYd: -0.8, left: 50, label: "C" },
      QB:     { topYd: -5, left: 50, label: "Q" },
    },
    routes: [
      { id: "WR-L", color: ROUTE_BLUE,   points: [ {x:12,yYd:0}, {x:18,yYd:14} ] },          // go
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:80,yYd:5} ] },          // drag right
      { id: "WR-S", color: ROUTE_GREEN,  points: [ {x:65,yYd:0}, {x:65,yYd:6}, {x:60,yYd:10} ] }, // post
      { id: "WR-R", color: ROUTE_ORANGE, points: [ {x:88,yYd:0}, {x:88,yYd:14} ] },         // go
    ],
  },
  {
    id: "trips-1",
    name: "Trips Formation – Play 1",
    kind: "pass",
    positions: {
      C:      { topYd: -0.8, left: 50, label: "C" },
      "WR-L": { topYd: 0,    left: 58, label: "X" },
      "WR-S": { topYd: 0,    left: 65, label: "Y" },
      "WR-R": { topYd: 0,    left: 82, label: "Z" },
      QB:     { topYd: -5,   left: 50, label: "Q" },
    },
    routes: [
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:38,yYd:8}, {x:48,yYd:8} ] },
      { id: "WR-L", color: ROUTE_BLUE,   points: [ {x:58,yYd:0},  {x:55,yYd:4} ] },
      { id: "WR-S", color: ROUTE_GREEN,  points: [ {x:65,yYd:0},  {x:65,yYd:10}, {x:55,yYd:14} ] },
      { id: "WR-R", color: ROUTE_ORANGE, points: [ {x:82,yYd:0},  {x:82,yYd:6}, {x:88,yYd:12} ] },
    ],
  },
  {
    id: "twins-1",
    name: "Twins Formation – Play 1",
    kind: "pass",
    positions: {
      "WR-L": { topYd: 0,  left: 28, label: "X" },
      C:      { topYd: -0.8, left: 50, label: "C" },
      "WR-S": { topYd: 0,  left: 70, label: "Y" },
      "WR-R": { topYd: -3, left: 82, label: "Z" },
      QB:     { topYd: -5, left: 50, label: "Q" },
    },
    routes: [
      { id: "WR-L", color: ROUTE_BLUE,   points: [ {x:28,yYd:0}, {x:36,yYd:5}, {x:50,yYd:5} ] },
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:20,yYd:4} ] },
      { id: "WR-S", color: ROUTE_GREEN,  points: [ {x:70,yYd:0}, {x:70,yYd:14} ] },
      { id: "WR-R", color: ROUTE_ORANGE, points: [ {x:82,yYd:-3}, {x:78,yYd:6}, {x:62,yYd:10}, {x:78,yYd:14} ] },
    ],
  },
  {
    id: "i-formation-1",
    name: "I Formation – Play 1",
    kind: "pass",
    positions: {
      C:      { topYd: -0.8, left: 50, label: "C" },
      QB:     { topYd: -3,   left: 50, label: "Q" },
      "WR-S": { topYd: -6,   left: 50, label: "Y" },
      "WR-L": { topYd: 0,    left: 18, label: "X" },
      "WR-R": { topYd: 0,    left: 82, label: "Z" },
    },
    routes: [
      { id: "WR-L", color: ROUTE_GREEN,  points: [ {x:18,yYd:0}, {x:30,yYd:8} ] },
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:55,yYd:8}, {x:65,yYd:14} ] },
      { id: "WR-S", color: ROUTE_ORANGE, points: [ {x:50,yYd:-6}, {x:42,yYd:0}, {x:50,yYd:5} ] },
      { id: "WR-R", color: ROUTE_BLUE,   points: [ {x:82,yYd:0}, {x:82,yYd:6}, {x:88,yYd:6} ] },
    ],
  },
];

// 5 RUN PLAYS (løpespill)
const runPlays: Play[] = [
  {
    id: "hb-dive",
    name: "HB Dive",
    kind: "run",
    positions: {
      "WR-L": { topYd: 0,    left: 25, label: "X" },
      C:      { topYd: -0.8, left: 50, label: "C" },
      "WR-R": { topYd: 0,    left: 75, label: "Z" },
      QB:     { topYd: -3,   left: 50, label: "Q" },
      "WR-S": { topYd: -7,   left: 55, label: "Y" }, // RB
    },
    routes: [
      { id: "WR-L", color: ROUTE_BLUE,   points: [ {x:25,yYd:0},  {x:25,yYd:6} ] },
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:50,yYd:5}, {x:58,yYd:5} ] },
      { id: "WR-R", color: ROUTE_ORANGE, points: [ {x:75,yYd:0},  {x:75,yYd:8} ] },
      // RB takes handoff and runs upfield through right A-gap
      { id: "WR-S", color: ROUTE_GREEN,  points: [ {x:55,yYd:-7}, {x:50,yYd:-3}, {x:55,yYd:5} ] },
    ],
  },
  {
    id: "reverse",
    name: "Reverse",
    kind: "run",
    positions: {
      "WR-L": { topYd: 0,    left: 28, label: "X" },
      C:      { topYd: -0.8, left: 50, label: "C" },
      "WR-S": { topYd: 0,    left: 62, label: "Y" },
      "WR-R": { topYd: 0,    left: 78, label: "Z" },
      QB:     { topYd: -5,   left: 50, label: "Q" },
    },
    routes: [
      // C blocks downfield
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:50,yYd:5} ] },
      // Z runs decoy route
      { id: "WR-R", color: ROUTE_GREEN,  points: [ {x:78,yYd:0}, {x:78,yYd:6} ] },
      // QB takes snap, sweeps right and hands off to Y
      { id: "QB",   color: ROUTE_ORANGE, points: [ {x:50,yYd:-5}, {x:60,yYd:-4}, {x:65,yYd:-2} ] },
      // Y receives handoff, runs left across the formation, hands off to X (the reverse)
      { id: "WR-S", color: ROUTE_BLUE,   points: [ {x:62,yYd:0}, {x:55,yYd:-2}, {x:35,yYd:-3} ] },
      // X receives the reverse handoff and runs around the right end upfield (ball carrier)
      { id: "WR-L", color: ROUTE_ORANGE, points: [ {x:28,yYd:0}, {x:32,yYd:-3}, {x:55,yYd:-4}, {x:80,yYd:-2}, {x:88,yYd:8} ] },
    ],
  },
  {
    id: "double-reverse",
    name: "Double Reverse",
    kind: "run",
    positions: {
      "WR-L": { topYd: 0,    left: 18, label: "X" },
      C:      { topYd: -0.8, left: 50, label: "C" },
      "WR-S": { topYd: 0,    left: 60, label: "Y" },
      "WR-R": { topYd: 0,    left: 80, label: "Z" },
      QB:     { topYd: -5,   left: 50, label: "Q" },
    },
    routes: [
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:50,yYd:5} ] },
      { id: "WR-S", color: ROUTE_GREEN,  points: [ {x:60,yYd:0}, {x:60,yYd:6} ] },
      // QB sweeps right and pitches to Z (first reverse)
      { id: "QB",   color: ROUTE_ORANGE, points: [ {x:50,yYd:-5}, {x:68,yYd:-4}, {x:74,yYd:-3} ] },
      // Z takes the pitch, runs left across the backfield, hands off to X (second reverse)
      { id: "WR-R", color: ROUTE_BLUE,   points: [ {x:80,yYd:0}, {x:76,yYd:-3}, {x:45,yYd:-4}, {x:24,yYd:-3} ] },
      // X receives the second handoff and runs around the right end upfield (final ball carrier)
      { id: "WR-L", color: ROUTE_ORANGE, points: [ {x:18,yYd:0}, {x:22,yYd:-3}, {x:55,yYd:-4}, {x:82,yYd:-2}, {x:88,yYd:8} ] },
    ],
  },
  {
    id: "qb-option",
    name: "QB Option",
    kind: "run",
    positions: {
      "WR-L": { topYd: 0,    left: 22, label: "X" },
      C:      { topYd: -0.8, left: 50, label: "C" },
      "WR-R": { topYd: 0,    left: 78, label: "Z" },
      QB:     { topYd: -3,   left: 45, label: "Q" },
      "WR-S": { topYd: -3,   left: 55, label: "Y" },
    },
    routes: [
      { id: "WR-L", color: ROUTE_BLUE,   points: [ {x:22,yYd:0}, {x:22,yYd:6} ] },
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:50,yYd:5} ] },
      { id: "WR-R", color: ROUTE_ORANGE, points: [ {x:78,yYd:0}, {x:78,yYd:6} ] },
      // QB and Y mesh, QB keeps and runs right
      { id: "QB",   color: ROUTE_GREEN,  points: [ {x:45,yYd:-3}, {x:55,yYd:-2}, {x:65,yYd:2} ] },
      { id: "WR-S", color: ROUTE_BLUE,   points: [ {x:55,yYd:-3}, {x:45,yYd:-2}, {x:35,yYd:2} ] },
    ],
  },
  {
    id: "crossbuck",
    name: "Crossbuck",
    kind: "run",
    positions: {
      "WR-L": { topYd: 0,    left: 28, label: "X" },
      C:      { topYd: -0.8, left: 50, label: "C" },
      "WR-S": { topYd: -3,   left: 45, label: "Y" },
      QB:     { topYd: -3,   left: 55, label: "Q" },
      "WR-R": { topYd: -5,   left: 60, label: "Z" },
    },
    routes: [
      { id: "WR-L", color: ROUTE_BLUE,   points: [ {x:28,yYd:0}, {x:28,yYd:6} ] },
      { id: "C",    color: ROUTE_BLACK,  points: [ {x:50,yYd:-0.8}, {x:50,yYd:5} ] },
      { id: "WR-S", color: ROUTE_GREEN,  points: [ {x:45,yYd:-3}, {x:55,yYd:1}, {x:65,yYd:5} ] },
      { id: "WR-R", color: ROUTE_ORANGE, points: [ {x:60,yYd:-5}, {x:50,yYd:-2}, {x:38,yYd:3} ] },
    ],
  },
];

const ANIMATION_DURATION = 400;

type NavigateMode = "tooltip" | "direct";

const FieldDiagram = ({
  onPositionNavigate,
  navigateMode = "tooltip",
  fullscreen = false,
  variant = "classic",
  stickyTopOffset = 0,
}: {
  onPositionNavigate?: (slug: string) => void;
  navigateMode?: NavigateMode;
  fullscreen?: boolean;
  variant?: FieldVariant;
  stickyTopOffset?: number;
} = {}) => {
  const geo = VARIANTS[variant];
  const LOS_PCT = losPct(geo);
  const YD_PCT  = ydPct(geo);
  const widthClass = fullscreen ? "w-full max-w-md mx-auto" : "w-full max-w-md mx-auto";
  const aspect = `${25}/${geo.totalLength}`;

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OffenseTabId>("formasjon");
  const [pendingTab, setPendingTab] = useState<OffenseTabId | null>(null);
  const [defenseTab, setDefenseTab] = useState<DefenseTabId>("formasjon");
  const [showRoutes, setShowRoutes] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPlayId, setSelectedPlayId] = useState<string | null>(null);

  const showPlaySelector = variant === "simple" && (activeTab === "kastespill" || activeTab === "løpespill");
  const availablePlays = activeTab === "kastespill" ? passPlays : runPlays;
  const selectedPlay = showPlaySelector ? availablePlays.find(p => p.id === selectedPlayId) ?? null : null;

  // Build offense players, applying play overrides if present
  const baseOff = baseOffense(activeTab);
  const offensePlayers = baseOff.map(p => {
    const ov = selectedPlay?.positions?.[p.id];
    if (ov) return { ...p, topYd: ov.topYd, left: ov.left, label: ov.label ?? p.label };
    return p;
  });
  const offenseAbs = offensePlayers.map(p => toAbs(p, geo));
  const offenseMap = Object.fromEntries(offenseAbs.map(p => [p.id, { top: p.top, left: p.left }]));
  const defenseAbs = defenseFor(variant).map(p => toAbs(p, geo));
  const manAssignments = getManAssignments(activeTab);

  const handleOffenseTabChange = useCallback((newTab: OffenseTabId) => {
    if (newTab === activeTab) return;
    setActiveTooltip(null);
    setShowRoutes(false);
    setPendingTab(newTab);
    setSelectedPlayId(null);
  }, [activeTab]);

  useEffect(() => {
    if (pendingTab === null) return;
    const t = setTimeout(() => {
      setActiveTab(pendingTab);
      setIsAnimating(true);
      setPendingTab(null);
      setTimeout(() => {
        setShowRoutes(true);
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    }, 150);
    return () => clearTimeout(t);
  }, [pendingTab]);

  const handlePlayChange = (id: string | null) => {
    setActiveTooltip(null);
    setShowRoutes(false);
    setTimeout(() => {
      setSelectedPlayId(id);
      setIsAnimating(true);
      setTimeout(() => {
        setShowRoutes(true);
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    }, 150);
  };

  // Convert route point (yards) to SVG viewBox coords (0..100)
  const ptToSvg = (pt: RoutePoint) => `${pt.x},${LOS_PCT - pt.yYd * YD_PCT}`;

  return (
    <div className={fullscreen ? "w-full" : "mb-0"}>
      <div className={fullscreen ? "w-full flex flex-col items-center" : "contents"}>

      {/* Defense navigator */}
      <div
        className={`${widthClass} ${fullscreen ? "sticky z-30" : ""}`}
        style={fullscreen ? { top: stickyTopOffset } : undefined}
      >
        <div className={`bg-rose-950/80 backdrop-blur-md ${fullscreen ? "border-b-0" : "border-2 border-b-0 border-rose-400/20 rounded-t-xl"} overflow-hidden`}>
          <div className="text-[10px] font-heading font-bold text-rose-300/50 tracking-widest uppercase text-center py-1 bg-rose-950/30">
            Forsvar
          </div>
          <div className="flex">
            {defenseTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setDefenseTab(tab.id); setActiveTooltip(null); }}
                className={`flex-1 py-2 text-xs font-heading font-bold tracking-wide transition-colors ${
                  defenseTab === tab.id
                    ? "bg-rose-900/40 text-rose-200/80"
                    : "bg-rose-950/30 text-rose-300/30 hover:text-rose-300/50 hover:bg-rose-950/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Field */}
      <div
        className={`relative ${widthClass} bg-emerald-800 overflow-hidden ${fullscreen ? "" : "border-2 border-t-0 border-b-0 border-emerald-600"}`}
        style={{ aspectRatio: aspect }}
        onClick={() => setActiveTooltip(null)}
      >
        {/* End zones */}
        <div
          className="absolute inset-x-0 top-0 bg-emerald-900/70 flex items-center justify-center border-b-2 border-white/40"
          style={{ height: `${(geo.endzone / geo.totalLength) * 100}%` }}
        >
          <span className="text-white/50 font-heading text-[10px] font-bold tracking-[0.3em] uppercase">Endesone</span>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 bg-emerald-900/70 flex items-center justify-center border-t-2 border-white/40"
          style={{ height: `${(geo.endzone / geo.totalLength) * 100}%` }}
        >
          <span className="text-white/50 font-heading text-[10px] font-bold tracking-[0.3em] uppercase">Endesone</span>
        </div>

        {variant === "simple" ? (
          /* Simple: classic full-field markings */
          <>
            {/* 5-yard lines across the play area (yards from bottom goal-line) */}
            {[5, 10, 15, 20, 25, 30, 35, 40, 45].map((yd) => {
              const y = ((geo.endzone + (50 - yd)) / geo.totalLength) * 100;
              return (
                <div key={`line-${yd}`} className="absolute inset-x-0 border-t border-white/25" style={{ top: `${y}%` }} />
              );
            })}
            {/* Yard numbers (left + right) — true distance from nearest goal */}
            {[
              { yd: 10, num: "10" },
              { yd: 20, num: "20" },
              { yd: 30, num: "20" },
              { yd: 40, num: "10" },
            ].map((m) => {
              const y = ((geo.endzone + (50 - m.yd)) / geo.totalLength) * 100;
              return (
                <div key={`numlabels-${m.yd}`}>
                  <div className="absolute text-white/30 font-heading font-bold text-[9px] tracking-wider pointer-events-none select-none" style={{ top: `${y}%`, left: "5%", transform: "translateY(-50%)" }}>{m.num}</div>
                  <div className="absolute text-white/30 font-heading font-bold text-[9px] tracking-wider pointer-events-none select-none" style={{ top: `${y}%`, right: "5%", transform: "translateY(-50%)" }}>{m.num}</div>
                </div>
              );
            })}
            {/* Midfield "50" label */}
            {(() => {
              const y = ((geo.endzone + 25) / geo.totalLength) * 100;
              return (
                <>
                  <div className="absolute text-white/30 font-heading font-bold text-[9px] tracking-wider pointer-events-none select-none" style={{ top: `${y}%`, left: "5%", transform: "translateY(-50%)" }}>50</div>
                  <div className="absolute text-white/30 font-heading font-bold text-[9px] tracking-wider pointer-events-none select-none" style={{ top: `${y}%`, right: "5%", transform: "translateY(-50%)" }}>50</div>
                </>
              );
            })()}
            {/* Center hash marks every 5 yards */}
            {[5, 10, 15, 20, 25, 30, 35, 40, 45].map((yd) => {
              const y = ((geo.endzone + (50 - yd)) / geo.totalLength) * 100;
              return (
                <div key={`hash-${yd}`} className="absolute left-1/2 -translate-x-1/2 w-2 h-px bg-white/40" style={{ top: `${y}%` }} />
              );
            })}
            {/* Down marker on left sideline at LOS */}
            <div className="absolute" style={{ top: `${LOS_PCT}%`, left: "0%", transform: "translate(2px, -50%)", zIndex: 2 }}>
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px] border-b-amber-300" />
                <div className="w-px h-2.5 bg-amber-300/80" />
                <div className="w-3.5 h-3.5 rounded-sm bg-amber-300 text-emerald-950 font-heading font-black text-[9px] flex items-center justify-center shadow-md">1</div>
              </div>
            </div>
          </>
        ) : null}
        {variant === "classic" ? (
          /* Classic: simple 5-yard lines across the 20yd play area */
          <>
            {[5, 10, 15].map((yd) => {
              const y = ((geo.endzone + (20 - yd)) / geo.totalLength) * 100;
              return (
                <div key={`cline-${yd}`} className="absolute inset-x-0 border-t border-white/20" style={{ top: `${y}%` }} />
              );
            })}
          </>
        ) : null}

        {/* Instruction text - just above bottom end zone */}
        <div className="absolute inset-x-0" style={{ bottom: `${(geo.endzone / geo.totalLength) * 100 + 1}%`, zIndex: 3 }}>
          <p className="text-white/30 text-[9px] text-center">Trykk på en spiller for beskrivelse</p>
        </div>

        {/* Ball — placed exactly on the LOS */}
        <svg
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${LOS_PCT}%`, left: "50%", zIndex: 1 }}
          width="11" height="18" viewBox="0 0 11 18"
        >
          <ellipse cx="5.5" cy="9" rx="5" ry="8.5" fill="#8B4513" stroke="#5C2D0A" strokeWidth="0.8" />
          <line x1="5.5" y1="1" x2="5.5" y2="17" stroke="white" strokeWidth="0.7" />
          <line x1="3.5" y1="7" x2="7.5" y2="7" stroke="white" strokeWidth="0.5" />
          <line x1="3.5" y1="9" x2="7.5" y2="9" stroke="white" strokeWidth="0.5" />
          <line x1="3.5" y1="11" x2="7.5" y2="11" stroke="white" strokeWidth="0.5" />
        </svg>

        {/* Offense players */}
        {offenseAbs.map((p) => {
          const slug = p.id === "WR-S" && activeTab === "løpespill" ? "running-back" : idToSlug[p.id];
          return (
            <AnimatedPlayerDot
              key={p.id}
              label={p.label}
              color={p.color}
              top={p.top}
              left={p.left}
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
              id={p.id}
              isAnimating={isAnimating}
              navSlug={slug}
              onPositionNavigate={onPositionNavigate}
              navigateMode={navigateMode}
            />
          );
        })}

        {/* SVG overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="arrowhead" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto" markerUnits="strokeWidth">
              <polygon points="0 0, 5 2.5, 0 5" fill="white" fillOpacity="0.6" />
            </marker>
            <marker id="arrowhead-yellow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto" markerUnits="strokeWidth">
              <polygon points="0 0, 5 2.5, 0 5" fill="#facc15" fillOpacity="0.7" />
            </marker>
            <marker id="arrowhead-green" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto" markerUnits="strokeWidth">
              <polygon points="0 0, 5 2.5, 0 5" fill="#4ade80" fillOpacity="0.8" />
            </marker>
            <marker id="arrowhead-route" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto" markerUnits="strokeWidth">
              <polygon points="0 0, 5 2.5, 0 5" fill="currentColor" />
            </marker>
          </defs>

          {/* Zone coverage */}
          {defenseTab === "soneforsvar" && Object.entries(zoneAreasYd).map(([id, z]) => (
            <ellipse key={id} cx={z.cx} cy={LOS_PCT - z.cyYd * YD_PCT} rx={z.rx} ry={z.ryYd * YD_PCT}
              fill={z.color} stroke={z.border} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          ))}

          {/* Man-to-man lines */}
          {defenseTab === "mann-mot-mann" && Object.entries(manAssignments).map(([dbId, offId]) => {
            const db = defenseAbs.find(p => p.id === dbId);
            const off = offenseMap[offId];
            if (!db || !off) return null;
            return (
              <line key={dbId} x1={db.left} y1={db.top} x2={off.left} y2={off.top}
                stroke="rgba(251,113,133,0.6)" strokeWidth="1.5" strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke" />
            );
          })}

          {/* Rush arrow — from rusher (7yd above LOS) toward ball (LOS-1yd) */}
          <line
            x1="63" y1={LOS_PCT - 7 * YD_PCT}
            x2="51" y2={LOS_PCT - 1 * YD_PCT}
            stroke="white" strokeOpacity="0.5"
            strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />

          {/* Routes */}
          <g style={{ opacity: showRoutes ? 1 : 0, transition: "opacity 0.15s ease-in-out" }}>

          {/* Selected play (simple variant) overrides default tab routes */}
          {selectedPlay ? (
            selectedPlay.routes.map((r) => (
              <polyline
                key={r.id}
                points={r.points.map(ptToSvg).join(" ")}
                fill="none" stroke={r.color} strokeOpacity="0.85"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd={`url(#arrowhead-${r.color === ROUTE_ORANGE ? "yellow" : r.color === ROUTE_GREEN ? "green" : "yellow"})`}
                style={{ color: r.color }}
                vectorEffect="non-scaling-stroke"
              />
            ))
          ) : (
            <>
              {activeTab === "kastespill" && (
                <>
                  {/* Generic kastespill arrows — yard-accurate */}
                  <polyline points={`88,${LOS_PCT} 88,${LOS_PCT - 12*YD_PCT} 70,${LOS_PCT - 18*YD_PCT}`} fill="none" stroke="#facc15" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
                  <polyline points={`72,${LOS_PCT} 72,${LOS_PCT - 10*YD_PCT} 50,${LOS_PCT - 10*YD_PCT}`} fill="none" stroke="#facc15" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
                  <polyline points={`50,${LOS_PCT - 0.8*YD_PCT} 50,${LOS_PCT - 6*YD_PCT} 42,${LOS_PCT - 6*YD_PCT}`} fill="none" stroke="#facc15" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
                  <polyline points={`12,${LOS_PCT} 12,${LOS_PCT - 8*YD_PCT} 28,${LOS_PCT - 8*YD_PCT}`} fill="none" stroke="#facc15" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
                </>
              )}

              {activeTab === "løpespill" && (
                <>
                  {/* QB hand-off + RB run */}
                  <line x1="50" y1={LOS_PCT} x2="50" y2={LOS_PCT + 3*YD_PCT} stroke="#4ade80" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <polyline points={`50,${LOS_PCT + 8*YD_PCT} 56,${LOS_PCT + 1*YD_PCT} 56,${LOS_PCT - 12*YD_PCT}`} fill="none" stroke="#4ade80" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrowhead-green)" vectorEffect="non-scaling-stroke" />
                  <polyline points={`50,${LOS_PCT} 50,${LOS_PCT - 6*YD_PCT}`} fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />
                  <polyline points={`12,${LOS_PCT} 12,${LOS_PCT - 8*YD_PCT} 6,${LOS_PCT - 10*YD_PCT}`} fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />
                  <polyline points={`88,${LOS_PCT} 88,${LOS_PCT - 8*YD_PCT} 94,${LOS_PCT - 10*YD_PCT}`} fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />
                </>
              )}
            </>
          )}
          </g>
        </svg>

        {/* Defense players */}
        {defenseAbs.map((p) => (
          <AnimatedPlayerDot
            key={p.id}
            label={p.label}
            color={p.color}
            top={p.top}
            left={p.left}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
            id={p.id}
            isAnimating={false}
            navSlug={idToSlug[p.id]}
            onPositionNavigate={onPositionNavigate}
            navigateMode={navigateMode}
          />
        ))}

        {/* Legend */}
        <div className="absolute right-3 flex flex-col gap-1" style={{ bottom: `${(geo.endzone / geo.totalLength) * 100 + 1}%` }}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            <span className="text-[10px] text-white/60 font-body">Angrep</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            <span className="text-[10px] text-white/60 font-body">Forsvar</span>
          </div>
        </div>
      </div>

      {/* Offense navigator */}
      <div className={`${widthClass} ${fullscreen ? "sticky bottom-0 z-30" : ""}`}>
        <div className={`bg-sky-950/80 backdrop-blur-md ${fullscreen ? "border-t-0" : "border-2 border-t-0 border-sky-400/20 rounded-b-xl"} overflow-hidden`}>
          <div className="flex">
            {offenseTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleOffenseTabChange(tab.id)}
                className={`flex-1 py-2 text-xs font-heading font-bold tracking-wide transition-colors ${
                  activeTab === tab.id
                    ? "bg-sky-900/40 text-sky-200/80"
                    : "bg-sky-950/30 text-sky-300/30 hover:text-sky-300/50 hover:bg-sky-950/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {showPlaySelector && (
            <div className="flex flex-wrap gap-1 px-2 py-2 bg-sky-950/50 border-t border-sky-400/10">
              <button
                onClick={() => handlePlayChange(null)}
                className={`text-[10px] font-heading font-bold px-2 py-1 rounded transition-colors ${
                  selectedPlayId === null
                    ? "bg-sky-400/30 text-sky-100"
                    : "bg-sky-950/50 text-sky-300/60 hover:text-sky-200"
                }`}
              >
                Standard
              </button>
              {availablePlays.map((play) => (
                <button
                  key={play.id}
                  onClick={() => handlePlayChange(play.id)}
                  className={`text-[10px] font-heading font-bold px-2 py-1 rounded transition-colors ${
                    selectedPlayId === play.id
                      ? "bg-sky-400/30 text-sky-100"
                      : "bg-sky-950/50 text-sky-300/60 hover:text-sky-200"
                  }`}
                >
                  {play.name}
                </button>
              ))}
            </div>
          )}
          <div className="text-[10px] font-heading font-bold text-sky-300/50 tracking-widest uppercase text-center py-1 bg-sky-950/30">
            Angrep
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

// Animated player dot
const AnimatedPlayerDot = ({
  label, color, top, left, activeTooltip, setActiveTooltip, id, isAnimating,
  navSlug, onPositionNavigate, navigateMode = "tooltip",
}: {
  label: string; color: string; top: number; left: number;
  activeTooltip: string | null; setActiveTooltip: (id: string | null) => void; id: string;
  isAnimating: boolean;
  navSlug?: string;
  onPositionNavigate?: (slug: string) => void;
  navigateMode?: NavigateMode;
}) => {
  const [pos, setPos] = useState({ top, left });
  const [displayLabel, setDisplayLabel] = useState(label);
  const [labelOpacity, setLabelOpacity] = useState(1);
  const prevPos = useRef({ top, left });
  const prevLabel = useRef(label);

  useEffect(() => {
    if (prevPos.current.top !== top || prevPos.current.left !== left) {
      prevPos.current = { top, left };
      setPos({ top, left });
    }
  }, [top, left]);

  useEffect(() => {
    if (prevLabel.current !== label) {
      setLabelOpacity(0);
      const timeout = setTimeout(() => {
        setDisplayLabel(label);
        setLabelOpacity(1);
      }, 200);
      prevLabel.current = label;
      return () => clearTimeout(timeout);
    }
  }, [label]);

  const colorMap: Record<string, string> = {
    "bg-sky-400": "#38bdf8",
    "bg-amber-400": "#fbbf24",
    "bg-rose-400": "#fb7185",
    "bg-emerald-400": "#34d399",
    "bg-orange-400": "#fb923c",
  };
  const resolvedColor = colorMap[color] || "#38bdf8";

  const isActive = activeTooltip === id;
  // Tooltip lookup uses the position abbreviation, not custom play labels (X/Y/Z/Q)
  const tooltipKey = displayLabel.length === 1
    ? ({ X: "WR", Y: "WR", Z: "WR", Q: "QB" } as Record<string, string>)[displayLabel] ?? displayLabel
    : displayLabel;
  const description = positionDescriptions[tooltipKey] || "";
  const fullName = positionFullNames[tooltipKey] || tooltipKey;
  const tooltipAlign = pos.left > 60 ? "right-0" : pos.left < 40 ? "left-0" : "left-1/2 -translate-x-1/2";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigateMode === "direct" && onPositionNavigate && navSlug) {
      onPositionNavigate(navSlug);
      setActiveTooltip(null);
      return;
    }
    setActiveTooltip(isActive ? null : id);
  };

  const handleNavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPositionNavigate && navSlug) {
      onPositionNavigate(navSlug);
      setActiveTooltip(null);
    }
  };

  return (
    <div
      className="absolute flex flex-col items-center gap-0.5 cursor-pointer"
      style={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        zIndex: isActive ? 20 : 2,
        // Center the *circle* (24px tall) on pos.top, not the circle+label group
        transform: "translate(-50%, -12px)",
        transition: "top 0.4s ease-in-out, left 0.4s ease-in-out",
      }}
      onClick={handleClick}
    >
      <div
        className={`relative w-6 h-6 rounded-full border-2 border-white/80 shadow-lg flex items-center justify-center ${isActive ? "scale-125 ring-2 ring-white/60" : "hover:scale-110"}`}
        style={{
          backgroundColor: resolvedColor,
          transition: "background-color 0.4s ease-in-out, transform 0.2s",
        }}
      />
      <span
        className="text-[10px] font-heading font-bold text-white drop-shadow-md"
        style={{ opacity: labelOpacity, transition: "opacity 0.2s ease-in-out" }}
      >
        {displayLabel}
      </span>
      {isActive && description && (
        <div className={`absolute top-full mt-1 w-52 bg-black/90 text-white text-[11px] leading-snug rounded-lg px-3 py-2 shadow-xl ${tooltipAlign}`}>
          <div className="font-bold mb-0.5">{fullName}</div>
          <div className="mb-2">{description}</div>
          {onPositionNavigate && navSlug && (
            <button
              onClick={handleNavClick}
              className="inline-flex items-center gap-1 text-[11px] font-heading font-bold text-primary hover:underline"
            >
              Les mer <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldDiagram;
