import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_TOKEN_KEY } from "@/components/AdminGate";
import { Link } from "react-router-dom";
import ImagePickerField from "@/components/ImagePickerField";
import ColorPickerField from "@/components/ColorPickerField";

type Match = {
  id: string;
  kicks_off_at: string;
  venue: string | null;
  round_label: string | null;
  notes: string | null;
  home_name: string;
  home_tag: string | null;
  home_logo: string | null;
  home_color: string | null;
  home_score: number | null;
  away_name: string;
  away_tag: string | null;
  away_logo: string | null;
  away_color: string | null;
  away_score: number | null;
};

type Draft = Omit<Match, "id"> & { id?: string };

const emptyDraft = (): Draft => ({
  kicks_off_at: new Date().toISOString().slice(0, 16),
  venue: "",
  round_label: "",
  notes: "",
  home_name: "TROMSØ",
  home_tag: "FLAGGFOTBALL",
  home_logo: "",
  home_color: "#54c59e",
  home_score: null,
  away_name: "",
  away_tag: "",
  away_logo: "",
  away_color: "#fb7185",
  away_score: null,
});

const toInputDateTime = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fmtWhen = (iso: string) =>
  new Date(iso).toLocaleString("no-NO", {
    weekday: "short", day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });

const AdminMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);

  const invoke = async (action: string, extra: Record<string, unknown> = {}) => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const { data, error } = await supabase.functions.invoke("matches-admin", {
      body: { token, action, ...extra },
    });
    const status = (error as { context?: { status?: number } } | null)?.context?.status;
    if (status === 401 || data?.error === "unauthorized") {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      window.location.reload();
      throw new Error("unauthorized");
    }
    if (error) throw error;
    return data;
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await invoke("list");
      setMatches(data.matches ?? []);
    } catch {
      setError("Kunne ikke hente kamper.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload: Draft = {
      ...editing,
      kicks_off_at: new Date(editing.kicks_off_at).toISOString(),
      home_score: editing.home_score === null || editing.home_score === undefined || String(editing.home_score) === ""
        ? null : Number(editing.home_score),
      away_score: editing.away_score === null || editing.away_score === undefined || String(editing.away_score) === ""
        ? null : Number(editing.away_score),
    };
    try {
      if (editing.id) {
        await invoke("update", { id: editing.id, match: payload });
      } else {
        await invoke("create", { match: payload });
      }
      setEditing(null);
      refresh();
    } catch {
      setError("Kunne ikke lagre kampen.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Slette denne kampen?")) return;
    try {
      await invoke("delete", { id });
      refresh();
    } catch {
      setError("Kunne ikke slette.");
    }
  };

  const upcoming = useMemo(
    () => matches.filter((m) => m.home_score === null && m.away_score === null),
    [matches],
  );
  const past = useMemo(
    () => matches.filter((m) => m.home_score !== null || m.away_score !== null),
    [matches],
  );

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
        <div className="flex items-center justify-between mt-2 mb-8">
          <h1 className="font-display text-4xl">Kamper</h1>
          <button
            onClick={() => setEditing(emptyDraft())}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium hover:opacity-90"
          >
            + Ny kamp
          </button>
        </div>

        {error && <p className="mb-4 text-destructive text-sm">{error}</p>}
        {loading && <p className="text-muted-foreground">Laster …</p>}

        {!loading && (
          <>
            <Section title="Kommende" matches={upcoming} onEdit={(m) => setEditing({
              ...m, kicks_off_at: toInputDateTime(m.kicks_off_at),
            })} onDelete={remove} />
            <Section title="Ferdigspilte" matches={past} onEdit={(m) => setEditing({
              ...m, kicks_off_at: toInputDateTime(m.kicks_off_at),
            })} onDelete={remove} />
          </>
        )}

        {editing && (
          <EditorModal
            draft={editing}
            onChange={setEditing}
            onCancel={() => setEditing(null)}
            onSave={save}
          />
        )}
      </div>
    </main>
  );
};

