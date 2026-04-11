const SpinningFootball = () => (
  <div className="relative w-16 h-16">
    {/* Motion lines */}
    <svg className="absolute inset-0 w-full h-full animate-football-lines" viewBox="0 0 64 64" fill="none">
      <line x1="10" y1="50" x2="26" y2="38" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <line x1="6" y1="42" x2="20" y2="32" stroke="hsl(var(--muted-foreground))" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <line x1="14" y1="56" x2="28" y2="44" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
    </svg>
    {/* Football */}
    <svg className="absolute inset-0 w-full h-full animate-football-spin" viewBox="0 0 64 64" fill="none">
      <g transform="translate(38, 22) rotate(-35)">
        <ellipse cx="0" cy="0" rx="7" ry="12" fill="hsl(var(--primary))" opacity="0.8" />
        <line x1="0" y1="-8" x2="0" y2="8" stroke="hsl(var(--primary-foreground))" strokeWidth="1" opacity="0.6" />
        <line x1="-2" y1="-4" x2="2" y2="-4" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" opacity="0.6" />
        <line x1="-2" y1="-1.5" x2="2" y2="-1.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" opacity="0.6" />
        <line x1="-2" y1="1" x2="2" y2="1" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" opacity="0.6" />
        <line x1="-2" y1="3.5" x2="2" y2="3.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" opacity="0.6" />
      </g>
    </svg>
  </div>
);

export default SpinningFootball;
