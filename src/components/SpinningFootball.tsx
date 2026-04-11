const SpinningFootball = () => {
  const frames = [
    // Frame 0: laces facing viewer
    <g key={0}>
      <ellipse cx="20" cy="20" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
      <line x1="20" y1="12.5" x2="20" y2="27.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" opacity="0.5" />
      <line x1="18.2" y1="14.5" x2="21.8" y2="14.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.7" opacity="0.5" />
      <line x1="18.2" y1="17" x2="21.8" y2="17" stroke="hsl(var(--primary-foreground))" strokeWidth="0.7" opacity="0.5" />
      <line x1="18.2" y1="19.5" x2="21.8" y2="19.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.7" opacity="0.5" />
      <line x1="18.2" y1="22" x2="21.8" y2="22" stroke="hsl(var(--primary-foreground))" strokeWidth="0.7" opacity="0.5" />
    </g>,
    // Frame 1: laces rotating right
    <g key={1}>
      <ellipse cx="20" cy="20" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
      <path d="M23 12.5 Q24 20 23 27.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" fill="none" opacity="0.4" />
      <line x1="22" y1="14.5" x2="24.5" y2="15" stroke="hsl(var(--primary-foreground))" strokeWidth="0.6" opacity="0.35" />
      <line x1="22.5" y1="17" x2="24.8" y2="17.3" stroke="hsl(var(--primary-foreground))" strokeWidth="0.6" opacity="0.35" />
      <line x1="22.5" y1="19.5" x2="24.8" y2="19.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.6" opacity="0.35" />
      <line x1="22" y1="22" x2="24.5" y2="22.3" stroke="hsl(var(--primary-foreground))" strokeWidth="0.6" opacity="0.35" />
    </g>,
    // Frame 2: laces at edge
    <g key={2}>
      <ellipse cx="20" cy="20" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
      <path d="M25.5 14 Q26 20 25.5 26" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" fill="none" opacity="0.2" />
    </g>,
    // Frame 3: plain ball (laces on back)
    <g key={3}>
      <ellipse cx="20" cy="20" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
    </g>,
    // Frame 4: still on back
    <g key={4}>
      <ellipse cx="20" cy="20" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
    </g>,
    // Frame 5: laces coming from left edge
    <g key={5}>
      <ellipse cx="20" cy="20" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
      <path d="M14.5 14 Q14 20 14.5 26" stroke="hsl(var(--primary-foreground))" strokeWidth="0.5" fill="none" opacity="0.2" />
    </g>,
    // Frame 6: laces rotating back from left
    <g key={6}>
      <ellipse cx="20" cy="20" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
      <path d="M17 12.5 Q16 20 17 27.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" fill="none" opacity="0.4" />
      <line x1="15.5" y1="15" x2="18" y2="14.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.6" opacity="0.35" />
      <line x1="15.2" y1="17.3" x2="17.5" y2="17" stroke="hsl(var(--primary-foreground))" strokeWidth="0.6" opacity="0.35" />
      <line x1="15.2" y1="19.5" x2="17.5" y2="19.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.6" opacity="0.35" />
      <line x1="15.5" y1="22.3" x2="18" y2="22" stroke="hsl(var(--primary-foreground))" strokeWidth="0.6" opacity="0.35" />
    </g>,
    // Frame 7: almost back to front
    <g key={7}>
      <ellipse cx="20" cy="20" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
      <line x1="19" y1="12.5" x2="19" y2="27.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" opacity="0.45" />
      <line x1="17.5" y1="14.5" x2="20.5" y2="14.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.65" opacity="0.4" />
      <line x1="17.5" y1="17" x2="20.5" y2="17" stroke="hsl(var(--primary-foreground))" strokeWidth="0.65" opacity="0.4" />
      <line x1="17.5" y1="19.5" x2="20.5" y2="19.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.65" opacity="0.4" />
      <line x1="17.5" y1="22" x2="20.5" y2="22" stroke="hsl(var(--primary-foreground))" strokeWidth="0.65" opacity="0.4" />
    </g>,
  ];

  return (
    <div className="w-14 h-14">
      <svg viewBox="0 0 40 40" className="w-full h-full" style={{ transform: "rotate(40deg)" }}>
        {frames.map((frame, i) => (
          <g key={i} opacity="0" className="animate-football-frame" style={{ animationDelay: `${i * 200}ms` }}>
            {frame}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default SpinningFootball;
