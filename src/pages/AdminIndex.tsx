import { Link } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@/theme/ThemeProvider";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_TOKEN_KEY } from "@/components/AdminGate";

const links = [
  {
    to: "/admin/pameldinger",
    title: "Påmeldinger",
    description: "Se og administrer interessemeldinger fra påmeldingsskjemaet.",
  },
  {
    to: "/admin/make-ig-post",
    title: "Instagram-poster",
    description: "Lag bilder med klubbens ramme for Instagram.",
  },
  {
    to: "/admin/training-plans",
    title: "Treningsplaner",
    description: "Treningsopplegg og øvelser for alle aldersgrupper.",
  },
  {
    to: "/admin/matches",
    title: "Kamper",
    description: "Registrer kommende og ferdigspilte kamper. Brukes til Instagram-poster.",
  },
  {
    to: "/admin/sosialt-mock",
    title: "Sosialt (mockup)",
    description: "Forhåndsvisning av sosiale medier-feeden.",
  },
];

const AdminIndex = () => {
  const { selectedTheme, revealMode } = useTheme();
  const theme = selectedTheme;
  const [saving, setSaving] = useState<null | "theme" | "reveal">(null);
  const [error, setError] = useState<string | null>(null);

  const pushSettings = async (
    patch: { theme?: "default" | "tuil"; reveal_mode?: boolean },
    kind: "theme" | "reveal",
  ) => {
    setSaving(kind);
    setError(null);
    try {
      const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
      const { data, error } = await supabase.functions.invoke("site-settings", {
        body: { token, ...patch },
      });
      const status = (error as { context?: { status?: number } } | null)?.context?.status;
      if (status === 401 || data?.error === "unauthorized") {
        // Session token expired — clear it and re-prompt for the admin password.
        sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        window.location.reload();
        return;
      }
      if (error || !data?.ok) throw new Error("save failed");
    } catch {
      setError("Kunne ikke lagre. Prøv på nytt.");
    } finally {
      setSaving(null);
    }
  };

  const setTheme = (t: "default" | "tuil") => pushSettings({ theme: t }, "theme");
  const setRevealMode = (v: boolean) => pushSettings({ reveal_mode: v }, "reveal");
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl mb-2">Admin</h1>
        <p className="text-muted-foreground mb-10">Interne verktøy for trenerne.</p>

        <div className="mb-10 rounded-lg border border-border bg-card/50 p-5">
          <h2 className="font-display text-lg mb-1">Visuell profil</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Bytt mellom dagens profil og en TUIL-inspirert variant. Valget gjelder for alle besøkende.
          </p>
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setTheme("default")}
              disabled={saving !== null}
              className={`px-4 py-2 text-sm font-medium transition ${
                theme === "default"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground hover:bg-muted"
              } disabled:opacity-60`}
            >
              Tromsø Flaggfotball
            </button>
            <button
              type="button"
              onClick={() => setTheme("tuil")}
              disabled={saving !== null}
              className={`px-4 py-2 text-sm font-medium transition border-l border-border ${
                theme === "tuil"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground hover:bg-muted"
              } disabled:opacity-60`}
            >
              TUIL
            </button>
          </div>

          <label
            className={`mt-5 flex items-start gap-3 rounded-md border p-3 transition cursor-pointer ${
              theme === "tuil"
                ? "border-border hover:border-primary/60"
                : "border-border/60 opacity-60 cursor-not-allowed"
            }`}
          >
            <input
              type="checkbox"
              checked={revealMode}
              disabled={theme !== "tuil" || saving !== null}
              onChange={(e) => setRevealMode(e.target.checked)}
              className="mt-1 accent-primary"
            />
            <div>
              <div className="text-sm font-medium">Reveal-modus på forsiden</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Forsiden lastes med original profil og overgår med en animert effekt
                til TUIL-profilen. Hver besøkende ser animasjonen kun én gang.
                Krever at TUIL-profilen er valgt.
              </p>
            </div>
          </label>
          {error && <p className="mt-3 text-destructive text-sm">{error}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block rounded-lg border border-border bg-card/50 p-5 transition hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
            >
              <h2 className="font-display text-xl mb-1">{l.title}</h2>
              <p className="text-sm text-muted-foreground">{l.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminIndex;