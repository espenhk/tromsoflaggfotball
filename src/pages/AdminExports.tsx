import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  IgExportEntry,
  IgExportPayload,
  deleteIgExport,
  getIgExport,
  listIgExports,
  renameIgExport,
  slugifyFilename,
} from "@/lib/igExports";
import { IgRenderer, downloadDataUrl } from "@/lib/igRenderer";

const fmtDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("nb-NO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const ASPECTS = [
  { value: "__all__", label: "Alle format" },
  { value: "square", label: "Kvadrat (1:1)" },
  { value: "portrait", label: "Portrett (4:5)" },
  { value: "story", label: "Story (9:16)" },
];

const AdminExports = () => {
  const [entries, setEntries] = useState<IgExportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [template, setTemplate] = useState("__all__");
  const [aspect, setAspect] = useState("__all__");
  const [sort, setSort] = useState("date-desc");
  const [selected, setSelected] = useState<string[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);

  const payloadCache = useRef(new Map<string, IgExportPayload>());
  const rendererRef = useRef<IgRenderer | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setEntries(await listIgExports());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunne ikke hente eksportloggen");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    supabase
      .from("site_settings")
      .select("theme")
      .eq("id", "global")
      .maybeSingle()
      .then(({ data }) => setTheme((data?.theme as string | undefined) ?? "default"));
  }, []);

  useEffect(() => {
    if (theme === null) return;
    rendererRef.current = new IgRenderer(theme);
    return () => {
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [theme]);

  const templates = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => (e.templates ?? []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = entries.slice();
    if (template !== "__all__") {
      list = list.filter((e) => Array.isArray(e.templates) && e.templates.includes(template));
    }
    if (aspect !== "__all__") {
      list = list.filter((e) => (e.aspect || "square") === aspect);
    }
    if (needle) {
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(needle) ||
          (e.templates ?? []).some((t) => t.toLowerCase().includes(needle)) ||
          (e.caption ?? "").toLowerCase().includes(needle),
      );
    }
    list.sort((a, b) => {
      if (sort === "date-asc") return a.created_at.localeCompare(b.created_at);
      if (sort === "name-asc") return a.name.localeCompare(b.name, "nb");
      if (sort === "name-desc") return b.name.localeCompare(a.name, "nb");
      return b.created_at.localeCompare(a.created_at);
    });
    return list;
  }, [entries, q, template, aspect, sort]);

  const loadPayload = async (id: string) => {
    const cached = payloadCache.current.get(id);
    if (cached) return cached;
    const entry = await getIgExport(id);
    const payload = (entry.payload ?? {}) as IgExportPayload;
    payloadCache.current.set(id, payload);
    return payload;
  };

  // Render thumbnails for the currently visible entries, one at a time.
  useEffect(() => {
    let cancelled = false;
    const ids = filtered.slice(0, 60).map((e) => e.id);
    (async () => {
      for (const id of ids) {
        if (cancelled) return;
        if (thumbs[id]) continue;
        try {
          const payload = await loadPayload(id);
          if (cancelled || !rendererRef.current) return;
          const url = await rendererRef.current.render(payload, 0);
          if (cancelled) return;
          setThumbs((t) => ({ ...t, [id]: url }));
        } catch {
          if (!cancelled) setThumbs((t) => ({ ...t, [id]: "" }));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, theme]);

  const downloadEntry = async (entry: IgExportEntry) => {
    setBusy(entry.id);
    try {
      const payload = await loadPayload(entry.id);
      const slides = payload.slides ?? [];
      const base = slugifyFilename(entry.name);
      for (let i = 0; i < slides.length; i++) {
        const url = await rendererRef.current!.render(payload, i);
        downloadDataUrl(url, slides.length > 1 ? `${base}-${i + 1}.png` : `${base}.png`);
        await new Promise((r) => setTimeout(r, 250));
      }
    } catch (e) {
      alert("Nedlasting feilet: " + (e instanceof Error ? e.message : "ukjent feil"));
    } finally {
      setBusy(null);
    }
  };

  const doDelete = async (ids: string[]) => {
    if (!ids.length) return;
    if (!confirm(`Slette ${ids.length} eksport(er) fra loggen?`)) return;
    setBusy("delete");
    try {
      for (const id of ids) await deleteIgExport(id);
      setSelected((s) => s.filter((x) => !ids.includes(x)));
      await refresh();
    } catch (e) {
      alert("Sletting feilet: " + (e instanceof Error ? e.message : "ukjent feil"));
    } finally {
      setBusy(null);
    }
  };

  const doRename = async (entry: IgExportEntry) => {
    const name = prompt("Nytt navn", entry.name);
    if (!name || !name.trim() || name === entry.name) return;
    try {
      await renameIgExport(entry.id, name.trim());
      setEntries((list) =>
        list.map((e) => (e.id === entry.id ? { ...e, name: name.trim() } : e)),
      );
    } catch (e) {
      alert("Endring feilet: " + (e instanceof Error ? e.message : "ukjent feil"));
    }
  };

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const selectClass =
    "rounded-md border border-border bg-background text-foreground text-sm px-3 py-2";

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">
          ← Admin
        </Link>
        <h1 className="font-display text-4xl md:text-5xl mt-3 mb-2">Eksportlogg</h1>
        <p className="text-muted-foreground mb-8">
          Alle lagrede Instagram-poster. Last ned på nytt, åpne i editoren eller rydd opp.
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Søk i navn, mal eller bildetekst…"
            className="flex-1 min-w-[200px] rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <select value={template} onChange={(e) => setTemplate(e.target.value)} className={selectClass}>
            <option value="__all__">Alle maler</option>
            {templates.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={aspect} onChange={(e) => setAspect(e.target.value)} className={selectClass}>
            {ASPECTS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
            <option value="date-desc">Nyeste først</option>
            <option value="date-asc">Eldste først</option>
            <option value="name-asc">Navn A–Å</option>
            <option value="name-desc">Navn Å–A</option>
          </select>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-muted-foreground flex-1">
            {filtered.length} av {entries.length} eksport{entries.length === 1 ? "" : "er"}
            {selected.length > 0 && ` · ${selected.length} valgt`}
          </span>
          {selected.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="text-sm rounded-md border border-border px-3 py-2 hover:bg-muted"
              >
                Nullstill valg
              </button>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void doDelete(selected)}
                className="text-sm rounded-md bg-destructive text-destructive-foreground px-3 py-2 disabled:opacity-60"
              >
                Slett valgte
              </button>
            </>
          )}
        </div>

        {error && <p className="text-destructive mb-6">{error}</p>}
        {loading && <p className="text-muted-foreground">Laster…</p>}
        {!loading && !filtered.length && (
          <p className="text-muted-foreground">Ingen eksporter matcher filteret.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => {
            const isSel = selected.includes(e.id);
            const thumb = thumbs[e.id];
            return (
              <div
                key={e.id}
                className={`rounded-lg border bg-card/50 overflow-hidden transition ${
                  isSel ? "border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]" : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(e.id)}
                  className="block w-full aspect-square bg-muted/40 flex items-center justify-center overflow-hidden"
                  aria-pressed={isSel}
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={e.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {thumb === "" ? "Ingen forhåndsvisning" : "Rendrer…"}
                    </span>
                  )}
                </button>
                <div className="p-4">
                  <div className="font-medium text-sm truncate" title={e.name}>
                    {e.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {fmtDate(e.created_at)} · {e.slide_count} slide
                    {e.slide_count === 1 ? "" : "s"}
                    {e.aspect ? ` · ${e.aspect}` : ""}
                  </div>
                  {!!(e.templates ?? []).length && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {e.templates!.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] rounded border border-border px-1.5 py-0.5 text-primary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {e.photos_dropped && (
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Bilder ble utelatt da denne ble lagret.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => void downloadEntry(e)}
                      className="text-xs rounded-md bg-primary text-primary-foreground px-3 py-1.5 disabled:opacity-60"
                    >
                      {busy === e.id ? "Laster ned…" : "Last ned"}
                    </button>
                    <Link
                      to={`/admin/make-ig-post?export=${e.id}`}
                      className="text-xs rounded-md border border-border px-3 py-1.5 hover:bg-muted"
                    >
                      Åpne i editor
                    </Link>
                    <button
                      type="button"
                      onClick={() => void doRename(e)}
                      className="text-xs rounded-md border border-border px-3 py-1.5 hover:bg-muted"
                    >
                      Gi nytt navn
                    </button>
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => void doDelete([e.id])}
                      className="text-xs rounded-md border border-destructive text-destructive px-3 py-1.5 disabled:opacity-60"
                    >
                      Slett
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default AdminExports;
