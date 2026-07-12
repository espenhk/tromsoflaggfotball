import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageProvider";

export type ContentPage = "home" | "presse" | "quiz" | "posisjoner";

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
};

type Ctx = {
  blocks: ContentBlock[];
  loaded: boolean;
};

const PageCtx = createContext<Ctx>({ blocks: [], loaded: false });

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
        setBlocks((data ?? []) as ContentBlock[]);
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
 * Render every visible free-section block for the given anchor id, in order.
 * The anchor id must match `key` on a `kind = 'section'` row.
 * Renders nothing when no sections exist for the anchor.
 */
export const SectionAnchor = ({
  anchor,
  className = "",
}: {
  anchor: string;
  className?: string;
}) => {
  const { lang } = useLang();
  const { blocks } = useContentBlocks();
  const sections = blocks
    .filter((b) => b.kind === "section" && b.key === anchor)
    .sort((a, b) => a.sort_order - b.sort_order);
  if (sections.length === 0) return null;
  return (
    <>
      {sections.map((s) => {
        const body = lang === "en" ? (s.body_md_en?.trim() || s.body_md_no) : s.body_md_no;
        const title = lang === "en" ? (s.title_en?.trim() || s.title_no) : s.title_no;
        return (
          <section
            key={s.id}
            className={`py-12 px-6 ${className}`}
          >
            <div className="max-w-3xl mx-auto">
              {title && (
                <h2 className="font-display text-3xl md:text-4xl mb-4">
                  {title}
                </h2>
              )}
              <MdBlock md={body ?? ""} />
            </div>
          </section>
        );
      })}
    </>
  );
};