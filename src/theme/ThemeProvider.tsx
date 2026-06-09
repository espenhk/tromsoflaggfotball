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
  /** 0 = pre-reveal/default. 1 = header red sweep + logos fade out.
   *  2 = blue drops, body theme swaps to TUIL, hero shows only «FLAGGFOTBALL».
   *  3 = hero logo pops with halo, TUIL wordmark fades in above the title.
   *  4 = header + footer logos fade back in. */
  revealStage: 0 | 1 | 2 | 3 | 4;
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
  const [revealStage, setRevealStage] = useState<0 | 1 | 2 | 3 | 4>(0);
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
    setRevealActive(true);
    const timers: number[] = [];
    // Stage 1 — header red sweep, nav font swap, logos fade out
    timers.push(window.setTimeout(() => setRevealStage(1), 650));
    // Stage 2 — blue panel slides down from below the top bar; theme swaps
    // once the panel has fully covered the page underneath.
    timers.push(window.setTimeout(() => setRevealStage(2), 1650));
    timers.push(window.setTimeout(() => setEffectiveTheme("tuil"), 1650 + 700));
    // Stage 3 — panel fades out while hero logo pops and TUIL wordmark fades in
    timers.push(window.setTimeout(() => setRevealStage(3), 2950));
    // Stage 4 — header + footer logos fade back in
    timers.push(window.setTimeout(() => setRevealStage(4), 3700));
    timers.push(window.setTimeout(() => setRevealActive(false), 4600));
    (window as any).__themeRevealTimers = timers;
    return () => timers.forEach((id) => window.clearTimeout(id));
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
        revealStage,
      }}
    >
      {children}
      {revealActive && selectedTheme === "tuil" && revealStage >= 2 && revealStage < 4 && (
        <div
          aria-hidden
          className="pointer-events-none fixed left-0 right-0 bottom-0 z-[9998] overflow-hidden"
          style={{ top: "56px" }}
        >
          <div className="reveal-blue-drop" />
        </div>
      )}
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};