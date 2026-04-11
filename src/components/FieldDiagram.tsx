const FieldDiagram = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8">
      <h3 className="font-heading text-sm font-bold text-muted-foreground mb-4 text-center">
        Oppstilling – 5 mot 5
      </h3>
      <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-emerald-800 rounded-xl overflow-hidden border-2 border-emerald-600">
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

        {/* Scrimmage line label */}
        <div className="absolute left-2 top-[48%] text-[10px] text-white/40 font-body">
          Scrimmage
        </div>

        {/* OFFENSE (bottom half, attacking upward) */}
        {/* Center */}
        <PlayerDot
          label="C"
          color="bg-sky-400"
          top="55%"
          left="50%"
        />
        {/* QB */}
        <PlayerDot
          label="QB"
          color="bg-amber-400"
          top="65%"
          left="50%"
        />
        {/* WR left */}
        <PlayerDot
          label="WR"
          color="bg-sky-400"
          top="52%"
          left="15%"
        />
        {/* WR right */}
        <PlayerDot
          label="WR"
          color="bg-sky-400"
          top="52%"
          left="85%"
        />
        {/* WR slot */}
        <PlayerDot
          label="WR"
          color="bg-sky-400"
          top="58%"
          left="72%"
        />

        {/* Dashed arrow from R to QB */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="white" fillOpacity="0.6" />
            </marker>
          </defs>
          <line
            x1="58%" y1="38%"
            x2="51%" y2="58%"
            stroke="white"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeDasharray="6 4"
            markerEnd="url(#arrowhead)"
          />
        </svg>

        {/* DEFENSE (top half) */}
        {/* Rusher */}
        <PlayerDot
          label="R"
          color="bg-rose-400"
          top="36%"
          left="58%"
        />
        {/* DB left */}
        <PlayerDot
          label="DB"
          color="bg-rose-400"
          top="38%"
          left="15%"
        />
        {/* DB right */}
        <PlayerDot
          label="DB"
          color="bg-rose-400"
          top="38%"
          left="85%"
        />
        {/* DB slot */}
        <PlayerDot
          label="DB"
          color="bg-rose-400"
          top="28%"
          left="65%"
        />
        {/* DB safety */}
        <PlayerDot
          label="DB"
          color="bg-rose-400"
          top="27%"
          left="40%"
        />

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
}: {
  label: string;
  color: string;
  top: string;
  left: string;
}) => (
  <div
    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
    style={{ top, left }}
  >
    <div className={`w-6 h-6 rounded-full ${color} border-2 border-white/80 shadow-lg`} />
    <span className="text-[10px] font-heading font-bold text-white drop-shadow-md">
      {label}
    </span>
  </div>
);

export default FieldDiagram;
