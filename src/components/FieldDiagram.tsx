import { useState } from "react";

const positionDescriptions: Record<string, string> = {
  QB: "Lagets playmaker og leder på banen. Kaster ballen til medspillere og styrer spillet.",

  C: "Starter hvert spill ved å snappe ballen til QB. Går deretter ut som mottaker eller blokkerer rusheren.",
  WR: "Løper ruter og fanger pasninger fra QB. Målet er å bli fri fra forsvareren og ta imot ballen.",
  R: "Starter 7 yards fra ballen med hånden i været. Kan rushe mot QB så fort de klarer etter snap. Laget kan ha 0–2 rushere per spill.",
  DB: "Dekker motstanderens mottakere. Hindrer pasninger og drar flagget til ballbæreren.",
};

const FieldDiagram = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8">
      <h3 className="font-heading text-sm font-bold text-muted-foreground mb-4 text-center">
        Oppstilling – 5 mot 5
      </h3>
      <p className="text-xs text-muted-foreground text-center mb-3">Trykk på en spiller for beskrivelse</p>
      <div
        className="relative w-full max-w-md mx-auto aspect-[3/4] bg-emerald-800 rounded-xl overflow-hidden border-2 border-emerald-600"
        onClick={() => setActiveTooltip(null)}
      >
        {/* Field lines */}
        <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-white/30" />
        <div className="absolute inset-x-0 top-[15%] border-t-2 border-white/20" />
        <div className="absolute inset-x-0 bottom-[15%] border-t-2 border-white/20" />

        {/* End zones */}
        <div className="absolute inset-x-0 top-0 h-[15%] bg-emerald-900/60 flex items-center justify-center">
          <span className="text-white/40 font-heading text-xs font-bold tracking-widest uppercase">
            Endesone
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[15%] bg-emerald-900/60 flex items-center justify-center">
          <span className="text-white/40 font-heading text-xs font-bold tracking-widest uppercase">
            Endesone
          </span>
        </div>

        {/* Ball icon in front of Center */}
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

        {/* OFFENSE */}
        <PlayerDot label="C" color="bg-sky-400" top="57%" left="50%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="C" />
        <PlayerDot label="QB" color="bg-amber-400" top="68%" left="50%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="QB" />
        <PlayerDot label="WR" color="bg-sky-400" top="52%" left="15%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="WR-L" />
        <PlayerDot label="WR" color="bg-sky-400" top="52%" left="85%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="WR-R" />
        <PlayerDot label="WR" color="bg-sky-400" top="58%" left="72%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="WR-S" />

        {/* Dashed arrow from R to QB */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="white" fillOpacity="0.6" />
            </marker>
          </defs>
          <line
            x1="58%" y1="38%"
            x2="51%" y2="61%"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeDasharray="6 4"
            markerEnd="url(#arrowhead)"
          />
        </svg>

        {/* DEFENSE */}
        <PlayerDot label="R" color="bg-rose-400" top="36%" left="58%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="R" />
        <PlayerDot label="DB" color="bg-rose-400" top="38%" left="15%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="DB-L" />
        <PlayerDot label="DB" color="bg-rose-400" top="38%" left="85%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="DB-R" />
        <PlayerDot label="DB" color="bg-rose-400" top="28%" left="65%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="DB-S" />
        <PlayerDot label="DB" color="bg-rose-400" top="27%" left="40%" activeTooltip={activeTooltip} setActiveTooltip={setActiveTooltip} id="DB-SA" />

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
    </div>
  );
};

const PlayerDot = ({
  label,
  color,
  top,
  left,
  activeTooltip,
  setActiveTooltip,
  id,
}: {
  label: string;
  color: string;
  top: string;
  left: string;
  activeTooltip: string | null;
  setActiveTooltip: (id: string | null) => void;
  id: string;
}) => {
  const isActive = activeTooltip === id;
  const description = positionDescriptions[label] || "";
  // Determine if tooltip should go left (for dots on right side)
  const leftNum = parseFloat(left);
  const tooltipAlign = leftNum > 60 ? "right-0" : leftNum < 40 ? "left-0" : "left-1/2 -translate-x-1/2";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 cursor-pointer"
      style={{ top, left, zIndex: isActive ? 20 : 2 }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveTooltip(isActive ? null : id);
      }}
    >
      <div className={`w-6 h-6 rounded-full ${color} border-2 border-white/80 shadow-lg transition-transform ${isActive ? "scale-125 ring-2 ring-white/60" : "hover:scale-110"}`} />
      <span className="text-[10px] font-heading font-bold text-white drop-shadow-md">
        {label}
      </span>
      {isActive && description && (
        <div className={`absolute top-full mt-1 w-44 bg-black/90 text-white text-[11px] leading-snug rounded-lg px-3 py-2 shadow-xl ${tooltipAlign}`}>
          <div className="font-bold mb-0.5">{label}</div>
          {description}
        </div>
      )}
    </div>
  );
};

export default FieldDiagram;
