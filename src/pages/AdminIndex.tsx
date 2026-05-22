import { Link } from "react-router-dom";

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
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl mb-2">Admin</h1>
        <p className="text-muted-foreground mb-10">Interne verktøy for trenerne.</p>

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