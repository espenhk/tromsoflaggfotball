import { useState, useEffect, useRef, useCallback } from "react";

const positionFullNames: Record<string, string> = {
  QB: "QB – Quarterback",
  C: "C – Center",
  WR: "WR – Wide Receiver",
  RB: "RB – Running Back",
  R: "R – Rusher",
  DB: "DB – Defensive Back",
};

const positionDescriptions: Record<string, string> = {
  QB: "Lagets playmaker og leder på banen. Kaster ballen til medspillere og styrer spillet.",
  C: "Starter hvert spill ved å snappe ballen til QB. Går deretter ut som mottaker eller blokkerer rusheren.",
  WR: "Løper ruter og fanger pasninger fra QB. Målet er å bli fri fra forsvareren og ta imot ballen.",
  RB: "Tar imot ballen fra QB og løper med den. Kan også brukes som mottaker på korte pasninger.",
  R: "Starter 7 yards fra ballen med hånden i året. Kan rushe mot QB så fort de klarer etter snap. Laget kan ha 0–2 rushere per spill.",
  DB: "Dekker motstanderens mottakere. Hindrer pasninger og drar flagget til ballbæreren.",
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
  { id: "mann-mot-mann", label: "Mann-mot-mann" },
];

const zoneAreas: Record<string, { cx: number; cy: number; rx: number; ry: number; color: string; border: string }> = {
  "DB-L": { cx: 15, cy: 35, rx: 16, ry: 12, color: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.4)" },
  "DB-R": { cx: 85, cy: 35, rx: 16, ry: 12, color: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.4)" },
  "DB-SA": { cx: 38, cy: 24, rx: 16, ry: 12, color: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.4)" },
  "DB-S": { cx: 68, cy: 20, rx: 16, ry: 12, color: "rgba(192,132,252,0.15)", border: "rgba(192,132,252,0.4)" },
};

type PlayerPosition = { top: number; left: number; label: string; color: string; id: string };

// WR-S is the slot WR that becomes RB in løpespill — same id so it animates
const getOffensePlayers = (tab: OffenseTabId): PlayerPosition[] => {
  const c: PlayerPosition = { top: 57, left: 50, label: "C", color: "bg-sky-400", id: "C" };

  if (tab === "løpespill") {
    return [
      c,
      { top: 63, left: 50, label: "QB", color: "bg-amber-400", id: "QB" },
      // WR-S moves down to become RB
      { top: 72, left: 50, label: "RB", color: "bg-emerald-400", id: "WR-S" },
      { top: 52, left: 15, label: "WR", color: "bg-sky-400", id: "WR-L" },
      { top: 52, left: 85, label: "WR", color: "bg-sky-400", id: "WR-R" },
    ];
  }
  if (tab === "kastespill") {
    return [
      c,
      { top: 68, left: 50, label: "QB", color: "bg-amber-400", id: "QB" },
      { top: 52, left: 30, label: "WR", color: "bg-sky-400", id: "WR-L" },
      { top: 52, left: 85, label: "WR", color: "bg-sky-400", id: "WR-R" },
      { top: 58, left: 72, label: "WR", color: "bg-sky-400", id: "WR-S" },
    ];
  }
  // formasjon
  return [
    c,
    { top: 68, left: 50, label: "QB", color: "bg-amber-400", id: "QB" },
    { top: 52, left: 15, label: "WR", color: "bg-sky-400", id: "WR-L" },
    { top: 52, left: 85, label: "WR", color: "bg-sky-400", id: "WR-R" },
    { top: 58, left: 72, label: "WR", color: "bg-sky-400", id: "WR-S" },
  ];
};

const defensePlayersBase: PlayerPosition[] = [
  { top: 36, left: 63, label: "R", color: "bg-rose-400", id: "R" },
  { top: 38, left: 15, label: "DB", color: "bg-rose-400", id: "DB-L" },
  { top: 38, left: 85, label: "DB", color: "bg-rose-400", id: "DB-R" },
  { top: 22, left: 65, label: "DB", color: "bg-rose-400", id: "DB-S" },
  { top: 27, left: 40, label: "DB", color: "bg-rose-400", id: "DB-SA" },
];

