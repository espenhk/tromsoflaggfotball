import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_TOKEN_KEY } from "@/components/AdminGate";

type Signup = {
  id: string;
  name: string;
  contact: string;
  age_group: string | null;
  message: string | null;
  preferred_date: string | null;
  language: string;
  created_at: string;
  coach_notes: string | null;
};

const Pameldinger = () => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
  const [signups, setSignups] = useState<Signup[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadSignups = async () => {
    const { data, error } = await supabase.functions.invoke("list-signups", {
      body: { token },
    });
    if (error) throw error;
    if (!data?.signups) throw new Error("Feil passord");
    const list = data.signups as Signup[];
    setSignups(list);
    setNoteDrafts(
      Object.fromEntries(list.map((s) => [s.id, s.coach_notes ?? ""])),
    );
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadSignups();
      } catch {
        if (!cancelled) setError("Kunne ikke laste påmeldinger");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveNote = async (id: string) => {
    setSavingId(id);
    try {
      const { error } = await supabase.functions.invoke("list-signups", {
        body: {
          token,
          action: "update_notes",
          id,
          coach_notes: noteDrafts[id] ?? "",
        },
      });
      if (error) throw error;
      setSignups((prev) =>
        prev
          ? prev.map((s) =>
              s.id === id ? { ...s, coach_notes: noteDrafts[id] ?? "" } : s,
            )
          : prev,
      );
    } catch {
      setError("Kunne ikke lagre notat");
    } finally {
      setSavingId(null);
    }
  };

  const deleteSignup = async (id: string, name: string) => {
    if (!confirm(`Slette påmelding fra ${name}? Dette kan ikke angres.`)) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.functions.invoke("list-signups", {
        body: { token, action: "delete", id },
      });
      if (error) throw error;
      setSignups((prev) => (prev ? prev.filter((s) => s.id !== id) : prev));
    } catch {
      setError("Kunne ikke slette");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl mb-8">Påmeldinger</h1>

        {loading && <p className="text-muted-foreground">Laster...</p>}

        {error && <p className="mt-4 text-destructive">{error}</p>}

        {signups && (
          <div className="mt-6">
            <p className="text-muted-foreground mb-4">{signups.length} påmeldinger</p>
            <div className="space-y-4">
              {signups.map((s) => {
                const draft = noteDrafts[s.id] ?? "";
                const dirty = draft !== (s.coach_notes ?? "");
                return (
                  <div
                    key={s.id}
                    className="rounded-lg border border-border bg-card/50 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="font-display text-xl">{s.name}</h2>
                          <span className="text-xs uppercase text-muted-foreground">
                            {s.language}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(s.created_at).toLocaleString("no-NO")}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSignup(s.id, s.name)}
                        disabled={deletingId === s.id}
                        className="rounded-md border border-destructive/40 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        {deletingId === s.id ? "Sletter..." : "Slett"}
                      </button>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                      <div>
                        <dt className="text-muted-foreground">Kontakt</dt>
                        <dd>{s.contact}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Aldersgruppe</dt>
                        <dd>{s.age_group ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Foretrukket dato</dt>
                        <dd>{s.preferred_date ?? "—"}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-muted-foreground">Melding</dt>
                        <dd className="whitespace-pre-wrap">{s.message ?? "—"}</dd>
                      </div>
                    </dl>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Coach-notater (delt mellom trenere)
                      </label>
                      <textarea
                        value={draft}
                        onChange={(e) =>
                          setNoteDrafts((d) => ({ ...d, [s.id]: e.target.value }))
                        }
                        placeholder="F.eks. 'Svart på e-post 03.06 – /Espen'"
                        rows={3}
                        maxLength={4000}
                        className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => saveNote(s.id)}
                          disabled={!dirty || savingId === s.id}
                          className="rounded-md bg-primary px-4 py-1.5 text-sm text-primary-foreground font-medium hover:opacity-90 disabled:opacity-40"
                        >
                          {savingId === s.id ? "Lagrer..." : dirty ? "Lagre notat" : "Lagret"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Pameldinger;