import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_TOKEN_KEY } from "@/components/AdminGate";

type Page = "home" | "presse" | "quiz" | "posisjoner";

type Block = {
  id: string;
  page: Page;
  key: string;
  kind: "slot" | "section";
  title_no: string | null;
  title_en: string | null;
  body_md_no: string;
  body_md_en: string | null;
  sort_order: number;
  visible: boolean;
};

/** Fixed slot registry: which keys each page renders inline. */
const SLOTS: Record<Page, { key: string; label: string; help?: string }[]> = {
  home: [
    { key: "hero.tagline", label: "Hero tagline", help: "Short line under the main title." },
  ],
  presse: [
    { key: "intro", label: "Page intro" },
    { key: "about.body", label: "About the club" },
  ],
  quiz: [
    { key: "intro", label: "Page intro" },
  ],
  posisjoner: [
    { key: "intro", label: "Page intro" },
  ],
};

/** Fixed anchor registry: where free-form sections can be dropped in. */
const ANCHORS: Record<Page, { key: string; label: string }[]> = {
  home: [
    { key: "after-hero", label: "After hero" },
    { key: "after-training", label: "After Treninger" },
    { key: "after-positions", label: "After Dette er flaggfotball" },
    { key: "after-faq", label: "After FAQ" },
  ],
  presse: [{ key: "end", label: "End of page" }],
  quiz: [{ key: "end", label: "End of page" }],
  posisjoner: [{ key: "end", label: "End of page" }],
};

const PAGE_LABELS: Record<Page, string> = {
  home: "Forsiden",
  presse: "Presse",
  quiz: "Quiz",
  posisjoner: "Posisjoner",
};

function empty(page: Page, kind: "slot" | "section", key: string): Block {
  return {
    id: "",
    page,
    key,
    kind,
    title_no: null,
    title_en: null,
    body_md_no: "",
    body_md_en: null,
    sort_order: 0,
    visible: true,
  };
}

