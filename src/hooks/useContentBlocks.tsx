import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageProvider";
import { afterRange, type PageId } from "@/cms/manifest";
import { getVariant, blockAnchorId } from "@/cms/variants";

export type ContentPage = PageId;

export type ContentBlock = {
  id: string;
  page: ContentPage;
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

type Ctx = {
  blocks: ContentBlock[];
  loaded: boolean;
};

const PageCtx = createContext<Ctx>({ blocks: [], loaded: false });

/**
 * A section can be "linked" to the one above it (data.linkedUp). Linked
 * sections share one background stripe and read as one section. Legacy
 * `data.group` names are still honoured for unmigrated blocks.
 */
export const linkedUp = (b: ContentBlock, prev?: ContentBlock) => {
  const d = b.data as { linkedUp?: unknown; group?: unknown };
  if (d?.linkedUp === true) return true;
  const g = typeof d?.group === "string" && d.group.trim() ? d.group.trim() : null;
  const pg = prev
    ? (() => {
        const p = (prev.data as { group?: unknown })?.group;
        return typeof p === "string" && p.trim() ? p.trim() : null;
      })()
    : null;
  return g !== null && g === pg;
};

export const ContentBlocksProvider = ({
  page,
  children,
}: {
  page: ContentPage;
  children: ReactNode;
}) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("content_blocks")
        .select("*")
        .eq("page", page)
        .eq("visible", true);
      if (!cancelled) {
        setBlocks(((data ?? []) as unknown as ContentBlock[]).map((b) => ({
          ...b,
          variant: (b as { variant?: string }).variant ?? "markdown",
          data: ((b as { data?: unknown }).data as Record<string, unknown>) ?? {},
        })));
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const value = useMemo(() => ({ blocks, loaded }), [blocks, loaded]);
  return <PageCtx.Provider value={value}>{children}</PageCtx.Provider>;
};

export function useContentBlocks() {
  return useContext(PageCtx);
}

export type NavItem = { id: string; label: string };

/**
 * Build the page navigation from the CMS sections: one entry per linked
 * group, taking the title and anchor of the group's first section.
 */
export function useNavItems(): NavItem[] {
  const { lang } = useLang();
  const { blocks } = useContentBlocks();
  return useMemo(() => {
    const sections = blocks
      .filter((b) => b.kind === "section")
      .sort((a, b) => a.sort_order - b.sort_order);
    const items: NavItem[] = [];
    sections.forEach((s, i) => {
      if (i > 0 && linkedUp(s, sections[i - 1])) return;
      const id = blockAnchorId(s);
      const label = (lang === "en" ? s.title_en?.trim() : "") || s.title_no?.trim();
      if (!id || !label) return;
      items.push({ id, label });
    });
    return items;
  }, [blocks, lang]);
}

/** Return the localized markdown for a named slot, or null if not set. */
export function useSlot(key: string): { title: string | null; body: string } | null {
  const { lang } = useLang();
  const { blocks } = useContentBlocks();
  const row = blocks.find((b) => b.kind === "slot" && b.key === key);
  if (!row) return null;
  const body = lang === "en" ? (row.body_md_en?.trim() || row.body_md_no) : row.body_md_no;
  const title = lang === "en" ? (row.title_en?.trim() || row.title_no) : row.title_no;
  if (!body || !body.trim()) return null;
  return { title: title ?? null, body };
}

/** Render safe markdown with the site typography. */
export function useSlotRaw(key: string): string | null {
  const { blocks } = useContentBlocks();
  const row = blocks.find((b) => b.kind === "slot" && b.key === key);
  return row?.body_md_no ?? null;
}

/** Render safe markdown with the site typography. */
export const MdBlock = ({ md, className }: { md: string; className?: string }) => (
  <div
    className={
      "font-body leading-relaxed text-foreground " +
      "[&_h1]:font-display [&_h1]:text-3xl [&_h1]:mt-6 [&_h1]:mb-3 " +
      "[&_h2]:font-heading [&_h2]:text-2xl [&_h2]:mt-5 [&_h2]:mb-2 " +
      "[&_h3]:font-heading [&_h3]:text-xl [&_h3]:mt-4 [&_h3]:mb-2 " +
      "[&_p]:my-3 [&_p]:text-muted-foreground [&_p]:max-w-2xl " +
      "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:text-muted-foreground " +
      "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:text-muted-foreground " +
      "[&_a]:text-primary [&_a]:underline hover:[&_a]:opacity-80 " +
      "[&_strong]:text-foreground [&_strong]:font-semibold " +
      "[&_code]:font-mono [&_code]:text-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded " +
      "[&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic " +
      (className ?? "")
    }
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
  </div>
);

/**
 * Render every visible custom section that belongs after the code section
 * identified by `after` — i.e. every DB row whose `sort_order` falls
 * between this code section's order and the next one's.
 *
 * The rendered output depends on each block's `variant` (markdown, map,
 * training-info, image, video, …).
 */
const SectionRun = ({ sections }: { sections: ContentBlock[] }) => {
  if (sections.length === 0) return null;
  let stripe = -1;
  const rows = sections.map((s, i) => {
    const continues = i > 0 && linkedUp(s, sections[i - 1]);
    if (!continues) stripe += 1;
    const isLastOfGroup =
      i + 1 >= sections.length || !linkedUp(sections[i + 1], s);
    return { block: s, striped: stripe % 2 === 1, continues, isLastOfGroup };
  });
  return (
    <>
      {rows.map(({ block, striped, continues, isLastOfGroup }) => {
        const V = getVariant(block.variant);
        const cls = [
          "cms-block",
          striped ? "cms-block-striped" : "",
          continues ? "cms-group-cont" : "",
          !isLastOfGroup ? "cms-group-open" : "",
        ].filter(Boolean).join(" ");
        return (
          <div key={block.id} className={cls}>
            <V.render {...block} />
          </div>
        );
      })}
    </>
  );
};

export const AfterSection = ({
  page,
  after,
}: {
  page: ContentPage;
  after: string;
}) => {
  const { blocks } = useContentBlocks();
  const { from, to } = afterRange(page, after);
  const sections = blocks
    .filter((b) => b.kind === "section" && b.sort_order > from && b.sort_order < to)
    .sort((a, b) => a.sort_order - b.sort_order);
  return <SectionRun sections={sections} />;
};

/** Render every visible section on the page, in order (used by custom pages). */
export const AllSections = () => {
  const { blocks } = useContentBlocks();
  const sections = blocks
    .filter((b) => b.kind === "section")
    .sort((a, b) => a.sort_order - b.sort_order);
  return <SectionRun sections={sections} />;
};

/**
 * Legacy anchor renderer kept for backwards compatibility during the
 * migration. Matches on the old `key`-based anchor semantics.
 * Prefer `<AfterSection page="…" after="…" />` in new code.
 */
export const SectionAnchor = ({ anchor }: { anchor: string }) => {
  const { blocks } = useContentBlocks();
  const sections = blocks
    .filter((b) => b.kind === "section" && b.key === anchor)
    .sort((a, b) => a.sort_order - b.sort_order);
  if (sections.length === 0) return null;
  return (
    <>
      {sections.map((s) => {
        const V = getVariant(s.variant);
        return <V.render key={s.id} {...s} />;
      })}
    </>
  );
};