const Section = ({
  title, matches, onEdit, onDelete,
}: {
  title: string;
  matches: Match[];
  onEdit: (m: Match) => void;
  onDelete: (id: string) => void;
}) => (
  <section className="mb-10">
    <h2 className="font-display text-xl mb-3">{title} <span className="text-muted-foreground text-sm">({matches.length})</span></h2>
    {matches.length === 0 ? (
      <p className="text-sm text-muted-foreground">Ingen kamper.</p>
    ) : (
      <ul className="divide-y divide-border rounded-lg border border-border bg-card/50">
        {matches.map((m) => (
          <li key={m.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">
                {m.home_name} <span className="text-muted-foreground">vs</span> {m.away_name}
                {(m.home_score !== null || m.away_score !== null) && (
                  <span className="ml-2 font-bold text-primary">{m.home_score ?? 0}–{m.away_score ?? 0}</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {fmtWhen(m.kicks_off_at)} {m.venue && `· ${m.venue}`} {m.round_label && `· ${m.round_label}`}
              </div>
            </div>
            <Link
              to={`/admin/make-ig-post?match=${m.id}`}
              className="text-sm px-3 py-1 rounded border border-border hover:bg-muted"
              title="Åpne i IG-editor med denne kampen forhåndslastet"
            >
              IG-post
            </Link>
            <button onClick={() => onEdit(m)} className="text-sm px-3 py-1 rounded border border-border hover:bg-muted">
              Rediger
            </button>
            <button onClick={() => onDelete(m.id)} className="text-sm px-3 py-1 rounded border border-destructive/50 text-destructive hover:bg-destructive/10">
              Slett
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);

const Field = ({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string;
  value: string | number | null;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <input
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md bg-background border border-border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </label>
);

const EditorModal = ({
  draft, onChange, onCancel, onSave,
}: {
  draft: Draft;
  onChange: (d: Draft) => void;
  onCancel: () => void;
  onSave: () => void;
}) => {
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => onChange({ ...draft, [k]: v });
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full my-8">
        <h3 className="font-display text-2xl mb-4">{draft.id ? "Rediger kamp" : "Ny kamp"}</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tid (lokal)" type="datetime-local" value={draft.kicks_off_at}
                 onChange={(v) => set("kicks_off_at", v)} />
          <Field label="Sted" value={draft.venue} onChange={(v) => set("venue", v)} />
          <Field label="Runde/serieinfo" value={draft.round_label}
                 onChange={(v) => set("round_label", v)} placeholder="RUNDE 04 · LØRDAG" />
          <Field label="Notat (internt)" value={draft.notes} onChange={(v) => set("notes", v)} />

          <div className="col-span-2 mt-2 text-xs font-bold uppercase text-muted-foreground">Hjemmelag</div>
          <Field label="Navn" value={draft.home_name} onChange={(v) => set("home_name", v)} />
          <Field label="Undertekst" value={draft.home_tag} onChange={(v) => set("home_tag", v)} />
          <ImagePickerField label="Logo" value={draft.home_logo} onChange={(v) => set("home_logo", v)} />
          <ColorPickerField label="Farge" value={draft.home_color} onChange={(v) => set("home_color", v)} />
          <Field label="Score (blank = ikke spilt)" type="number" value={draft.home_score}
                 onChange={(v) => set("home_score", v === "" ? null : Number(v))} />

          <div className="col-span-2 mt-2 text-xs font-bold uppercase text-muted-foreground">Bortelag</div>
          <Field label="Navn" value={draft.away_name} onChange={(v) => set("away_name", v)} />
          <Field label="Undertekst" value={draft.away_tag} onChange={(v) => set("away_tag", v)} />
          <ImagePickerField label="Logo" value={draft.away_logo} onChange={(v) => set("away_logo", v)} />
          <ColorPickerField label="Farge" value={draft.away_color} onChange={(v) => set("away_color", v)} />
          <Field label="Score" type="number" value={draft.away_score}
                 onChange={(v) => set("away_score", v === "" ? null : Number(v))} />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} className="px-4 py-2 rounded border border-border hover:bg-muted">
            Avbryt
          </button>
          <button onClick={onSave} className="px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:opacity-90">
            Lagre
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMatches;