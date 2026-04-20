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

// Field constants — vertical 25 yd wide × 70 yd tall (50 yd play + 2× 10 yd endzones)
// Bottom endzone: 85.71%–100%; top endzone: 0%–14.29%; midfield: 50%
// Ball on offense's own 5-yd line: 85.71 - (5/70)*100 = 78.57
const LOS = 78.57;
const RUSHER_Y = 68.57; // 7 yards beyond ball: LOS - (7/70)*100

const zoneAreas: Record<string, { cx: number; cy: number; rx: number; ry: number; color: string; border: string }> = {
  "DB-L": { cx: 18, cy: LOS - 12, rx: 16, ry: 8, color: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.4)" },
  "DB-R": { cx: 82, cy: LOS - 12, rx: 16, ry: 8, color: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.4)" },
  "DB-SA": { cx: 38, cy: LOS - 18, rx: 16, ry: 8, color: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.4)" },
  "DB-S": { cx: 65, cy: LOS - 22, rx: 16, ry: 8, color: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.4)" },
};

type PlayerPosition = { top: number; left: number; label: string; color: string; id: string };

// WR-S is the slot WR that becomes RB in løpespill — same id so it animates
const getOffensePlayers = (tab: OffenseTabId): PlayerPosition[] => {
  const c: PlayerPosition = { top: LOS, left: 50, label: "C", color: "bg-sky-400", id: "C" };

  if (tab === "løpespill") {
    return [
      c,
      { top: LOS + 5, left: 50, label: "QB", color: "bg-amber-400", id: "QB" },
      { top: LOS + 12, left: 50, label: "RB", color: "bg-emerald-400", id: "WR-S" },
      { top: LOS - 5, left: 15, label: "WR", color: "bg-sky-400", id: "WR-L" },
      { top: LOS - 5, left: 85, label: "WR", color: "bg-sky-400", id: "WR-R" },
    ];
  }
  if (tab === "kastespill") {
    return [
      c,
      { top: LOS + 8, left: 50, label: "QB", color: "bg-amber-400", id: "QB" },
      { top: LOS - 5, left: 30, label: "WR", color: "bg-sky-400", id: "WR-L" },
      { top: LOS - 5, left: 85, label: "WR", color: "bg-sky-400", id: "WR-R" },
      { top: LOS - 1, left: 72, label: "WR", color: "bg-sky-400", id: "WR-S" },
    ];
  }
  return [
    c,
    { top: LOS + 8, left: 50, label: "QB", color: "bg-amber-400", id: "QB" },
    { top: LOS - 5, left: 15, label: "WR", color: "bg-sky-400", id: "WR-L" },
    { top: LOS - 5, left: 85, label: "WR", color: "bg-sky-400", id: "WR-R" },
    { top: LOS - 1, left: 72, label: "WR", color: "bg-sky-400", id: "WR-S" },
  ];
};

const defensePlayersBase: PlayerPosition[] = [
  { top: RUSHER_Y, left: 63, label: "R", color: "bg-orange-400", id: "R" },
  { top: LOS - 12, left: 18, label: "DB", color: "bg-rose-400", id: "DB-L" },
  { top: LOS - 12, left: 82, label: "DB", color: "bg-rose-400", id: "DB-R" },
  { top: LOS - 22, left: 65, label: "S", color: "bg-rose-400", id: "DB-S" },
  { top: LOS - 18, left: 38, label: "S", color: "bg-rose-400", id: "DB-SA" },
];

const getManAssignments = (_tab: OffenseTabId): Record<string, string> => {
  return { "DB-L": "WR-L", "DB-SA": "C", "DB-S": "WR-S", "DB-R": "WR-R" };
};

const ANIMATION_DURATION = 400;

type NavigateMode = "tooltip" | "direct";

