import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Pencil, Trash2, Type } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  IgExportEntry,
  IgExportPayload,
  deleteIgExport,
  getIgExport,
  listIgExports,
  renameIgExport,
  setIgExportThumb,
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

const fmtShortDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("nb-NO", { day: "2-digit", month: "2-digit" });
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
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const payloadCache = useRef(new Map<string, IgExportPayload>());
  const rendererRef = useRef<IgRenderer | null>(null);
  const poolRef = useRef<IgRenderer[]>([]);
  const attempted = useRef(new Set<string>());

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
    poolRef.current = [rendererRef.current, new IgRenderer(theme), new IgRenderer(theme)];
    return () => {
      poolRef.current.forEach((r) => r.destroy());
      poolRef.current = [];
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

  // Show stored thumbnails immediately.
  useEffect(() => {
    const stored: Record<string, string> = {};
    entries.forEach((e) => {
      if (e.thumb) stored[e.id] = e.thumb;
    });
    if (Object.keys(stored).length) setThumbs((t) => ({ ...stored, ...t }));
  }, [entries]);

  const missingThumbs = useMemo(() => entries.filter((e) => !e.thumb), [entries]);

  /**
   * Manual one-time job: renders and stores a thumbnail for every entry saved
   * before thumbnails existed. Never runs automatically on page load.
   */
  const generateMissingThumbs = async () => {
    if (theme === null || !poolRef.current.length || progress) return;
    const missing = entries.filter((e) => !e.thumb);
    if (!missing.length) return;

    let done = 0;
    setProgress({ done: 0, total: missing.length });
    const queue = missing.slice();
    let failure: string | null = null;

    const worker = async (renderer: IgRenderer) => {
      for (;;) {
        const entry = queue.shift();
        if (!entry) return;
        try {
          const payload = await loadPayload(entry.id);
          const url = await renderer.renderThumb(payload, 0);
          setThumbs((t) => ({ ...t, [entry.id]: url }));
          await setIgExportThumb(entry.id, url);
          setEntries((list) =>
            list.map((e) => (e.id === entry.id ? { ...e, thumb: url } : e)),
          );
        } catch (err) {
          failure = err instanceof Error ? err.message : String(err);
          setThumbs((t) => ({ ...t, [entry.id]: "" }));
        }
        done += 1;
        setProgress({ done, total: missing.length });
      }
    };

    await Promise.all(poolRef.current.map((r) => worker(r)));
    setProgress(null);
    setError(failure ? `Noen miniatyrbilder feilet: ${failure}` : null);
  };

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
    "rounded-md border border-border bg-background text-foreground text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2";

  return (
    <main className="min-h-screen bg-background text-foreground px-1.5 sm:px-6 py-6 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">
          ← Admin
        </Link>
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl mt-2 mb-1">Eksportlogg</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-8">
          Alle lagrede Instagram-poster. Last ned på nytt, åpne i editoren eller rydd opp.
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-3 mb-2 sm:mb-6">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Søk i navn, mal eller bildetekst…"
            className="w-full sm:flex-1 sm:w-auto sm:min-w-[200px] rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <select value={template} onChange={(e) => setTemplate(e.target.value)} className={`${selectClass} flex-1 min-w-0`}>
            <option value="__all__">Alle maler</option>
            {templates.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select value={aspect} onChange={(e) => setAspect(e.target.value)} className={`${selectClass} flex-1 min-w-0`}>
            {ASPECTS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${selectClass} flex-1 min-w-0`}>
            <option value="date-desc">Nyeste først</option>
            <option value="date-asc">Eldste først</option>
            <option value="name-asc">Navn A–Å</option>
            <option value="name-desc">Navn Å–A</option>
          </select>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-6">
          <span className="text-xs sm:text-sm text-muted-foreground flex-1">
            {filtered.length} av {entries.length} eksport{entries.length === 1 ? "" : "er"}
            {selected.length > 0 && ` · ${selected.length} valgt`}
          </span>
          {selected.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="text-xs sm:text-sm rounded-md border border-border px-2.5 py-1.5 sm:px-3 sm:py-2 hover:bg-muted"
              >
                Nullstill
              </button>
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => void doDelete(selected)}
                className="text-xs sm:text-sm rounded-md bg-destructive text-destructive-foreground px-2.5 py-1.5 sm:px-3 sm:py-2 disabled:opacity-60"
              >
                Slett valgte
              </button>
            </>
          )}
          {missingThumbs.length > 0 && (
            <button
              type="button"
              disabled={progress !== null || theme === null}
              onClick={() => void generateMissingThumbs()}
              className="text-xs sm:text-sm rounded-md border border-border px-2.5 py-1.5 sm:px-3 sm:py-2 hover:bg-muted disabled:opacity-60"
            >
              {progress
                ? `Lager miniatyrbilder… ${progress.done}/${progress.total}`
                : `Lag miniatyrbilder (${missingThumbs.length})`}
            </button>
          )}
        </div>

        {error && <p className="text-destructive mb-6">{error}</p>}
        {loading && <p className="text-muted-foreground">Laster…</p>}
        {!loading && !filtered.length && (
          <p className="text-muted-foreground">Ingen eksporter matcher filteret.</p>
        )}

        <div className="grid grid-cols-3 gap-1.5 sm:gap-4 lg:grid-cols-4">
          {filtered.map((e) => {
            const isSel = selected.includes(e.id);
            const thumb = thumbs[e.id];
            return (
              <div
                key={e.id}
                className={`rounded-sm border bg-card/50 overflow-hidden transition ${
                  isSel ? "border-primary shadow-[0_0_12px_hsl(var(--primary)/0.4)]" : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(e.id)}
                  className="w-full aspect-square bg-muted/40 flex items-center justify-center overflow-hidden"
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
                    <span className="text-[10px] sm:text-xs text-muted-foreground px-1 text-center">
                      {thumb === ""
                        ? "Ingen forhåndsvisning"
                        : e.thumb
                          ? "Laster…"
                          : "Ingen miniatyr"}
                    </span>
                  )}
                </button>
                <div className="p-1 sm:p-3">
                  <div className="font-medium text-xs sm:text-sm leading-tight truncate" title={e.name}>
                    {e.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    <span className="sm:hidden">{fmtShortDate(e.created_at)}</span>
                    <span className="hidden sm:inline">{fmtDate(e.created_at)}</span>
                    {` · ${e.slide_count}`}
                    <span className="hidden sm:inline">
                      {` slide${e.slide_count === 1 ? "" : "s"}${e.aspect ? ` · ${e.aspect}` : ""}`}
                    </span>
                  </div>
                  {e.photos_dropped && (
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                      Bilder utelatt
                    </p>
                  )}
                  <div className="flex flex-nowrap items-center gap-0.5 sm:gap-2 mt-1 sm:mt-3">
                    <button
                      type="button"
                      title="Last ned"
                      aria-label="Last ned"
                      disabled={busy !== null}
                      onClick={() => void downloadEntry(e)}
                      className="inline-flex items-center justify-center gap-1 text-xs rounded-sm bg-primary text-primary-foreground p-1 sm:px-3 sm:py-1.5 disabled:opacity-60"
                    >
                      <Download className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">
                        {busy === e.id ? "Laster ned…" : "Last ned"}
                      </span>
                    </button>
                    <Link
                      to={`/admin/make-ig-post?export=${e.id}`}
                      title="Åpne i editor"
                      aria-label="Åpne i editor"
                      className="inline-flex items-center justify-center gap-1 text-xs rounded-sm border border-border p-1 sm:px-3 sm:py-1.5 hover:bg-muted"
                    >
                      <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Åpne</span>
                    </Link>
                    <button
                      type="button"
                      title="Gi nytt navn"
                      aria-label="Gi nytt navn"
                      onClick={() => void doRename(e)}
                      className="inline-flex items-center justify-center gap-1 text-xs rounded-sm border border-border p-1 sm:px-3 sm:py-1.5 hover:bg-muted"
                    >
                      <Type className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Nytt navn</span>
                    </button>
                    <button
                      type="button"
                      title="Slett"
                      aria-label="Slett"
                      disabled={busy !== null}
                      onClick={() => void doDelete([e.id])}
                      className="inline-flex items-center justify-center gap-1 text-xs rounded-sm border border-destructive text-destructive p-1 sm:px-3 sm:py-1.5 disabled:opacity-60"
                    >
                      <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span className="hidden sm:inline">Slett</span>
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
