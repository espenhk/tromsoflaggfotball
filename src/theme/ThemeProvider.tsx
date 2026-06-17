import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteTheme = "default" | "tuil";
const KEY = "site_theme";          // cached copy of the global theme (for fast first paint)
const REVEAL_KEY = "site_reveal_mode"; // cached copy of the global reveal flag
const REVEAL_DONE_KEY = "site_reveal_done";

type Ctx = {
  /** Currently displayed theme (may differ from selectedTheme during reveal). */
  theme: SiteTheme;
  /** The theme the admin has chosen — synced from the backend for all visitors. */
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

  // Sync the globally-configured theme from the backend. The local
  // localStorage value is only a fast-paint cache — the source of truth is
  // public.site_settings. Subscribes to realtime so the admin's toggle
  // updates every open tab live.
  useEffect(() => {
    let cancelled = false;
    const applyFromRow = (row: { theme?: string | null; reveal_mode?: boolean | null } | null) => {
      if (!row || cancelled) return;
      const t: SiteTheme = row.theme === "tuil" ? "tuil" : "default";
      const r = !!row.reveal_mode;
      setSelectedTheme((prev) => {
        if (prev === t) return prev;
        // If the reveal has not yet been triggered this mount we let the
        // reveal effect handle the swap. Otherwise update effectiveTheme too.
        if (didTriggerReveal.current) setEffectiveTheme(t);
        return t;
      });
      setRevealModeState(r);
    };
    supabase
      .from("site_settings")
      .select("theme, reveal_mode")
      .eq("id", "global")
      .maybeSingle()
      .then(({ data }) => applyFromRow(data as any));
    const channel = supabase
      .channel("site_settings_global")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings", filter: "id=eq.global" },
        (payload) => applyFromRow((payload.new ?? null) as any),
      )
      .subscribe();
    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  // One-shot reveal animation on initial mount when conditions are met.
  useEffect(() => {
    if (didTriggerReveal.current) return;
    if (!(revealMode && selectedTheme === "tuil" && effectiveTheme === "default")) return;
    // Only ever play the reveal once per browser. After it has run, the
    // user simply lands on the TUIL theme directly without the animation.
    if (typeof window !== "undefined" && localStorage.getItem(REVEAL_DONE_KEY) === "1") {
      didTriggerReveal.current = true;
      setEffectiveTheme("tuil");
      return;
    }
    // Only ever fire the reveal on the front page.
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      didTriggerReveal.current = true;
      setEffectiveTheme("tuil");
      return;
    }
    didTriggerReveal.current = true;
    // Pre-warm the TUIL display font (Inter @ 800 / 700) so the «TUIL»
    // hero wordmark doesn't render in a fallback weight first and then
    // pop to its real weight halfway through the reveal.
    const startReveal = () => {
      setRevealActive(true);
      scheduleStages();
    };
    const timers: number[] = [];
    const scheduleStages = () => {
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
    timers.push(window.setTimeout(() => {
      setRevealActive(false);
      try { localStorage.setItem(REVEAL_DONE_KEY, "1"); } catch {}
    }, 4600));
    };
    if (typeof document !== "undefined" && (document as any).fonts?.load) {
      Promise.all([
        (document as any).fonts.load('800 1em "Neue Haas Grotesk Display Pro"'),
        (document as any).fonts.load('700 1em "Neue Haas Grotesk Display Pro"'),
        (document as any).fonts.load('800 1em Inter'),
        (document as any).fonts.load('700 1em Inter'),
      ]).catch(() => {}).finally(startReveal);
    } else {
      startReveal();
    }
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