const FieldDiagram = ({
  onPositionNavigate,
  navigateMode = "tooltip",
  fullscreen = false,
}: {
  onPositionNavigate?: (slug: string) => void;
  navigateMode?: NavigateMode;
  fullscreen?: boolean;
} = {}) => {
  // Width class applied to the navigator bars and field — full-bleed in fullscreen mode
  const widthClass = fullscreen ? "w-full max-w-none" : "w-full max-w-md mx-auto";
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OffenseTabId>("formasjon");
  const [pendingTab, setPendingTab] = useState<OffenseTabId | null>(null);
  const [defenseTab, setDefenseTab] = useState<DefenseTabId>("formasjon");
  const [showRoutes, setShowRoutes] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const offensePlayers = getOffensePlayers(activeTab);
  const offenseMap = Object.fromEntries(offensePlayers.map(p => [p.id, { top: p.top, left: p.left }]));
  const manAssignments = getManAssignments(activeTab);

  const handleOffenseTabChange = useCallback((newTab: OffenseTabId) => {
    if (newTab === activeTab) return;
    setActiveTooltip(null);
    // 1. Immediately hide route arrows (not rush arrow)
    setShowRoutes(false);
    setPendingTab(newTab);
  }, [activeTab]);

  // 2. Once routes are hidden, switch tab to move dots
  useEffect(() => {
    if (pendingTab === null) return;
    const t = setTimeout(() => {
      setActiveTab(pendingTab);
      setIsAnimating(true);
      setPendingTab(null);
      // 3. After dots finish moving, show new routes
      setTimeout(() => {
        setShowRoutes(true);
        setIsAnimating(false);
      }, ANIMATION_DURATION);
    }, 150); // short delay for route fade-out
    return () => clearTimeout(t);
  }, [pendingTab]);

  return (
    <div className={fullscreen ? "h-full flex flex-col" : "mb-0"}>

      {/* Defense navigator */}
      <div className={widthClass}>
        <div className={`bg-rose-950/30 ${fullscreen ? "border-b-0" : "border-2 border-b-0 border-rose-400/20 rounded-t-xl"} overflow-hidden`}>
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

      {/* Field — vertical 25w × 70h yards. Aspect 25:70 ≈ 0.357 */}
      <div
        className={`relative ${widthClass} ${fullscreen ? "flex-1 min-h-0" : "aspect-[25/70]"} bg-emerald-800 overflow-hidden ${fullscreen ? "" : "border-2 border-t-0 border-b-0 border-emerald-600"}`}
        onClick={() => setActiveTooltip(null)}
      >
        {/* End zones (10 yd each = 14.29% of 70yd field) */}
        <div className="absolute inset-x-0 top-0 h-[14.29%] bg-emerald-900/70 flex items-center justify-center border-b-2 border-white/40">
          <span className="text-white/50 font-heading text-xs font-bold tracking-[0.3em] uppercase rotate-180" style={{ writingMode: "vertical-rl" }}>Endesone</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[14.29%] bg-emerald-900/70 flex items-center justify-center border-t-2 border-white/40">
          <span className="text-white/50 font-heading text-xs font-bold tracking-[0.3em] uppercase" style={{ writingMode: "vertical-rl" }}>Endesone</span>
        </div>

        {/* Yard lines every 5 yards (excluding endzone borders & midfield) */}
        {[78.57, 71.43, 64.29, 57.14, 42.86, 35.71, 28.57, 21.43].map((y) => (
          <div key={y} className="absolute inset-x-0 border-t border-white/25" style={{ top: `${y}%` }} />
        ))}
        {/* Midfield dashed */}
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/40" />

        {/* Yard numbers — left and right side */}
        {[
          { y: 71.43, num: "10" },
          { y: 57.14, num: "20" },
          { y: 42.86, num: "30" },
          { y: 28.57, num: "20" },
          { y: 14.4, num: "10" },
        ].map((m) => (
          <div key={`num-l-${m.y}`} className="absolute text-white/30 font-heading font-bold text-[9px] tracking-wider pointer-events-none select-none" style={{ top: `${m.y}%`, left: "5%", transform: "translateY(-50%)" }}>
            {m.num}
          </div>
        ))}
        {[
          { y: 71.43, num: "10" },
          { y: 57.14, num: "20" },
          { y: 42.86, num: "30" },
          { y: 28.57, num: "20" },
          { y: 14.4, num: "10" },
        ].map((m) => (
          <div key={`num-r-${m.y}`} className="absolute text-white/30 font-heading font-bold text-[9px] tracking-wider pointer-events-none select-none" style={{ top: `${m.y}%`, right: "5%", transform: "translateY(-50%)" }}>
            {m.num}
          </div>
        ))}

        {/* Hash marks down the middle every 5 yards */}
        {[78.57, 71.43, 64.29, 57.14, 50, 42.86, 35.71, 28.57, 21.43].map((y) => (
          <div key={`hash-${y}`} className="absolute left-1/2 -translate-x-1/2 w-2 h-px bg-white/40" style={{ top: `${y}%` }} />
        ))}

        {/* Down marker — left sideline at midfield */}
        <div className="absolute" style={{ top: "50%", left: "0%", transform: "translate(2px, -50%)", zIndex: 2 }}>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px] border-b-amber-300" />
            <div className="w-px h-2.5 bg-amber-300/80" />
            <div className="w-3.5 h-3.5 rounded-sm bg-amber-300 text-emerald-950 font-heading font-black text-[9px] flex items-center justify-center shadow-md">
              1
            </div>
          </div>
        </div>

        {/* Instruction text - just above bottom end zone */}
        <div className="absolute inset-x-0" style={{ bottom: "16%", zIndex: 3 }}>
          <p className="text-white/30 text-[9px] text-center">Trykk på en spiller for beskrivelse</p>
        </div>

        {/* Ball — placed exactly on the LOS (5-yard line at 78.57%) */}
        <svg
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${LOS}%`, left: "50%", zIndex: 1 }}
          width="11" height="18" viewBox="0 0 11 18"
        >
          <ellipse cx="5.5" cy="9" rx="5" ry="8.5" fill="#8B4513" stroke="#5C2D0A" strokeWidth="0.8" />
          <line x1="5.5" y1="1" x2="5.5" y2="17" stroke="white" strokeWidth="0.7" />
          <line x1="3.5" y1="7" x2="7.5" y2="7" stroke="white" strokeWidth="0.5" />
          <line x1="3.5" y1="9" x2="7.5" y2="9" stroke="white" strokeWidth="0.5" />
          <line x1="3.5" y1="11" x2="7.5" y2="11" stroke="white" strokeWidth="0.5" />
        </svg>

        {/* Offense players */}
        {offensePlayers.map((p) => {
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

        {/* SVG overlay - always visible (rush arrow, zones, man-to-man) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto" markerUnits="userSpaceOnUse">
              <polygon points="0 0, 4 2, 0 4" fill="white" fillOpacity="0.6" />
            </marker>
            <marker id="arrowhead-yellow" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto" markerUnits="userSpaceOnUse">
              <polygon points="0 0, 4 2, 0 4" fill="#facc15" fillOpacity="0.7" />
            </marker>
            <marker id="arrowhead-green" markerWidth="4" markerHeight="4" refX="4" refY="2" orient="auto" markerUnits="userSpaceOnUse">
              <polygon points="0 0, 4 2, 0 4" fill="#4ade80" fillOpacity="0.8" />
            </marker>
          </defs>

          {/* Zone coverage */}
          {defenseTab === "soneforsvar" && Object.entries(zoneAreas).map(([id, z]) => (
            <ellipse key={id} cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
              fill={z.color} stroke={z.border} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          ))}

          {/* Man-to-man lines */}
          {defenseTab === "mann-mot-mann" && Object.entries(manAssignments).map(([dbId, offId]) => {
            const db = defensePlayersBase.find(p => p.id === dbId);
            const off = offenseMap[offId];
            if (!db || !off) return null;
            return (
              <line key={dbId} x1={db.left} y1={db.top} x2={off.left} y2={off.top}
                stroke="rgba(251,113,133,0.6)" strokeWidth="1.5" strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke" />
            );
          })}

          {/* Rush arrow — from rusher (RUSHER_Y) toward ball (LOS) */}
          <line x1="63" y1={RUSHER_Y} x2="51" y2={LOS - 1} stroke="white" strokeOpacity="0.5"
            strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />

          {/* Route arrows - fade in/out */}
          <g style={{ opacity: showRoutes ? 1 : 0, transition: "opacity 0.15s ease-in-out" }}>

          {activeTab === "kastespill" && (
            <>
              <polyline points={`85,${LOS - 5} 85,${LOS - 20} 60,${LOS - 30}`} fill="none" stroke="#facc15" strokeOpacity="0.6"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
              <polyline points={`72,${LOS - 1} 72,${LOS - 18} 45,${LOS - 18}`} fill="none" stroke="#facc15" strokeOpacity="0.6"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
              <polyline points={`50,${LOS} 50,${LOS - 10} 40,${LOS - 8}`} fill="none" stroke="#facc15" strokeOpacity="0.6"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
              <polyline points={`30,${LOS - 5} 30,${LOS - 15} 12,${LOS - 15}`} fill="none" stroke="#facc15" strokeOpacity="0.6"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
            </>
          )}

          {activeTab === "løpespill" && (
            <>
              <line x1="50" y1={LOS} x2="50" y2={LOS + 4} stroke="#4ade80" strokeOpacity="0.6"
                strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <polyline points={`50,${LOS + 12} 56,${LOS + 2} 56,${LOS - 30}`} fill="none" stroke="#4ade80" strokeOpacity="0.7"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-green)" vectorEffect="non-scaling-stroke" />
              <polyline points={`50,${LOS} 50,${LOS - 8}`} fill="none" stroke="white" strokeOpacity="0.5"
                strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrowhead)"
                vectorEffect="non-scaling-stroke" />
              <polyline points={`15,${LOS - 5} 15,${LOS - 15} 6,${LOS - 20}`} fill="none" stroke="white" strokeOpacity="0.4"
                strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />
              <polyline points={`85,${LOS - 5} 85,${LOS - 15} 94,${LOS - 20}`} fill="none" stroke="white" strokeOpacity="0.4"
                strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />
            </>
          )}
          </g>
        </svg>

        {/* Defense players */}
        {defensePlayersBase.map((p) => (
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
        <div className="absolute bottom-[17%] left-3 flex flex-col gap-1">
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
      <div className={widthClass}>
        <div className={`bg-sky-950/30 ${fullscreen ? "border-t-0" : "border-2 border-t-0 border-sky-400/20 rounded-b-xl"} overflow-hidden`}>
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
          <div className="text-[10px] font-heading font-bold text-sky-300/50 tracking-widest uppercase text-center py-1 bg-sky-950/30">
            Angrep
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated player dot that transitions smoothly when position changes
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
  const description = positionDescriptions[displayLabel] || "";
  const fullName = positionFullNames[displayLabel] || displayLabel;
  const tooltipAlign = pos.left > 60 ? "right-0" : pos.left < 40 ? "left-0" : "left-1/2 -translate-x-1/2";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Direct mode: single click navigates immediately (used on /posisjoner)
    if (navigateMode === "direct" && onPositionNavigate && navSlug) {
      onPositionNavigate(navSlug);
      setActiveTooltip(null);
      return;
    }
    // Tooltip mode (default): toggle tooltip; navigation happens via "Les mer" link inside it
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
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 cursor-pointer"
      style={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        zIndex: isActive ? 20 : 2,
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
