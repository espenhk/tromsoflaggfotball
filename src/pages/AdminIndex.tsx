import { Link } from "react-router-dom";
import { useTheme } from "@/theme/ThemeProvider";

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
];

const AdminIndex = () => {
  const { theme, setTheme } = useTheme();
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl mb-2">Admin</h1>
        <p className="text-muted-foreground mb-10">Interne verktøy for trenerne.</p>

        <div className="mb-10 rounded-lg border border-border bg-card/50 p-5">
          <h2 className="font-display text-lg mb-1">Visuell profil</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Bytt mellom dagens profil og en TUIL-inspirert variant. Valget lagres i nettleseren.
          </p>
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setTheme("default")}
              className={`px-4 py-2 text-sm font-medium transition ${
                theme === "default"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground hover:bg-muted"
              }`}
            >
              Tromsø Flaggfotball
            </button>
            <button
              type="button"
              onClick={() => setTheme("tuil")}
              className={`px-4 py-2 text-sm font-medium transition border-l border-border ${
                theme === "tuil"
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent text-foreground hover:bg-muted"
              }`}
            >
              TUIL
            </button>
          </div>
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