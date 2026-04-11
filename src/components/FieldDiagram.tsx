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

        {/* Animated route line for slot WR (slant route) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          {/* Slant route path: slot WR runs forward then cuts inside */}
          <path
            d="M 216 232 L 216 180 L 150 140"
            fill="none"
            stroke="rgba(56,189,248,0.6)"
            strokeWidth="2.5"
            strokeDasharray="8 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="60"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
          {/* Arrow head */}
          <polygon
            points="150,140 158,150 148,152"
            fill="rgba(56,189,248,0.6)"
            className="animate-pulse"
          />
        </svg>

        {/* Route label */}
        <div className="absolute text-[9px] text-sky-300/70 font-heading font-bold" style={{ top: '38%', left: '38%' }}>
          Slant
        </div>

        {/* OFFENSE (bottom half, attacking upward) */}
        <PlayerDot label="C" color="bg-sky-400" top="55%" left="50%" />
        <PlayerDot label="QB" color="bg-amber-400" top="65%" left="50%" />
        <PlayerDot label="WR" color="bg-sky-400" top="52%" left="15%" />
        <PlayerDot label="WR" color="bg-sky-400" top="52%" left="85%" />
        <PlayerDot label="WR" color="bg-sky-400" top="58%" left="72%" highlight />

        {/* DEFENSE (top half) */}
        <PlayerDot label="R" color="bg-rose-400" top="43%" left="50%" />
        <PlayerDot label="DB" color="bg-rose-400" top="38%" left="15%" />
        <PlayerDot label="DB" color="bg-rose-400" top="38%" left="85%" />
        <PlayerDot label="DB" color="bg-rose-400" top="35%" left="60%" />
        <PlayerDot label="DB" color="bg-rose-400" top="27%" left="40%" />

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
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 border border-dashed border-sky-400/60 rounded-full inline-block" style={{ width: 8, height: 8 }} />
            <span className="text-[10px] text-white/60 font-body">Løpsrute</span>
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
  highlight,
}: {
  label: string;
  color: string;
  top: string;
  left: string;
  highlight?: boolean;
}) => (
  <div
    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
    style={{ top, left }}
  >
    <div
      className={`w-6 h-6 rounded-full ${color} border-2 border-white/80 shadow-lg ${
        highlight ? 'ring-2 ring-sky-300/60 ring-offset-1 ring-offset-emerald-800 animate-pulse' : ''
      }`}
    />
    <span className="text-[10px] font-heading font-bold text-white drop-shadow-md">
      {label}
    </span>
  </div>
);

export default FieldDiagram;
