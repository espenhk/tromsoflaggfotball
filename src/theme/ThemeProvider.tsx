import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

export type SiteTheme = "default" | "tuil";
const KEY = "site_theme";
const REVEAL_KEY = "site_reveal_mode";

type Ctx = {
  /** Currently displayed theme (may differ from selectedTheme during reveal). */
  theme: SiteTheme;
  /** The theme the admin has chosen — persists across reloads. */
  selectedTheme: SiteTheme;
  setTheme: (t: SiteTheme) => void;
  toggle: () => void;
  revealMode: boolean;
  setRevealMode: (v: boolean) => void;
  /** True while the reveal animation is playing. */
  revealActive: boolean;
};
const ThemeCtx = createContext<Ctx | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTheme, setSelectedTheme] = useState<SiteTheme>(
    () => (typeof window !== "undefined" && (localStorage.getItem(KEY) as SiteTheme)) || "default",
  );
  const [revealMode, setRevealModeState] = useState<boolean>(
    () => typeof window !== "undefined" && localStorage.getItem(REVEAL_KEY) === "1",
  );
  // effectiveTheme starts as "default" when revealMode + tuil are both on, so
  // the first paint shows the original palette before the animated reveal.
  const [effectiveTheme, setEffectiveTheme] = useState<SiteTheme>(() =>
    revealMode && selectedTheme === "tuil" ? "default" : selectedTheme,
  );
  const [revealActive, setRevealActive] = useState(false);
  const didTriggerReveal = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-tuil", effectiveTheme === "tuil");
  }, [effectiveTheme]);

  useEffect(() => {
    localStorage.setItem(KEY, selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    localStorage.setItem(REVEAL_KEY, revealMode ? "1" : "0");
  }, [revealMode]);

  // One-shot reveal animation on initial mount when conditions are met.
  useEffect(() => {
    if (didTriggerReveal.current) return;
    if (!(revealMode && selectedTheme === "tuil" && effectiveTheme === "default")) return;
    didTriggerReveal.current = true;
    const root = document.documentElement;
    // Small delay so the user sees the original colors first.
    const tHold = window.setTimeout(() => {
      setRevealActive(true);
      root.classList.add("theme-transitioning");
      // After the wipe sweeps in, flip the underlying theme variables.
      const tFlip = window.setTimeout(() => setEffectiveTheme("tuil"), 700);
      const tEnd = window.setTimeout(() => {
        setRevealActive(false);
        root.classList.remove("theme-transitioning");
      }, 2400);
      (window as any).__themeRevealTimers = [tFlip, tEnd];
    }, 600);
    return () => {
      window.clearTimeout(tHold);
      const timers: number[] = (window as any).__themeRevealTimers || [];
      timers.forEach((id) => window.clearTimeout(id));
      root.classList.remove("theme-transitioning");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = (t: SiteTheme) => {
    setSelectedTheme(t);
    setEffectiveTheme(t);
  };
  const toggle = () => setTheme(selectedTheme === "tuil" ? "default" : "tuil");
  const setRevealMode = (v: boolean) => setRevealModeState(v);

  return (
    <ThemeCtx.Provider
      value={{
        theme: effectiveTheme,
        selectedTheme,
        setTheme,
        toggle,
        revealMode,
        setRevealMode,
        revealActive,
      }}
    >
      {children}
      {revealActive && <RevealOverlay toTuil={selectedTheme === "tuil"} />}
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

/* ============================================================
   Reveal overlay — a brief cinematic flourish that plays once
   while the palette transitions from "default" to "tuil".
   ============================================================ */
const RevealOverlay = ({ toTuil }: { toTuil: boolean }) => {
  if (!toTuil) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Expanding red ink-drop */}
      <div className="theme-reveal-ink" />
      {/* Bright flash sweep */}
      <div className="theme-reveal-flash" />
      {/* Diagonal red shimmer */}
      <div className="theme-reveal-sweep" />
    </div>
  );
};