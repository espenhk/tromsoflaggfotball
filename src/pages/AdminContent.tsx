import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_TOKEN_KEY } from "@/components/AdminGate";
import {
  codeSections, midpointOrder, customPageId, customSlug, isCustomPage, toSlug,
  type CmsPage, type PageId,
} from "@/cms/manifest";
import { VARIANTS, VARIANT_ORDER, getVariant, type VariantKey, type FieldSpec } from "@/cms/variants";
import { Link2, Unlink, Save, Undo2, Plus, Trash2, ExternalLink } from "lucide-react";

type Block = {
  id: string;
  page: PageId;
  key: string;
  kind: "slot" | "section";
  title_no: string | null;
  title_en: string | null;
  body_md_no: string;
  body_md_en: string | null;
  sort_order: number;
  visible: boolean;
  variant: string;
  data: Record<string, unknown>;
};

type CustomPageRow = {
  slug: string;
  title_no: string;
  title_en: string | null;
  visible: boolean;
};

/** Fixed text slots per page (inline overrides, not sections in the flow). */
const SLOTS: Record<string, { key: string; label: string; help?: string }[]> = {
  home: [
    { key: "hero.tagline", label: "Hero-undertekst", help: "Kort linje under hovedtittelen." },
  ],
  presse: [
    { key: "intro", label: "Intro" },
    { key: "about.body", label: "Om klubben" },
  ],
  quiz: [],
  posisjoner: [{ key: "intro", label: "Intro" }],
};

const PAGE_LABELS: Record<CmsPage, string> = {
  home: "Forsiden",
  presse: "Presse",
  quiz: "Quiz",
  posisjoner: "Posisjoner",
};

type Row =
  | { kind: "code"; key: string; order: number; label: string }
  | { kind: "db"; block: Block };

