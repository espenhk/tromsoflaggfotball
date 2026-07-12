import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLang } from "@/i18n/LanguageProvider";
import { MdBlock, type ContentBlock } from "@/hooks/useContentBlocks";

export type VariantKey =
  | "markdown"
  | "training-info"
  | "map-basic"
  | "image-card"
  | "video-embed";

export type FieldType = "text" | "textarea" | "markdown" | "url" | "number";

export type FieldSpec = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  bilingual?: boolean; // pairs `<key>_no` and `<key>_en` under data
  help?: string;
};

export type Variant = {
  key: VariantKey;
  label: string;
  /** Whether this variant uses body_md_no/body_md_en directly. */
  usesMarkdownBody: boolean;
  /** Extra structured fields stored in `data` jsonb. */
  dataFields: FieldSpec[];
  render: (block: ContentBlock) => JSX.Element | null;
};

function pickLang(no: string | null | undefined, en: string | null | undefined, lang: string) {
  if (lang === "en") return (en && en.trim()) ? en : (no ?? "");
  return no ?? "";
}

/** Localized value for a bilingual data key. */
function bi(data: Record<string, unknown>, key: string, lang: string): string {
  const no = data[`${key}_no`];
  const en = data[`${key}_en`];
  return pickLang(typeof no === "string" ? no : null, typeof en === "string" ? en : null, lang);
}
function s(data: Record<string, unknown>, key: string): string {
  const v = data[key];
  return typeof v === "string" ? v : "";
}

const SectionShell = ({
  title,
  children,
}: { title?: string | null; children: React.ReactNode }) => (
  <section className="py-12 px-6">
    <div className="max-w-3xl mx-auto">
      {title && (
        <h2 className="font-display text-3xl md:text-4xl mb-4">{title}</h2>
      )}
      {children}
    </div>
  </section>
);

const MarkdownRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const body = pickLang(block.body_md_no, block.body_md_en, lang);
  const title = pickLang(block.title_no, block.title_en, lang);
  if (!body?.trim()) return null;
  return (
    <SectionShell title={title || null}>
      <MdBlock md={body} />
    </SectionShell>
  );
};

const TrainingInfoRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang) || (lang === "en" ? "Training" : "Trening");
  const weekday = bi(data, "weekday", lang);
  const time = s(data, "time");
  const location = bi(data, "location", lang);
  const map = s(data, "map_url");
  const notes = bi(data, "notes_md", lang);
  return (
    <SectionShell title={title}>
      <dl className="grid sm:grid-cols-3 gap-4 mb-4">
        {weekday && (
          <div>
            <dt className="text-xs uppercase tracking-widest text-muted-foreground">
              {lang === "en" ? "Day" : "Dag"}
            </dt>
            <dd className="font-heading text-lg">{weekday}</dd>
          </div>
        )}
        {time && (
          <div>
            <dt className="text-xs uppercase tracking-widest text-muted-foreground">
              {lang === "en" ? "Time" : "Tid"}
            </dt>
            <dd className="font-heading text-lg">{time}</dd>
          </div>
        )}
        {location && (
          <div>
            <dt className="text-xs uppercase tracking-widest text-muted-foreground">
              {lang === "en" ? "Location" : "Sted"}
            </dt>
            <dd className="font-heading text-lg">
              {map ? (
                <a href={map} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {location}
                </a>
              ) : location}
            </dd>
          </div>
        )}
      </dl>
      {notes && <MdBlock md={notes} />}
    </SectionShell>
  );
};

const MapRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const lat = Number(data.lat);
  const lng = Number(data.lng);
  const zoom = Number(data.zoom) || 15;
  const label = bi(data, "label", lang);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  // OpenStreetMap embed — no API key required.
  const delta = 0.01 / Math.max(1, zoom / 15);
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  return (
    <SectionShell title={title || null}>
      {label && <p className="text-muted-foreground mb-3">{label}</p>}
      <div className="aspect-video rounded-xl overflow-hidden border border-border">
        <iframe title={label || "Map"} src={src} className="w-full h-full" loading="lazy" />
      </div>
      <a
        className="text-xs text-muted-foreground hover:text-primary underline mt-2 inline-block"
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`}
        target="_blank"
        rel="noreferrer"
      >
        {lang === "en" ? "Open in OpenStreetMap" : "Åpne i OpenStreetMap"}
      </a>
    </SectionShell>
  );
};

const ImageRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const src = s(data, "image_url");
  const alt = s(data, "alt");
  const caption = bi(data, "caption", lang);
  if (!src) return null;
  return (
    <SectionShell title={title || null}>
      <figure className="rounded-xl overflow-hidden border border-border bg-card/50">
        <img src={src} alt={alt} className="w-full h-auto" loading="lazy" />
        {caption && (
          <figcaption className="px-4 py-3 text-sm text-muted-foreground">{caption}</figcaption>
        )}
      </figure>
    </SectionShell>
  );
};

/** Convert common video URLs to their embed form. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    }
    if (url.includes("/embed/") || url.includes("player.vimeo.com")) return url;
    return null;
  } catch {
    return null;
  }
}

const VideoRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const raw = s(data, "video_url");
  const embed = raw ? toEmbedUrl(raw) : null;
  const caption = bi(data, "caption", lang);
  if (!embed) return null;
  return (
    <SectionShell title={title || null}>
      <div className="aspect-video rounded-xl overflow-hidden border border-border">
        <iframe
          src={embed}
          title={title || "Video"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && <p className="text-sm text-muted-foreground mt-3">{caption}</p>}
    </SectionShell>
  );
};

export const VARIANTS: Record<VariantKey, Variant> = {
  "markdown": {
    key: "markdown",
    label: "Markdown",
    usesMarkdownBody: true,
    dataFields: [],
    render: MarkdownRenderer,
  },
  "training-info": {
    key: "training-info",
    label: "Trening (tid + sted)",
    usesMarkdownBody: false,
    dataFields: [
      { key: "weekday", label: "Ukedag", type: "text", bilingual: true, placeholder: "Onsdag" },
      { key: "time", label: "Tid", type: "text", placeholder: "18:00–19:30" },
      { key: "location", label: "Sted", type: "text", bilingual: true, placeholder: "Templarheimen kunstgress" },
      { key: "map_url", label: "Kart-lenke", type: "url", placeholder: "https://maps.google.com/..." },
      { key: "notes_md", label: "Notater (markdown)", type: "markdown", bilingual: true },
    ],
    render: TrainingInfoRenderer,
  },
  "map-basic": {
    key: "map-basic",
    label: "Kart",
    usesMarkdownBody: false,
    dataFields: [
      { key: "lat", label: "Breddegrad (lat)", type: "number", placeholder: "69.6492" },
      { key: "lng", label: "Lengdegrad (lng)", type: "number", placeholder: "18.9553" },
      { key: "zoom", label: "Zoom", type: "number", placeholder: "15" },
      { key: "label", label: "Etikett", type: "text", bilingual: true },
    ],
    render: MapRenderer,
  },
  "image-card": {
    key: "image-card",
    label: "Bilde",
    usesMarkdownBody: false,
    dataFields: [
      { key: "image_url", label: "Bilde-URL", type: "url", placeholder: "https://..." },
      { key: "alt", label: "Alt-tekst", type: "text" },
      { key: "caption", label: "Bildetekst", type: "text", bilingual: true },
    ],
    render: ImageRenderer,
  },
  "video-embed": {
    key: "video-embed",
    label: "Video (YouTube/Vimeo)",
    usesMarkdownBody: false,
    dataFields: [
      { key: "video_url", label: "Video-URL", type: "url", placeholder: "https://youtu.be/..." },
      { key: "caption", label: "Undertekst", type: "text", bilingual: true },
    ],
    render: VideoRenderer,
  },
};

export const VARIANT_ORDER: VariantKey[] = [
  "markdown", "training-info", "map-basic", "image-card", "video-embed",
];

export function getVariant(key: string): Variant {
  return (VARIANTS as Record<string, Variant>)[key] ?? VARIANTS.markdown;
}