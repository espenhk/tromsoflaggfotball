/**
 * Footer links are stored as a CMS text slot (`footer.links`) whose body is a
 * JSON array. Using a slot keeps them inside the normal draft/save/undo flow
 * without showing up as a section in the page flow.
 */
export const FOOTER_LINKS_SLOT = "footer.links";

export type FooterLink = {
  href: string;
  label_no: string;
  label_en?: string;
};

export function parseFooterLinks(raw: string | null | undefined): FooterLink[] | null {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    const links = parsed
      .map((l): FooterLink | null => {
        if (!l || typeof l !== "object") return null;
        const href = typeof (l as FooterLink).href === "string" ? (l as FooterLink).href.trim() : "";
        const label_no = typeof (l as FooterLink).label_no === "string" ? (l as FooterLink).label_no.trim() : "";
        if (!href || !label_no) return null;
        const en = (l as FooterLink).label_en;
        return { href, label_no, label_en: typeof en === "string" ? en.trim() : "" };
      })
      .filter((l): l is FooterLink => l !== null);
    return links;
  } catch {
    return null;
  }
}

export function serializeFooterLinks(links: FooterLink[]): string {
  // Keep partially filled rows so they survive editing; rendering filters them.
  const clean = links.map((l) => ({
    href: (l.href ?? "").trim(),
    label_no: (l.label_no ?? "").trim(),
    label_en: (l.label_en ?? "").trim(),
  }));
  return clean.length ? JSON.stringify(clean, null, 2) : "";
}

/** Lenient parse for the admin editor: keeps incomplete rows while typing. */
export function parseFooterLinksDraft(raw: string | null | undefined): FooterLink[] {
  if (!raw || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => l && typeof l === "object")
      .map((l) => ({
        href: typeof l.href === "string" ? l.href : "",
        label_no: typeof l.label_no === "string" ? l.label_no : "",
        label_en: typeof l.label_en === "string" ? l.label_en : "",
      }));
  } catch {
    return [];
  }
}

export const isInternalHref = (href: string) => href.startsWith("/") && !href.startsWith("//");
