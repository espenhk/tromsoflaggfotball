import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Signup = {
  id: string;
  name: string;
  contact: string;
  age_group: string | null;
  message: string | null;
  preferred_date: string | null;
  language: string;
  created_at: string;
};

const Pameldinger = () => {
  const [password, setPassword] = useState("");
  const [signups, setSignups] = useState<Signup[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("list-signups", {
        body: { password },
      });
      if (error) throw error;
      if (!data?.signups) throw new Error("Feil passord");
      setSignups(data.signups as Signup[]);
    } catch (err: any) {
      setError("Feil passord eller serverfeil");
      setSignups(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl mb-8">Påmeldinger</h1>

        {!signups && (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passord"
              className="flex-1 rounded-md bg-card border border-border px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-5 py-2 text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "..." : "Logg inn"}
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-destructive">{error}</p>}

        {signups && (
          <div className="mt-6">
            <p className="text-muted-foreground mb-4">{signups.length} påmeldinger</p>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr className="text-left">
                    <th className="px-4 py-3">Tidspunkt</th>
                    <th className="px-4 py-3">Navn</th>
                    <th className="px-4 py-3">Kontakt</th>
                    <th className="px-4 py-3">Aldersgruppe</th>
                    <th className="px-4 py-3">Foretrukket dato</th>
                    <th className="px-4 py-3">Melding</th>
                    <th className="px-4 py-3">Språk</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.map((s) => (
                    <tr key={s.id} className="border-t border-border align-top">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {new Date(s.created_at).toLocaleString("no-NO")}
                      </td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3">{s.contact}</td>
                      <td className="px-4 py-3">{s.age_group ?? "—"}</td>
                      <td className="px-4 py-3">{s.preferred_date ?? "—"}</td>
                      <td className="px-4 py-3 max-w-md whitespace-pre-wrap">{s.message ?? "—"}</td>
                      <td className="px-4 py-3 uppercase text-xs text-muted-foreground">{s.language}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Pameldinger;