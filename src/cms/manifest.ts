/**
 * Code-defined section registry.
 *
 * Each entry represents a section that lives in the page's TSX. The CMS
 * shows these as read-only rows in the ordered list, so admins can see
 * where custom sections will land relative to them and insert new
 * sections in between.
 *
 * `order` is the section's sort_order on the page. Custom DB sections use
 * sort_order values between the surrounding code sections (e.g. 15 sits
 * between hero=10 and om=20).
 *
 * Keep the `key` values stable — they're used by <AfterSection /> to look
 * up which DB rows to render after a given code section.
 */
export type CodeSection = { key: string; order: number; label: string };

export type CmsPage = "home" | "presse" | "quiz" | "posisjoner";

/**
 * A page identifier used by the CMS. Built-in pages use their short key
 * ("home", "presse", …). Admin-created pages live at /pages/<slug> and are
 * stored as "custom:<slug>".
 */
export type PageId = CmsPage | string;

export const CUSTOM_PREFIX = "custom:";
export const customPageId = (slug: string) => `${CUSTOM_PREFIX}${slug}`;
export const isCustomPage = (page: string): boolean => page.startsWith(CUSTOM_PREFIX);
export const customSlug = (page: string): string | null =>
  isCustomPage(page) ? page.slice(CUSTOM_PREFIX.length) : null;
/** Normalise free text into a URL-safe slug. */
export const toSlug = (s: string): string =>
  s.toLowerCase().trim()
    .replace(/[æ]/g, "ae").replace(/[ø]/g, "o").replace(/[å]/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

export const CODE_MANIFEST: Record<CmsPage, CodeSection[]> = {
  home: [
    { key: "hero",         order: 10, label: "Hero" },
  ],
  presse: [
    { key: "intro",        order: 10, label: "Intro" },
    { key: "about",        order: 20, label: "Om klubben" },
    { key: "facts",        order: 30, label: "Nøkkelfakta" },
    { key: "logos",        order: 40, label: "Logoer" },
    { key: "colors",       order: 50, label: "Farger" },
    { key: "typography",   order: 60, label: "Typografi" },
    { key: "contact",      order: 70, label: "Kontakt" },
  ],
  quiz: [],
  posisjoner: [
    { key: "intro",        order: 10, label: "Intro" },
  ],
};

/** The order at which `<AfterSection after="X" />` starts pulling DB rows. */
export function codeSections(page: PageId): CodeSection[] {
  return CODE_MANIFEST[page as CmsPage] ?? [];
}

export function afterRange(page: PageId, key: string): { from: number; to: number } {
  const list = codeSections(page);
  const i = list.findIndex((s) => s.key === key);
  if (i < 0) return { from: -Infinity, to: Infinity };
  const from = list[i].order;
  const to = i + 1 < list.length ? list[i + 1].order : Infinity;
  return { from, to };
}

/** Order value to use when inserting between two adjacent list rows. */
export function midpointOrder(prev: number, next: number): number {
  if (!Number.isFinite(next)) return Math.round(prev) + 10;
  const mid = (prev + next) / 2;
  // Prefer integer values when there's room; otherwise fall back to a float.
  const rounded = Math.round(mid);
  if (rounded > prev && rounded < next) return rounded;
  return mid;
}