function newBlock(page: PageId, variant: VariantKey, sort_order: number): Block {
  return {
    id: `_new_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    page,
    key: `custom-${Date.now().toString(36)}`,
    kind: "section",
    title_no: null,
    title_en: null,
    body_md_no: "",
    body_md_en: null,
    sort_order,
    visible: true,
    variant,
    data: {},
  };
}

function normaliseBlock(b: Partial<Block> & { page: PageId; key: string }): Block {
  return {
    id: b.id ?? "",
    page: b.page,
    key: b.key,
    kind: (b.kind as "slot" | "section") ?? "section",
    title_no: b.title_no ?? null,
    title_en: b.title_en ?? null,
    body_md_no: b.body_md_no ?? "",
    body_md_en: b.body_md_en ?? null,
    sort_order: b.sort_order ?? 0,
    visible: b.visible ?? true,
    variant: (b as { variant?: string }).variant ?? "markdown",
    data: ((b as { data?: unknown }).data as Record<string, unknown>) ?? {},
  };
}

const AdminContent = () => {
  return <AdminContentInner />;
};

/** True when this section is chained to the one above it. */
function isLinkedUp(b: Block): boolean {
  const d = b.data as { linkedUp?: unknown; group?: unknown };
  if (d?.linkedUp === true) return true;
  return typeof d?.group === "string" && d.group.trim().length > 0;
}

/** Serialised content of a block, ignoring its id. */
function blockKey(b: Block): string {
  return JSON.stringify([
    b.page, b.key, b.kind, b.title_no, b.title_en, b.body_md_no, b.body_md_en,
    b.sort_order, b.visible, b.variant, b.data,
  ]);
}

function sameBlock(a: Block, b: Block): boolean {
  return blockKey(a) === blockKey(b);
}

/** Stable fingerprint of a whole page state, used to detect unsaved edits. */
function snapshotKey(list: Block[]): string {
  return list.map(blockKey).sort().join("|");
}

const AdminContentInner = () => {
  const [page, setPage] = useState<PageId>("home");
  const [customPages, setCustomPages] = useState<CustomPageRow[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  /** Last published state for this page (what the live site shows). */
  const [published, setPublished] = useState<Block[]>([]);
  /** Snapshots of the published state before each save, newest last. */
  const [undoStack, setUndoStack] = useState<Block[][]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const call = async (body: Record<string, unknown>) => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    const { data, error } = await supabase.functions.invoke("content-admin", {
      body: { token, ...body },
    });
    const status = (error as { context?: { status?: number } } | null)?.context?.status;
    if (status === 401 || data?.error === "unauthorized") {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      window.location.reload();
      throw new Error("unauthorized");
    }
    if (error) throw error;
    if (data?.error) throw new Error(String(data.error));
    return data as { blocks?: Block[]; block?: Block; ok?: boolean };
  };

  const refresh = async (p: PageId) => {
    setLoading(true);
    setError(null);
    try {
      const r = await call({ action: "list", page: p });
      const fresh = ((r.blocks ?? []) as Block[]).map(normaliseBlock);
      setBlocks(fresh);
      setPublished(fresh);
      setUndoStack([]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh(page);
  }, [page]);

  const refreshPages = async () => {
    try {
      const r = (await call({ action: "pages" })) as unknown as { pages?: CustomPageRow[] };
      setCustomPages(r.pages ?? []);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    void refreshPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Create a new custom page at /pages/<slug> and switch to it. */
  const createPage = async () => {
    const title = prompt("Tittel på den nye siden?");
    if (!title || !title.trim()) return;
    const suggested = toSlug(title);
    const slug = toSlug(prompt("Adresse (/pages/…)", suggested) ?? suggested);
    if (!slug) return;
    if (customPages.some((p) => p.slug === slug)) {
      alert("Det finnes allerede en side med denne adressen.");
      return;
    }
    try {
      await call({ action: "page-upsert", page: { slug, title_no: title.trim(), visible: true } });
      await refreshPages();
      setPage(customPageId(slug));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const currentCustom = isCustomPage(page)
    ? customPages.find((p) => p.slug === customSlug(page)) ?? null
    : null;

  const renamePage = async () => {
    if (!currentCustom) return;
    const title = prompt("Ny tittel", currentCustom.title_no);
    if (!title || !title.trim()) return;
    try {
      await call({
        action: "page-upsert",
        page: { ...currentCustom, title_no: title.trim() },
      });
      await refreshPages();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const deletePage = async () => {
    if (!currentCustom) return;
    if (!confirm(`Slette siden «${currentCustom.title_no}» og alt innholdet på den?`)) return;
    try {
      await call({ action: "page-delete", slug: currentCustom.slug });
      await refreshPages();
      setPage("home");
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const slotBlocks = useMemo(
    () => blocks.filter((b) => b.kind === "slot"),
    [blocks],
  );
  const sectionBlocks = useMemo(
    () => blocks.filter((b) => b.kind === "section").sort((a, b) => a.sort_order - b.sort_order),
    [blocks],
  );

  /** Merged, ordered list of code rows and DB section rows. */
  const rows: Row[] = useMemo(() => {
    const code: Row[] = codeSections(page).map((c) => ({
      kind: "code", key: c.key, order: c.order, label: c.label,
    }));
    const db: Row[] = sectionBlocks.map((b) => ({ kind: "db", block: b }));
    return [...code, ...db].sort((a, b) => {
      const ao = a.kind === "code" ? a.order : a.block.sort_order;
      const bo = b.kind === "code" ? b.order : b.block.sort_order;
      return ao - bo;
    });
  }, [page, sectionBlocks]);

  const orderOf = (r: Row) => (r.kind === "code" ? r.order : r.block.sort_order);

  const insertAt = (prevOrder: number, nextOrder: number, variant: VariantKey) => {
    const so = midpointOrder(prevOrder, nextOrder);
    const b = newBlock(page, variant, so);
    setBlocks((prev) => [...prev, b]);
    setEditingId(b.id);
  };

  const updateBlock = (id: string, patch: Partial<Block>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  /** Local-only delete — published on the next save. */
  const deleteBlock = (b: Block) => {
    if (!b.id.startsWith("_new_") && !confirm("Fjerne denne seksjonen? Trer i kraft når du lagrer.")) return;
    setBlocks((prev) => prev.filter((x) => x.id !== b.id));
    setEditingId(null);
  };

  /** Move a DB section one step earlier or later in the merged list. */
  const move = (b: Block, direction: -1 | 1) => {
    const idx = rows.findIndex((r) => r.kind === "db" && r.block.id === b.id);
    if (idx < 0) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= rows.length) return;
    // Neighbours after swap: we need a new sort_order that puts b on the
    // other side of the swap target. Compute midpoint between the two rows
    // flanking the target position.
    const before = direction < 0 ? rows[targetIdx - 1] : rows[targetIdx];
    const after = direction < 0 ? rows[targetIdx] : rows[targetIdx + 1];
    const prevOrder = before ? orderOf(before) : orderOf(rows[targetIdx]) - 10;
    const nextOrder = after ? orderOf(after) : orderOf(rows[targetIdx]) + 10;
    const newOrder = midpointOrder(prevOrder, nextOrder);
    updateBlock(b.id, { sort_order: newOrder });
  };

  const toggleVisible = (b: Block) => updateBlock(b.id, { visible: !b.visible });

  /** Link/unlink a section to the section above it (shared background). */
  const toggleLink = (b: Block) => {
    const data = { ...b.data, linkedUp: !isLinkedUp(b) };
    delete (data as Record<string, unknown>).group;
    updateBlock(b.id, { data });
  };

  /**
   * Write `target` to the database, using `base` (the currently published
   * state) to work out what changed. Returns the resulting blocks with the
   * ids the server assigned.
   */
  const persist = async (target: Block[], base: Block[]): Promise<Block[]> => {
    const liveIds = new Set(base.map((b) => b.id).filter((id) => id && !id.startsWith("_new_")));
    const targetIds = new Set(target.map((b) => b.id));
    for (const b of base) {
      if (liveIds.has(b.id) && !targetIds.has(b.id)) {
        await call({ action: "delete", id: b.id });
      }
    }
    const out: Block[] = [];
    for (const b of target) {
      const exists = liveIds.has(b.id);
      const prior = exists ? base.find((x) => x.id === b.id) : undefined;
      if (prior && sameBlock(prior, b)) { out.push(b); continue; }
      const r = await call({
        action: "upsert",
        id: exists ? b.id : undefined,
        block: {
          page: b.page, key: b.key, kind: b.kind,
          title_no: b.title_no, title_en: b.title_en,
          body_md_no: b.body_md_no, body_md_en: b.body_md_en,
          sort_order: b.sort_order, visible: b.visible,
          variant: b.kind === "slot" ? "markdown" : b.variant,
          data: b.kind === "slot" ? {} : b.data,
        },
      });
      out.push(r.block ? normaliseBlock(r.block) : b);
    }
    return out;
  };

  const dirty = useMemo(
    () => snapshotKey(blocks) !== snapshotKey(published),
    [blocks, published],
  );

  /** Publish all pending edits and remember the previous state for undo. */
  const saveAll = async () => {
    setSaving(true);
    setError(null);
    try {
      const result = await persist(blocks, published);
      setUndoStack((s) => [...s, published].slice(-20));
      setBlocks(result);
      setPublished(result);
      setEditingId(null);
    } catch (e) {
      setError((e as Error).message);
      await refresh(page);
    } finally {
      setSaving(false);
    }
  };

  /** Roll the page back to the state it had at the previous save point. */
  const undoLastSave = async () => {
    const snapshot = undoStack[undoStack.length - 1];
    if (!snapshot) return;
    if (!confirm("Tilbakestille siden til forrige lagringspunkt?")) return;
    setSaving(true);
    setError(null);
    try {
      const result = await persist(snapshot, published);
      setUndoStack((s) => s.slice(0, -1));
      setBlocks(result);
      setPublished(result);
      setEditingId(null);
    } catch (e) {
      setError((e as Error).message);
      await refresh(page);
    } finally {
      setSaving(false);
    }
  };

  /** Throw away unsaved edits. */
  const discard = () => {
    if (!dirty) return;
    if (!confirm("Forkaste endringene som ikke er lagret?")) return;
    setBlocks(published);
    setEditingId(null);
  };

  const slotRows: Block[] = (SLOTS[page] ?? []).map(({ key }) => {
    const existing = slotBlocks.find((b) => b.key === key);
    return existing ?? normaliseBlock({
      page, key, kind: "slot", sort_order: 0, visible: true,
    });
  });

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-2">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
        </div>
        <h1 className="font-display text-3xl md:text-4xl mb-2">Innhold</h1>
        <p className="text-muted-foreground mb-8">
          Rediger seksjoner på forsiden og undersidene. Faste seksjoner fra koden vises grå — du kan
          legge til nye seksjoner mellom dem og flytte dem opp/ned. Endringer vises på siden først
          når du trykker «Lagre».
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <label className="text-sm text-muted-foreground" htmlFor="cms-page-select">Side</label>
          <select
            id="cms-page-select"
            value={page}
            onChange={(e) => {
              const p = e.target.value;
              if (p === page) return;
              if (dirty && !confirm("Du har ulagrede endringer. Bytte side og forkaste dem?")) {
                e.target.value = page;
                return;
              }
              setPage(p);
              setEditingId(null);
            }}
            className="bg-input border border-border rounded-md px-3 py-2 text-sm min-w-56"
          >
            <optgroup label="Faste sider">
              {(Object.keys(PAGE_LABELS) as CmsPage[]).map((p) => (
                <option key={p} value={p}>{PAGE_LABELS[p]}</option>
              ))}
            </optgroup>
            {customPages.length > 0 && (
              <optgroup label="Egne sider (/pages/…)">
                {customPages.map((p) => (
                  <option key={p.slug} value={customPageId(p.slug)}>
                    {p.title_no} — /pages/{p.slug}
                  </option>
                ))}
              </optgroup>
            )}
          </select>

          <button
            type="button"
            onClick={createPage}
            className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border border-border hover:bg-muted"
          >
            <Plus className="w-4 h-4" /> Ny side
          </button>

          {currentCustom && (
            <>
              <a
                href={`/pages/${currentCustom.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border border-border hover:bg-muted"
              >
                <ExternalLink className="w-4 h-4" /> Åpne
              </a>
              <button
                type="button"
                onClick={renamePage}
                className="text-sm px-3 py-2 rounded-md border border-border hover:bg-muted"
              >
                Gi nytt navn
              </button>
              <button
                type="button"
                onClick={deletePage}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" /> Slett side
              </button>
            </>
          )}
        </div>

        {error && <p className="mb-4 text-destructive text-sm">Feil: {error}</p>}
        {loading && <p className="text-muted-foreground text-sm">Laster …</p>}

        {!loading && (
          <>
            <section className="mb-12">
              <h2 className="font-heading text-xl mb-3">Seksjoner</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Rekkefølgen her matcher det som vises på siden. Bruk «+»-knappen mellom to seksjoner
                for å sette inn en ny. Kjede-knappen lenker to seksjoner sammen, slik at de deler
                bakgrunnsfarge og vises tett inntil hverandre — som én seksjon.
              </p>
              <div>
                <InsertBar
                  prevOrder={-Infinity}
                  nextOrder={rows[0] ? orderOf(rows[0]) : 10}
                  onInsert={(v) => insertAt(rows[0] ? orderOf(rows[0]) - 10 : 0, rows[0] ? orderOf(rows[0]) : 10, v)}
                />
                {rows.map((r, i) => {
                  const nextRow = rows[i + 1];
                  const nextOrder = nextRow ? orderOf(nextRow) : orderOf(r) + 10;
                  return (
                    <div key={r.kind === "code" ? `c:${r.key}` : `d:${r.block.id}`}>
                      {r.kind === "code" ? (
                        <CodeRow row={r} />
                      ) : (
                        <DbRow
                          block={r.block}
                          isEditing={editingId === r.block.id}
                          busy={busyId === r.block.id}
                          canMoveUp={i > 0}
                          canMoveDown={i < rows.length - 1}
                          onEdit={() => setEditingId(editingId === r.block.id ? null : r.block.id)}
                          onChange={(patch) => updateBlock(r.block.id, patch)}
                          onSave={() => setEditingId(null)}
                          onCancel={() => {
                            if (r.block.id.startsWith("_new_")) {
                              setBlocks((prev) => prev.filter((x) => x.id !== r.block.id));
                            }
                            setEditingId(null);
                          }}
                          onDelete={() => deleteBlock(r.block)}
                          onToggleVisible={() => toggleVisible(r.block)}
                          onMoveUp={() => move(r.block, -1)}
                          onMoveDown={() => move(r.block, 1)}
                        />
                      )}
                      <InsertBar
                        prevOrder={orderOf(r)}
                        nextOrder={nextOrder}
                        onInsert={(v) => insertAt(orderOf(r), nextOrder, v)}
                        link={
                          r.kind === "db" && nextRow?.kind === "db"
                            ? {
                                linked: isLinkedUp(nextRow.block),
                                busy: busyId === nextRow.block.id,
                                onToggle: () => toggleLink(nextRow.block),
                              }
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="sticky bottom-0 z-30 -mx-2 px-2 py-3 mb-12 bg-background/95 backdrop-blur border-t border-border flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={saveAll}
                disabled={saving || !dirty}
                className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40"
              >
                <Save className="w-4 h-4" />
                {saving ? "Lagrer …" : "Lagre"}
              </button>
              <button
                type="button"
                onClick={discard}
                disabled={saving || !dirty}
                title="Forkast endringene du ikke har lagret"
                className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" />
                Forkast
              </button>
              <button
                type="button"
                onClick={undoLastSave}
                disabled={saving || undoStack.length === 0}
                title="Tilbakestill siden til slik den var ved forrige lagring"
                className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-40"
              >
                <Undo2 className="w-4 h-4" />
                Angre siste lagring
              </button>
              <span className={`text-xs ml-auto ${dirty ? "text-primary" : "text-muted-foreground"}`}>
                {dirty ? "Ulagrede endringer" : "Alt er lagret"}
              </span>
            </div>

            <section>
              <h2 className="font-heading text-xl mb-3">Faste tekstfelt</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Overstyrer korte tekstbiter som ligger inne i selve siden.
                Tomt felt = siden bruker standardteksten fra koden.
              </p>
              <div className="space-y-4">
                {slotRows.map((b) => (
                  <SlotEditor
                    key={`slot-${b.key}`}
                    block={b}
                    busy={busyId === (b.id || `slot:${b.key}`)}
                    onChange={(patch) => setBlocks((prev) => {
                      const existing = prev.find((x) => x.kind === "slot" && x.key === b.key && x.page === page);
                      if (existing) return prev.map((x) => (x === existing ? { ...existing, ...patch } : x));
                      return [...prev, { ...b, ...patch }];
                    })}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

const InsertBar = ({
  prevOrder,
  nextOrder,
  onInsert,
  link,
}: {
  prevOrder: number;
  nextOrder: number;
  onInsert: (v: VariantKey) => void;
  link?: { linked: boolean; busy: boolean; onToggle: () => void };
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative py-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        {link && (
          <button
            type="button"
            onClick={link.onToggle}
            disabled={link.busy}
            title={link.linked
              ? "Lenket: deler bakgrunn med seksjonen over. Klikk for å løsne."
              : "Ikke lenket. Klikk for å slå sammen med seksjonen over."}
            aria-pressed={link.linked}
            aria-label={link.linked ? "Løsne seksjonene" : "Lenke seksjonene"}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md border transition-colors disabled:opacity-50 ${
              link.linked
                ? "border-primary text-primary bg-primary/10"
                : "border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary"
            }`}
          >
            {link.linked ? <Link2 className="w-3.5 h-3.5" /> : <Unlink className="w-3.5 h-3.5" />}
            {link.linked ? "Lenket" : "Lenk"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs px-2 py-1 rounded-md border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary"
        >
          + Ny seksjon her
        </button>
        <div className="flex-1 h-px bg-border" />
      </div>
      {open && (
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          {VARIANT_ORDER.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => { onInsert(v); setOpen(false); }}
              className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90"
            >
              {VARIANTS[v].label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted"
          >
            Avbryt
          </button>
        </div>
      )}
    </div>
  );
};

const CodeRow = ({ row }: { row: Extract<Row, { kind: "code" }> }) => (
  <div className="rounded-md border border-border bg-muted/30 px-4 py-3 my-1 flex items-center justify-between opacity-80">
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        Fast seksjon
      </div>
      <div className="font-heading text-base">{row.label}</div>
    </div>
    <div className="text-xs text-muted-foreground font-mono">#{row.key}</div>
  </div>
);

const DbRow = ({
  block,
  isEditing,
  busy,
  canMoveUp,
  canMoveDown,
  onEdit,
  onChange,
  onSave,
  onCancel,
  onDelete,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
}: {
  block: Block;
  isEditing: boolean;
  busy: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onEdit: () => void;
  onChange: (patch: Partial<Block>) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onToggleVisible: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) => {
  const variant = getVariant(block.variant);
  return (
    <div className={`rounded-md border ${isEditing ? "border-primary/60" : "border-border"} bg-card/50 my-1`}>
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <button type="button" onClick={onMoveUp} disabled={!canMoveUp}
            className="text-xs px-2 rounded hover:bg-muted disabled:opacity-30" aria-label="Opp">▲</button>
          <button type="button" onClick={onMoveDown} disabled={!canMoveDown}
            className="text-xs px-2 rounded hover:bg-muted disabled:opacity-30" aria-label="Ned">▼</button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs uppercase tracking-widest text-primary flex items-center gap-2">
            <span>{variant.label}</span>
            {isLinkedUp(block) && (
              <span className="normal-case tracking-normal text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                lenket til seksjonen over
              </span>
            )}
          </div>
          <div className="font-heading text-base truncate">
            {block.title_no || block.title_en || <span className="text-muted-foreground italic">(uten tittel)</span>}
          </div>
        </div>
        {!block.visible && <span className="text-xs text-muted-foreground">skjult</span>}
        <button type="button" onClick={onToggleVisible} disabled={busy}
          className="text-xs px-2 py-1 rounded border border-border hover:bg-muted">
          {block.visible ? "Skjul" : "Vis"}
        </button>
        <button type="button" onClick={onEdit}
          className="text-xs px-3 py-1 rounded border border-border hover:bg-muted">
          {isEditing ? "Lukk" : "Rediger"}
        </button>
      </div>
      {isEditing && (
        <div className="border-t border-border p-4">
          <VariantEditor block={block} onChange={onChange} />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button type="button" onClick={onSave} disabled={busy}
              className="text-sm px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
              Ferdig
            </button>
            <button type="button" onClick={onCancel}
              className="text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted">
              Avbryt
            </button>
            <button type="button" onClick={onDelete} disabled={busy}
              className="ml-auto text-sm px-3 py-1.5 rounded-md border border-destructive/40 text-destructive hover:bg-destructive/10">
              Slett
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const VariantEditor = ({
  block, onChange,
}: {
  block: Block;
  onChange: (patch: Partial<Block>) => void;
}) => {
  const variant = getVariant(block.variant);
  const setData = (key: string, value: unknown) => {
    onChange({ data: { ...block.data, [key]: value } });
  };
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-[1fr,auto] gap-3 items-end">
        <div>
          <Label>Type</Label>
          <select
            value={block.variant}
            onChange={(e) => onChange({ variant: e.target.value })}
            className="w-full rounded-md bg-background border border-border px-3 py-1.5 text-sm"
          >
            {VARIANT_ORDER.map((v) => (
              <option key={v} value={v}>{VARIANTS[v].label}</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-muted-foreground">
          Rekkefølge: <span className="font-mono">{block.sort_order}</span>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <Label>Tittel (norsk)</Label>
          <input type="text" value={block.title_no ?? ""}
            onChange={(e) => onChange({ title_no: e.target.value })}
            className="w-full rounded-md bg-background border border-border px-3 py-1.5 text-sm" />
        </div>
        <div>
          <Label>Title (english)</Label>
          <input type="text" value={block.title_en ?? ""}
            onChange={(e) => onChange({ title_en: e.target.value })}
            className="w-full rounded-md bg-background border border-border px-3 py-1.5 text-sm" />
        </div>
      </div>

      {variant.usesMarkdownBody && (
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Innhold (norsk, markdown)</Label>
            <textarea rows={8} value={block.body_md_no}
              onChange={(e) => onChange({ body_md_no: e.target.value })}
              className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm font-mono" />
          </div>
          <div>
            <Label>Content (english, optional)</Label>
            <textarea rows={8} value={block.body_md_en ?? ""}
              onChange={(e) => onChange({ body_md_en: e.target.value })}
              className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm font-mono" />
          </div>
        </div>
      )}

      {variant.dataFields.map((f) => (
        <FieldInput
          key={f.key}
          field={f}
          data={block.data}
          onChange={(v, subKey) => setData(subKey ?? f.key, v)}
        />
      ))}

      {variant.usesMarkdownBody && (
        <details>
          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
            Forhåndsvis
          </summary>
          <div className="mt-2 rounded-md border border-border bg-background p-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {block.body_md_no || "*(tom)*"}
            </ReactMarkdown>
          </div>
        </details>
      )}
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{children}</div>
);

const FieldInput = ({
  field, data, onChange,
}: {
  field: FieldSpec;
  data: Record<string, unknown>;
  onChange: (value: unknown, subKey?: string) => void;
}) => {
  if (field.type === "list") {
    const items = Array.isArray(data[field.key])
      ? (data[field.key] as Record<string, unknown>[])
      : [];
    const setItems = (next: Record<string, unknown>[]) => onChange(next, field.key);
    const updateItem = (i: number, patch: Record<string, unknown>) => {
      const next = items.slice();
      next[i] = { ...(next[i] ?? {}), ...patch };
      setItems(next);
    };
    const move = (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= items.length) return;
      const next = items.slice();
      [next[i], next[j]] = [next[j], next[i]];
      setItems(next);
    };
    return (
      <div>
        <Label>{field.label}</Label>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="rounded-md border border-border bg-background/40 p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">#{i + 1}</span>
                <div className="ml-auto flex items-center gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                    className="text-xs px-2 rounded hover:bg-muted disabled:opacity-30">▲</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1}
                    className="text-xs px-2 rounded hover:bg-muted disabled:opacity-30">▼</button>
                  <button type="button"
                    onClick={() => setItems(items.filter((_, k) => k !== i))}
                    className="text-xs px-2 py-0.5 rounded border border-destructive/40 text-destructive hover:bg-destructive/10">
                    Slett
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {(field.itemFields ?? []).map((sub) => (
                  <FieldInput
                    key={sub.key}
                    field={sub}
                    data={item}
                    onChange={(v, subKey) => updateItem(i, { [subKey ?? sub.key]: v })}
                  />
                ))}
              </div>
            </div>
          ))}
          <button type="button"
            onClick={() => setItems([...items, {}])}
            className="text-xs px-3 py-1.5 rounded-md border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary">
            + Legg til {field.itemLabel ?? "element"}
          </button>
        </div>
        {field.help && <p className="text-xs text-muted-foreground mt-1">{field.help}</p>}
      </div>
    );
  }
  if (field.bilingual) {
    return (
      <div>
        <Label>{field.label}</Label>
        <div className="grid sm:grid-cols-2 gap-2">
          <ScalarInput field={field}
            value={data[`${field.key}_no`]}
            placeholder={`${field.placeholder ?? ""} (norsk)`}
            onChange={(v) => onChange(v, `${field.key}_no`)} />
          <ScalarInput field={field}
            value={data[`${field.key}_en`]}
            placeholder={`${field.placeholder ?? ""} (english)`}
            onChange={(v) => onChange(v, `${field.key}_en`)} />
        </div>
        {field.help && <p className="text-xs text-muted-foreground mt-1">{field.help}</p>}
      </div>
    );
  }
  return (
    <div>
      <Label>{field.label}</Label>
      <ScalarInput field={field} value={data[field.key]} placeholder={field.placeholder}
        onChange={(v) => onChange(v)} />
      {field.help && <p className="text-xs text-muted-foreground mt-1">{field.help}</p>}
    </div>
  );
};

const ScalarInput = ({
  field, value, placeholder, onChange,
}: {
  field: FieldSpec;
  value: unknown;
  placeholder?: string;
  onChange: (value: string | number) => void;
}) => {
  const strVal = typeof value === "string" ? value : (value == null ? "" : String(value));
  const cls = "w-full rounded-md bg-background border border-border px-3 py-1.5 text-sm";
  if (field.type === "select") {
    const opts = field.options ?? [];
    return (
      <select
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        className={cls}
      >
        <option value="">— velg —</option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }
  if (field.type === "textarea" || field.type === "markdown") {
    return (
      <textarea rows={4} value={strVal} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${cls} font-mono`} />
    );
  }
  return (
    <input
      type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
      value={strVal}
      placeholder={placeholder}
      onChange={(e) => onChange(field.type === "number" ? e.target.value : e.target.value)}
      className={cls}
    />
  );
};

const SlotEditor = ({
  block, onChange,
}: {
  block: Block;
  busy: boolean;
  onChange: (patch: Partial<Block>) => void;
}) => (
  <div className="rounded-md border border-border bg-card/50 p-4">
    <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-2">
      {block.key}
    </div>
    <div className="grid md:grid-cols-2 gap-3">
      <div>
        <Label>Norsk (markdown)</Label>
        <textarea rows={4} value={block.body_md_no}
          onChange={(e) => onChange({ body_md_no: e.target.value })}
          className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm font-mono" />
      </div>
      <div>
        <Label>English (valgfritt)</Label>
        <textarea rows={4} value={block.body_md_en ?? ""}
          onChange={(e) => onChange({ body_md_en: e.target.value })}
          className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm font-mono" />
      </div>
    </div>
  </div>
);

export default AdminContent;