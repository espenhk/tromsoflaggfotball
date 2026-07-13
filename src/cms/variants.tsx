import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import {
  ChevronDown,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  ShoppingBag,
  Info,
} from "lucide-react";
import { useLang } from "@/i18n/LanguageProvider";
import { MdBlock, type ContentBlock } from "@/hooks/useContentBlocks";

export type VariantKey =
  | "markdown"
  | "training-info"
  | "training-schedule"
  | "map-basic"
  | "image-card"
  | "video-embed"
  | "faq"
  | "contact-card"
  | "links-grid";

export type FieldType = "text" | "textarea" | "markdown" | "url" | "number" | "list";

export type FieldSpec = {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  bilingual?: boolean; // pairs `<key>_no` and `<key>_en` under data
  help?: string;
  /** For type: "list" — schema of a single item. Data stored as array. */
  itemFields?: FieldSpec[];
  /** For type: "list" — label used on the "add" button, e.g. "spørsmål". */
  itemLabel?: string;
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

function list(data: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const v = data[key];
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is Record<string, unknown> => !!x && typeof x === "object");
}

const SectionShell = ({
  title,
  id,
  children,
}: { title?: string | null; id?: string; children: React.ReactNode }) => (
  <section id={id} className="py-12 px-6 scroll-mt-16">
    <div className="max-w-3xl mx-auto">
      {title && (
        <h2 className="font-display text-3xl md:text-4xl mb-4">{title}</h2>
      )}
      {children}
    </div>
  </section>
);

/** Derive a scroll-target id from a CMS block's key. `foo-cms` → `foo`. */
function blockAnchorId(block: ContentBlock): string | undefined {
  if (!block.key) return undefined;
  return block.key.replace(/-cms$/, "");
}

const MarkdownRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const body = pickLang(block.body_md_no, block.body_md_en, lang);
  const title = pickLang(block.title_no, block.title_en, lang);
  if (!body?.trim()) return null;
  return (
    <SectionShell title={title || null} id={blockAnchorId(block)}>
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
    <SectionShell title={title} id={blockAnchorId(block)}>
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
    <SectionShell title={title || null} id={blockAnchorId(block)}>
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
    <SectionShell title={title || null} id={blockAnchorId(block)}>
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
    <SectionShell title={title || null} id={blockAnchorId(block)}>
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

/* ── FAQ ─────────────────────────────────────────────────────────── */

const FaqItemRow = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      className="w-full text-left rounded-xl p-4 transition-all bg-muted/60 border border-border hover:bg-muted hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-heading text-sm font-medium text-foreground leading-snug">{q}</p>
        <ChevronDown
          className={`w-4 h-4 shrink-0 mt-0.5 transition-transform duration-300 text-primary/50 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="text-xs text-muted-foreground font-body mt-2 leading-relaxed">{a}</p>
        </div>
      </div>
    </button>
  );
};

const FaqRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const items = list(data, "items");
  if (items.length === 0) return null;
  return (
    <SectionShell title={title || null} id={blockAnchorId(block)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
        {items.map((it, i) => {
          const q = pickLang(it.q_no as string, it.q_en as string, lang);
          const a = pickLang(it.a_no as string, it.a_en as string, lang);
          if (!q?.trim()) return null;
          return <FaqItemRow key={i} q={q} a={a} />;
        })}
      </div>
    </SectionShell>
  );
};

/* ── Contact card(s) ─────────────────────────────────────────────── */

const ContactRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const intro = pickLang(
    typeof data.intro_no === "string" ? (data.intro_no as string) : null,
    typeof data.intro_en === "string" ? (data.intro_en as string) : null,
    lang,
  );
  const items = list(data, "items");
  if (items.length === 0 && !intro) return null;
  return (
    <SectionShell title={title || null} id={blockAnchorId(block)}>
      {intro && <MdBlock md={intro} className="mb-6" />}
      {items.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((it, i) => {
            const name = typeof it.name === "string" ? it.name : "";
            const role = pickLang(it.role_no as string, it.role_en as string, lang);
            const phone = typeof it.phone === "string" ? it.phone : "";
            const email = typeof it.email === "string" ? it.email : "";
            const note = pickLang(it.note_md_no as string, it.note_md_en as string, lang);
            return (
              <div key={i} className="rounded-xl border border-border bg-card/50 p-5">
                {role && (
                  <div className="text-xs uppercase tracking-widest text-primary mb-1">{role}</div>
                )}
                {name && <div className="font-heading text-lg text-foreground mb-2">{name}</div>}
                <div className="space-y-1.5">
                  {phone && (
                    <a href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                      <Phone className="w-4 h-4" /> {phone}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary break-all">
                      <Mail className="w-4 h-4" /> {email}
                    </a>
                  )}
                </div>
                {note && <div className="mt-3"><MdBlock md={note} /></div>}
              </div>
            );
          })}
        </div>
      )}
    </SectionShell>
  );
};

/* ── Links grid ──────────────────────────────────────────────────── */

const LinksRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const items = list(data, "items");
  if (items.length === 0) return null;
  return (
    <SectionShell title={title || null} id={blockAnchorId(block)}>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, i) => {
          const href = typeof it.href === "string" ? it.href : "";
          const t = pickLang(it.title_no as string, it.title_en as string, lang);
          const d = pickLang(it.description_no as string, it.description_en as string, lang);
          if (!href || !t) return null;
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer"
              className="group flex items-start gap-3 px-5 py-4 rounded-xl border border-border bg-card/50 hover:border-primary/50 hover:bg-card transition-all">
              <ExternalLink className="w-4 h-4 mt-1 text-primary/70 group-hover:text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-heading text-base text-foreground group-hover:text-primary">{t}</div>
                {d && <div className="text-sm text-muted-foreground mt-0.5">{d}</div>}
              </div>
            </a>
          );
        })}
      </div>
    </SectionShell>
  );
};

/* ── Training schedule (info items + map) ────────────────────────── */

const TRAINING_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  clock: Clock,
  pin: MapPin,
  bag: ShoppingBag,
  info: Info,
};

const TrainingScheduleRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const items = list(data, "items");
  const mapQuery = s(data, "map_query");
  const mapZoom = Number(data.map_zoom) || 17;
  const mapType = s(data, "map_type") || "satellite";
  const apiKey =
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
    "AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8";
  const mapSrc = mapQuery
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
        mapQuery,
      )}&maptype=${encodeURIComponent(mapType)}&zoom=${mapZoom}`
    : "";
  return (
    <section id={blockAnchorId(block)} className="py-16 px-6 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        {title && (
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
            {title}
          </h2>
        )}
        <div className="flex flex-col md:flex-row md:items-stretch gap-6">
          <div className="flex flex-col gap-4 md:w-1/3 shrink-0">
            {items.map((it, i) => {
              const iconKey = (typeof it.icon === "string" ? it.icon : "info").toLowerCase();
              const Icon = TRAINING_ICONS[iconKey] ?? Info;
              const label = pickLang(it.label_no as string, it.label_en as string, lang);
              const value = pickLang(it.value_no as string, it.value_en as string, lang);
              if (!label && !value) return null;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="text-primary mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">
                      {label}
                    </p>
                    <p className="font-heading text-lg font-medium text-foreground">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {mapSrc && (
            <div className="rounded-xl overflow-hidden border border-border flex-1 h-[180px] md:h-auto md:self-stretch">
              <iframe
                className="w-full h-full"
                src={mapSrc}
                title={mapQuery}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </section>
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
  "training-schedule": {
    key: "training-schedule",
    label: "Treninger (info + kart)",
    usesMarkdownBody: false,
    dataFields: [
      {
        key: "items",
        label: "Info-felt",
        type: "list",
        itemLabel: "felt",
        itemFields: [
          {
            key: "icon",
            label: "Ikon (calendar, clock, pin, bag, info)",
            type: "text",
            placeholder: "calendar",
          },
          { key: "label", label: "Etikett", type: "text", bilingual: true, placeholder: "Dag" },
          {
            key: "value",
            label: "Verdi",
            type: "text",
            bilingual: true,
            placeholder: "Mandager og torsdager",
          },
        ],
      },
      {
        key: "map_query",
        label: "Kart-søk (Google Maps)",
        type: "text",
        placeholder: "TUIL Arena, Tromsø",
      },
      { key: "map_zoom", label: "Kart-zoom", type: "number", placeholder: "17" },
      {
        key: "map_type",
        label: "Karttype (roadmap eller satellite)",
        type: "text",
        placeholder: "satellite",
      },
    ],
    render: TrainingScheduleRenderer,
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
  "faq": {
    key: "faq",
    label: "FAQ (spørsmål og svar)",
    usesMarkdownBody: false,
    dataFields: [
      {
        key: "items",
        label: "Spørsmål",
        type: "list",
        itemLabel: "spørsmål",
        itemFields: [
          { key: "q", label: "Spørsmål", type: "text", bilingual: true },
          { key: "a", label: "Svar", type: "textarea", bilingual: true },
        ],
      },
    ],
    render: FaqRenderer,
  },
  "contact-card": {
    key: "contact-card",
    label: "Kontakt",
    usesMarkdownBody: false,
    dataFields: [
      { key: "intro", label: "Introtekst (markdown)", type: "markdown", bilingual: true },
      {
        key: "items",
        label: "Kontaktpersoner",
        type: "list",
        itemLabel: "kontakt",
        itemFields: [
          { key: "name", label: "Navn", type: "text" },
          { key: "role", label: "Rolle", type: "text", bilingual: true },
          { key: "phone", label: "Telefon", type: "text" },
          { key: "email", label: "E-post", type: "text" },
          { key: "note_md", label: "Notat (markdown)", type: "markdown", bilingual: true },
        ],
      },
    ],
    render: ContactRenderer,
  },
  "links-grid": {
    key: "links-grid",
    label: "Lenker (kort-rutenett)",
    usesMarkdownBody: false,
    dataFields: [
      {
        key: "items",
        label: "Lenker",
        type: "list",
        itemLabel: "lenke",
        itemFields: [
          { key: "title", label: "Tittel", type: "text", bilingual: true },
          { key: "description", label: "Beskrivelse", type: "text", bilingual: true },
          { key: "href", label: "URL", type: "url", placeholder: "https://..." },
        ],
      },
    ],
    render: LinksRenderer,
  },
};

export const VARIANT_ORDER: VariantKey[] = [
  "markdown", "training-info", "training-schedule", "faq", "contact-card", "links-grid",
  "map-basic", "image-card", "video-embed",
];

export function getVariant(key: string): Variant {
  return (VARIANTS as Record<string, Variant>)[key] ?? VARIANTS.markdown;
}