const getManAssignments = (tab: OffenseTabId): Record<string, string> => {
  if (tab === "løpespill") {
    return { "DB-L": "WR-L", "DB-SA": "C", "DB-S": "WR-S", "DB-R": "WR-R" };
  }
  return { "DB-L": "WR-L", "DB-SA": "C", "DB-S": "WR-S", "DB-R": "WR-R" };
};

const ANIMATION_DURATION = 400;

const FieldDiagram = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OffenseTabId>("formasjon");
  const [defenseTab, setDefenseTab] = useState<DefenseTabId>("formasjon");
  const [showArrows, setShowArrows] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTabRef = useRef<OffenseTabId>(activeTab);

  const offensePlayers = getOffensePlayers(activeTab);
  const offenseMap = Object.fromEntries(offensePlayers.map(p => [p.id, { top: p.top, left: p.left }]));
  const manAssignments = getManAssignments(activeTab);

  const handleOffenseTabChange = useCallback((newTab: OffenseTabId) => {
    if (newTab === activeTab) return;
    setActiveTooltip(null);
    setShowArrows(false);
    setIsAnimating(true);
    setActiveTab(newTab);
    prevTabRef.current = newTab;
    setTimeout(() => {
      setShowArrows(true);
      setIsAnimating(false);
    }, ANIMATION_DURATION);
  }, [activeTab]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8">
      <h3 className="font-heading text-sm font-bold text-muted-foreground mb-4 text-center">
        Oppstilling – 5 mot 5
      </h3>
      <p className="text-xs text-muted-foreground text-center mb-3">Trykk på en spiller for beskrivelse</p>

      {/* Defense navigator */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-rose-950/30 border-2 border-b-0 border-rose-400/20 rounded-t-xl overflow-hidden">
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
        className="relative w-full max-w-md mx-auto aspect-[3/4] bg-emerald-800 overflow-hidden border-2 border-t-0 border-b-0 border-emerald-600"
        onClick={() => setActiveTooltip(null)}
      >
        {/* Field lines */}
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/30" />
        <div className="absolute inset-x-0 top-[15%] border-t-2 border-white/20" />
        <div className="absolute inset-x-0 bottom-[15%] border-t-2 border-white/20" />

        {/* End zones */}
        <div className="absolute inset-x-0 top-0 h-[15%] bg-emerald-900/60 flex items-center justify-center">
          <span className="text-white/40 font-heading text-xs font-bold tracking-widest uppercase">Endesone</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[15%] bg-emerald-900/60 flex items-center justify-center">
          <span className="text-white/40 font-heading text-xs font-bold tracking-widest uppercase">Endesone</span>
        </div>

        {/* Ball */}
        <svg
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ top: "51%", left: "50%", zIndex: 1 }}
          width="11" height="18" viewBox="0 0 11 18"
        >
          <ellipse cx="5.5" cy="9" rx="5" ry="8.5" fill="#8B4513" stroke="#5C2D0A" strokeWidth="0.8" />
          <line x1="5.5" y1="1" x2="5.5" y2="17" stroke="white" strokeWidth="0.7" />
          <line x1="3.5" y1="7" x2="7.5" y2="7" stroke="white" strokeWidth="0.5" />
          <line x1="3.5" y1="9" x2="7.5" y2="9" stroke="white" strokeWidth="0.5" />
          <line x1="3.5" y1="11" x2="7.5" y2="11" stroke="white" strokeWidth="0.5" />
        </svg>

        {/* Offense players */}
        {offensePlayers.map((p) => (
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
          />
        ))}

        {/* SVG overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            zIndex: 1,
            opacity: showArrows ? 1 : 0,
            transition: "opacity 0.25s ease-in-out",
          }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="white" fillOpacity="0.6" />
            </marker>
            <marker id="arrowhead-yellow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#facc15" fillOpacity="0.7" />
            </marker>
            <marker id="arrowhead-green" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
              <polygon points="0 0, 6 2.5, 0 5" fill="#4ade80" fillOpacity="0.8" />
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

          {/* Rush arrow */}
          <line x1="63" y1="36" x2="51" y2="63" stroke="white" strokeOpacity="0.5"
            strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />

          {/* Kastespill routes */}
          {activeTab === "kastespill" && (
            <>
              <polyline points="85,52 85,38 60,22" fill="none" stroke="#facc15" strokeOpacity="0.6"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
              <polyline points="72,58 72,36 45,36" fill="none" stroke="#facc15" strokeOpacity="0.6"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
              <polyline points="50,57 50,46 46,50" fill="none" stroke="#facc15" strokeOpacity="0.6"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
              <polyline points="30,52 30,40 12,40" fill="none" stroke="#facc15" strokeOpacity="0.6"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-yellow)" vectorEffect="non-scaling-stroke" />
            </>
          )}

          {/* Løpespill routes */}
          {activeTab === "løpespill" && (
            <>
              <line x1="50" y1="63" x2="52" y2="68" stroke="#4ade80" strokeOpacity="0.6"
                strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <polyline points="50,72 56,62 56,30" fill="none" stroke="#4ade80" strokeOpacity="0.7"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead-green)" vectorEffect="non-scaling-stroke" />
              <polyline points="50,57 50,48" fill="none" stroke="white" strokeOpacity="0.5"
                strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrowhead)"
                vectorEffect="non-scaling-stroke" />
              <polyline points="15,52 15,40 6,34" fill="none" stroke="white" strokeOpacity="0.4"
                strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />
              <polyline points="85,52 85,40 94,34" fill="none" stroke="white" strokeOpacity="0.4"
                strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                markerEnd="url(#arrowhead)" vectorEffect="non-scaling-stroke" />
            </>
          )}
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
      <div className="w-full max-w-md mx-auto">
        <div className="bg-sky-950/30 border-2 border-t-0 border-sky-400/20 rounded-b-xl overflow-hidden">
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
}: {
  label: string; color: string; top: number; left: number;
  activeTooltip: string | null; setActiveTooltip: (id: string | null) => void; id: string;
  isAnimating: boolean;
}) => {
  const [pos, setPos] = useState({ top, left });
  const [displayLabel, setDisplayLabel] = useState(label);
  const [labelOpacity, setLabelOpacity] = useState(1);
  const [dotColor, setDotColor] = useState(color);
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
      // Fade out old label, swap, fade in new label
      setLabelOpacity(0);
      const timeout = setTimeout(() => {
        setDisplayLabel(label);
        setDotColor(color);
        setLabelOpacity(1);
      }, 200);
      prevLabel.current = label;
      return () => clearTimeout(timeout);
    } else {
      setDotColor(color);
    }
  }, [label, color]);

  const isActive = activeTooltip === id;
  const description = positionDescriptions[displayLabel] || "";
  const fullName = positionFullNames[displayLabel] || displayLabel;
  const tooltipAlign = pos.left > 60 ? "right-0" : pos.left < 40 ? "left-0" : "left-1/2 -translate-x-1/2";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 cursor-pointer"
      style={{
        top: `${pos.top}%`,
        left: `${pos.left}%`,
        zIndex: isActive ? 20 : 2,
        transition: "top 0.4s ease-in-out, left 0.4s ease-in-out",
      }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveTooltip(isActive ? null : id);
      }}
    >
      <div
        className={`w-6 h-6 rounded-full ${dotColor} border-2 border-white/80 shadow-lg transition-all duration-200 ${isActive ? "scale-125 ring-2 ring-white/60" : "hover:scale-110"}`}
      />
      <span
        className="text-[10px] font-heading font-bold text-white drop-shadow-md"
        style={{ opacity: labelOpacity, transition: "opacity 0.2s ease-in-out" }}
      >
        {displayLabel}
      </span>
      {isActive && description && (
        <div className={`absolute top-full mt-1 w-48 bg-black/90 text-white text-[11px] leading-snug rounded-lg px-3 py-2 shadow-xl ${tooltipAlign}`}>
          <div className="font-bold mb-0.5">{fullName}</div>
          {description}
        </div>
      )}
    </div>
  );
};

export default FieldDiagram;
