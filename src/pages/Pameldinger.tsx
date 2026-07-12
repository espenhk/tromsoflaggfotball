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

type Recipient = {
  id: string;
  email: string;
  active: boolean;
  created_at: string;
};

const Pameldinger = () => {
  const token = sessionStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
  const [signups, setSignups] = useState<Signup[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [recipientBusy, setRecipientBusy] = useState(false);
  const [recipientError, setRecipientError] = useState<string | null>(null);

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

  const loadRecipients = async () => {
    const { data, error } = await supabase.functions.invoke("list-signups", {
      body: { token, action: "list_recipients" },
    });
    if (error) throw error;
    setRecipients((data?.recipients as Recipient[]) ?? []);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Promise.all([loadSignups(), loadRecipients()]);
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

  const addRecipient = async () => {
    const email = newEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setRecipientError("Ugyldig e-postadresse");
      return;
    }
    setRecipientBusy(true);
    setRecipientError(null);
    try {
      const { error } = await supabase.functions.invoke("list-signups", {
        body: { token, action: "add_recipient", email },
      });
      if (error) throw error;
      setNewEmail("");
      await loadRecipients();
    } catch {
      setRecipientError("Kunne ikke legge til mottaker");
    } finally {
      setRecipientBusy(false);
    }
  };

  const toggleRecipient = async (r: Recipient) => {
    setRecipientBusy(true);
    try {
      await supabase.functions.invoke("list-signups", {
        body: { token, action: "toggle_recipient", id: r.id, active: !r.active },
      });
      await loadRecipients();
    } finally {
      setRecipientBusy(false);
    }
  };

  const removeRecipient = async (r: Recipient) => {
    if (!confirm(`Fjerne ${r.email} fra varslings­lista?`)) return;
    setRecipientBusy(true);
    try {
      await supabase.functions.invoke("list-signups", {
        body: { token, action: "delete_recipient", id: r.id },
      });
      await loadRecipients();
    } finally {
      setRecipientBusy(false);
    }
  };

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

        <section className="mb-10 rounded-lg border border-border bg-card/50 p-5">
          <h2 className="font-display text-lg mb-1">E-postvarsling</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Disse adressene får e-post når noen fyller ut interesseskjemaet på
            forsiden. Slå av for å pause en mottaker uten å slette.
          </p>
          <div className="space-y-2 mb-4">
            {recipients.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Ingen mottakere. Legg til minst én adresse.
              </p>
            )}
            {recipients.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 px-3 py-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={r.active}
                    disabled={recipientBusy}
                    onChange={() => toggleRecipient(r)}
                    className="accent-primary"
                    aria-label={r.active ? "Aktiv" : "Pauset"}
                  />
                  <span
                    className={`truncate text-sm ${r.active ? "" : "text-muted-foreground line-through"}`}
                  >
                    {r.email}
                  </span>
                </div>
                <button
                  onClick={() => removeRecipient(r)}
                  disabled={recipientBusy}
                  className="rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                >
                  Fjern
                </button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="ny@epost.no"
              className="flex-1 min-w-[220px] rounded-md bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={addRecipient}
              disabled={recipientBusy || !newEmail.trim()}
              className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-medium hover:opacity-90 disabled:opacity-40"
            >
              Legg til
            </button>
          </div>
          {recipientError && (
            <p className="mt-2 text-sm text-destructive">{recipientError}</p>
          )}
        </section>

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