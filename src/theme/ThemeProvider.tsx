import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type SiteTheme = "default" | "tuil";
const KEY = "site_theme";

type Ctx = { theme: SiteTheme; setTheme: (t: SiteTheme) => void; toggle: () => void };
const ThemeCtx = createContext<Ctx | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<SiteTheme>(
    () => (typeof window !== "undefined" && (localStorage.getItem(KEY) as SiteTheme)) || "default",
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-tuil", theme === "tuil");
    localStorage.setItem(KEY, theme);
  }, [theme]);

  const setTheme = (t: SiteTheme) => setThemeState(t);
  const toggle = () => setThemeState((t) => (t === "tuil" ? "default" : "tuil"));

  return <ThemeCtx.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeCtx.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};