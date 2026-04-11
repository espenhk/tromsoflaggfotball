const SpinningFootball = () => (
  <div className="w-16 h-16 flex items-center justify-center">
    <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
      <g transform="translate(20, 20) rotate(-40)">
        <g className="origin-center animate-football-spin">
          <ellipse cx="0" cy="0" rx="6" ry="11" fill="hsl(var(--primary))" opacity="0.8" />
          <line x1="0" y1="-7.5" x2="0" y2="7.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" opacity="0.5" />
          <line x1="-1.8" y1="-3.5" x2="1.8" y2="-3.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.7" opacity="0.5" />
          <line x1="-1.8" y1="-1.2" x2="1.8" y2="-1.2" stroke="hsl(var(--primary-foreground))" strokeWidth="0.7" opacity="0.5" />
          <line x1="-1.8" y1="1.2" x2="1.8" y2="1.2" stroke="hsl(var(--primary-foreground))" strokeWidth="0.7" opacity="0.5" />
          <line x1="-1.8" y1="3.5" x2="1.8" y2="3.5" stroke="hsl(var(--primary-foreground))" strokeWidth="0.7" opacity="0.5" />
        </g>
      </g>
    </svg>
  </div>
);

export default SpinningFootball;