const AdminContent = () => {
  const [page, setPage] = useState<Page>("home");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

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

  const refresh = async (p: Page) => {
    setLoading(true);
    setError(null);
    try {
      const r = await call({ action: "list", page: p });
      setBlocks((r.blocks ?? []) as Block[]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh(page);
  }, [page]);

  const slotRows: Block[] = useMemo(() => {
    return SLOTS[page].map(({ key }) => {
      const existing = blocks.find((b) => b.kind === "slot" && b.key === key);
      return existing ?? empty(page, "slot", key);
    });
  }, [blocks, page]);

  const sectionRows: Block[] = useMemo(
    () => blocks.filter((b) => b.kind === "section").sort(
      (a, b) => a.key.localeCompare(b.key) || a.sort_order - b.sort_order,
    ),
    [blocks],
  );

  const save = async (b: Block) => {
    setSavingId(b.id || `${b.kind}:${b.key}:new`);
    setError(null);
    try {
      const r = await call({
        action: "upsert",
        id: b.id || undefined,
        block: {
          page: b.page,
          key: b.key,
          kind: b.kind,
          title_no: b.title_no,
          title_en: b.title_en,
          body_md_no: b.body_md_no,
          body_md_en: b.body_md_en,
          sort_order: b.sort_order,
          visible: b.visible,
        },
      });
      if (r.block) {
        setBlocks((prev) => {
          const without = prev.filter((x) => x.id !== r.block!.id);
          return [...without.filter((x) => !(x.kind === "slot" && x.key === r.block!.key && x.page === r.block!.page)), r.block!];
        });
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (b: Block) => {
    if (!b.id) return;
    if (!confirm("Slette denne seksjonen?")) return;
    setSavingId(b.id);
    try {
      await call({ action: "delete", id: b.id });
      setBlocks((prev) => prev.filter((x) => x.id !== b.id));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSavingId(null);
    }
  };

  const addSection = (anchor: string) => {
    const nextOrder = (sectionRows.filter((s) => s.key === anchor).at(-1)?.sort_order ?? 0) + 10;
    setBlocks((prev) => [
      ...prev,
      { ...empty(page, "section", anchor), sort_order: nextOrder, id: `_new_${Date.now()}` } as Block,
    ]);
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">← Admin</Link>
        </div>
        <h1 className="font-display text-3xl md:text-4xl mb-2">Innhold</h1>
        <p className="text-muted-foreground mb-8">
          Rediger tekst på forsiden og undersidene. Markdown støttes (**fet**, *kursiv*, lister, lenker, tabeller).
        </p>

        <div className="mb-8 inline-flex rounded-md border border-border overflow-hidden">
          {(Object.keys(PAGE_LABELS) as Page[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`px-4 py-2 text-sm font-medium border-l border-border first:border-l-0 ${
                page === p ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground hover:bg-muted"
              }`}
            >
              {PAGE_LABELS[p]}
            </button>
          ))}
        </div>

        {error && <p className="mb-4 text-destructive text-sm">Feil: {error}</p>}
        {loading && <p className="text-muted-foreground text-sm">Laster …</p>}

        {!loading && (
          <>
            <section className="mb-12">
              <h2 className="font-heading text-xl mb-3">Faste tekstfelt</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Erstatter tilsvarende tekst på siden. Tomt felt = siden bruker standardteksten fra koden.
              </p>
              <div className="space-y-4">
                {slotRows.map((b) => (
                  <BlockEditor
                    key={`slot-${b.key}`}
                    block={b}
                    isSaving={savingId === (b.id || `slot:${b.key}:new`)}
                    onSave={save}
                    onChange={(next) =>
                      setBlocks((prev) => {
                        const existing = prev.find((x) => x.id === b.id || (b.id === "" && x.kind === "slot" && x.key === b.key && x.page === b.page));
                        if (existing) {
                          return prev.map((x) => (x === existing ? { ...existing, ...next } : x));
                        }
                        return [...prev, { ...b, ...next }];
                      })
                    }
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-heading text-xl mb-3">Frie seksjoner</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Legg til nye seksjoner på siden ved å velge en plassering (anker) og skrive innhold i markdown.
              </p>

              <div className="space-y-8">
                {ANCHORS[page].map((a) => {
                  const rows = sectionRows.filter((s) => s.key === a.key);
                  return (
                    <div key={a.key} className="rounded-lg border border-border bg-card/30 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-heading text-lg">{a.label}</div>
                          <div className="text-xs text-muted-foreground font-mono">{a.key}</div>
                        </div>
                        <button
                          onClick={() => addSection(a.key)}
                          className="text-sm px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                        >
                          + Ny seksjon
                        </button>
                      </div>
                      {rows.length === 0 && (
                        <p className="text-xs text-muted-foreground italic">Ingen seksjoner her enda.</p>
                      )}
                      <div className="space-y-4">
                        {rows.map((b) => (
                          <BlockEditor
                            key={b.id}
                            block={b}
                            isSection
                            isSaving={savingId === b.id}
                            onSave={save}
                            onDelete={remove}
                            onChange={(next) =>
                              setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, ...next } : x)))
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

const BlockEditor = ({
  block,
  isSection,
  isSaving,
  onChange,
  onSave,
  onDelete,
}: {
  block: Block;
  isSection?: boolean;
  isSaving: boolean;
  onChange: (next: Partial<Block>) => void;
  onSave: (b: Block) => void;
  onDelete?: (b: Block) => void;
}) => {
  return (
    <div className="rounded-md border border-border bg-card/50 p-4">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {!isSection && (
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            {block.key}
          </div>
        )}
        {isSection && (
          <>
            <input
              type="text"
              value={block.title_no ?? ""}
              onChange={(e) => onChange({ title_no: e.target.value })}
              placeholder="Tittel (norsk)"
              className="flex-1 min-w-[200px] rounded-md bg-background border border-border px-3 py-1.5 text-sm"
            />
            <input
              type="text"
              value={block.title_en ?? ""}
              onChange={(e) => onChange({ title_en: e.target.value })}
              placeholder="Title (english, valgfritt)"
              className="flex-1 min-w-[200px] rounded-md bg-background border border-border px-3 py-1.5 text-sm"
            />
            <input
              type="number"
              value={block.sort_order}
              onChange={(e) => onChange({ sort_order: Number(e.target.value) })}
              className="w-20 rounded-md bg-background border border-border px-2 py-1.5 text-sm"
              title="Sortering (lavere = først)"
            />
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={block.visible}
                onChange={(e) => onChange({ visible: e.target.checked })}
              />
              Synlig
            </label>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Norsk (markdown)</div>
          <textarea
            value={block.body_md_no}
            onChange={(e) => onChange({ body_md_no: e.target.value })}
            rows={isSection ? 10 : 4}
            className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            English (valgfritt — faller tilbake til norsk om tomt)
          </div>
          <textarea
            value={block.body_md_en ?? ""}
            onChange={(e) => onChange({ body_md_en: e.target.value })}
            rows={isSection ? 10 : 4}
            className="w-full rounded-md bg-background border border-border px-3 py-2 text-sm font-mono"
          />
        </div>
      </div>

      <details className="mt-3">
        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
          Forhåndsvis
        </summary>
        <div className="mt-2 rounded-md border border-border bg-background p-3 prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {block.body_md_no || "*(tom)*"}
          </ReactMarkdown>
        </div>
      </details>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onSave(block)}
          disabled={isSaving}
          className="text-sm px-4 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Lagrer …" : "Lagre"}
        </button>
        {isSection && block.id && !block.id.startsWith("_new_") && onDelete && (
          <button
            onClick={() => onDelete(block)}
            disabled={isSaving}
            className="text-sm px-3 py-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-50"
          >
            Slett
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminContent;