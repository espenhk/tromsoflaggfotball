import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
  Facebook,
  Instagram,
  Users,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FieldDiagram from "@/components/FieldDiagram";
import PositionCard from "@/components/PositionCard";
import {
  positionsDetail,
  offensePositionsDetail,
  defensePositionsDetail,
  PositionRow,
  type PositionData,
} from "@/data/positionsDetail";
import { useLang } from "@/i18n/LanguageProvider";
import { MdBlock, type ContentBlock } from "@/hooks/useContentBlocks";
import {
  offensePositions,
  defensePositions,
  positionSlugMap,
} from "@/data/positions";
import SignupForm from "@/components/SignupForm";

export type VariantKey =
  | "markdown"
  | "page-header"
  | "training-info"
  | "training-schedule"
  | "map-basic"
  | "image-card"
  | "video-embed"
  | "faq"
  | "contact-card"
  | "links-grid"
  | "signup-form"
  | "position-quiz"
  | "field-diagram"
  | "position-list";

export type FieldType = "text" | "textarea" | "markdown" | "url" | "number" | "list" | "select";

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
  /** For type: "select" — allowed values. */
  options?: { value: string; label: string }[];
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
  align,
}: { title?: string | null; id?: string; children: React.ReactNode; align?: "left" | "center" }) => (
  <section id={id} className="py-12 px-6 scroll-mt-16">
    <div className="max-w-3xl mx-auto">
      {title && (
        <h2 className={`font-display text-3xl md:text-4xl mb-4 ${align === "center" ? "text-center" : ""}`}>{title}</h2>
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
  const align = (s(block.data ?? {}, "align") || "left") as "left" | "center";
  const centered = align === "center";
  return (
    <SectionShell title={title || null} id={blockAnchorId(block)} align={align}>
      <div className={centered ? "text-center [&_p]:mx-auto [&_ul]:list-none [&_ul]:pl-0 [&_h1]:text-center [&_h2]:text-center [&_h3]:text-center" : ""}>
        <MdBlock md={body} />
      </div>
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
      className="w-full text-left rounded-xl p-4 transition-all bg-card border border-border/60 hover:bg-card/90 hover:border-primary/40"
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
        <div className="space-y-2">
          {items.map((it, i) => (
            <ContactItem key={i} item={it} lang={lang} />
          ))}
        </div>
      )}
    </SectionShell>
  );
};

const ContactItem = ({ item, lang }: { item: Record<string, unknown>; lang: "no" | "en" }) => {
  const [open, setOpen] = useState(false);
  const name = typeof item.name === "string" ? item.name : "";
  const role = pickLang(item.role_no as string, item.role_en as string, lang);
  const phone = typeof item.phone === "string" ? item.phone : "";
  const email = typeof item.email === "string" ? item.email : "";
  const note = pickLang(item.note_md_no as string, item.note_md_en as string, lang);
  const hasDetails = Boolean(email || note);
  return (
    <div className="rounded-xl border border-border bg-card/50">
      <button
        type="button"
        onClick={() => hasDetails && setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-3 text-left"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          {role && (
            <div className="text-xs uppercase tracking-widest text-primary mb-1">{role}</div>
          )}
          {name && <div className="font-heading text-base text-foreground">{name}</div>}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mt-0.5"
            >
              <Phone className="w-4 h-4" /> {phone}
            </a>
          )}
        </div>
        {hasDetails && (
          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        )}
      </button>
      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pb-4 pt-1 space-y-2">
            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary break-all"
              >
                <Mail className="w-4 h-4" /> {email}
              </a>
            )}
            {note && <MdBlock md={note} />}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Links grid ──────────────────────────────────────────────────── */

const LINK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  external: ExternalLink,
  facebook: Facebook,
  instagram: Instagram,
  phone: Phone,
  mail: Mail,
  users: Users,
  userplus: UserPlus,
  shield: ShieldCheck,
  calendar: Calendar,
  bag: ShoppingBag,
};

type LinkTone = {
  glow: string; // background of the blurred glow + inner fill
  icon: string; // icon text color
  hoverTitle: string; // group-hover title color class
};
const LINK_TONES: Record<string, LinkTone> = {
  primary: { glow: "bg-primary/10", icon: "text-primary", hoverTitle: "group-hover:text-primary" },
  facebook: { glow: "bg-[#1877F2]/15", icon: "text-[#1877F2]", hoverTitle: "group-hover:text-[#1877F2]" },
  instagram: { glow: "bg-[#E1306C]/15", icon: "text-[#E1306C]", hoverTitle: "group-hover:text-[#E1306C]" },
  sky: { glow: "bg-sky-400/15", icon: "text-sky-400", hoverTitle: "group-hover:text-sky-400" },
  rose: { glow: "bg-rose-400/15", icon: "text-rose-400", hoverTitle: "group-hover:text-rose-400" },
  emerald: { glow: "bg-emerald-400/15", icon: "text-emerald-400", hoverTitle: "group-hover:text-emerald-400" },
  amber: { glow: "bg-amber-400/15", icon: "text-amber-400", hoverTitle: "group-hover:text-amber-400" },
};

const LinksRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const items = list(data, "items");
  if (items.length === 0) return null;
  return (
    <SectionShell title={title || null} id={blockAnchorId(block)}>
      <div className="grid md:grid-cols-2 gap-2">
        {items.map((it, i) => {
          const href = typeof it.href === "string" ? it.href : "";
          const t = pickLang(it.title_no as string, it.title_en as string, lang);
          const d = pickLang(it.description_no as string, it.description_en as string, lang);
          const iconKey = (typeof it.icon === "string" ? it.icon : "external").toLowerCase();
          const Icon = LINK_ICONS[iconKey] ?? ExternalLink;
          const toneKey = (typeof it.glow === "string" ? it.glow : "primary").toLowerCase();
          const tone = LINK_TONES[toneKey] ?? LINK_TONES.primary;
          if (!href || !t) return null;
          return (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer"
              className="group relative flex items-start gap-4 px-6 py-4 rounded-xl transition-all">
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${tone.glow}`} style={{ filter: "blur(12px)" }} />
              <div className={`absolute inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${tone.glow}`} />
              <div className={`relative mt-1 ${tone.icon}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="relative flex-1 min-w-0">
                <p className={`font-heading font-medium text-foreground transition-colors ${tone.hoverTitle}`}>{t}</p>
                {d && <p className="text-sm text-muted-foreground font-body mt-1">{d}</p>}
              </div>
            </a>
          );
        })}
      </div>
    </SectionShell>
  );
};

/* ── Signup / interest form ─────────────────────────────────────── */

const SignupFormRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const heading = pickLang(block.title_no, block.title_en, lang);
  const intro = bi(data, "intro", lang);
  const cta = bi(data, "cta", lang);
  const success = bi(data, "success", lang);
  const iconKey = s(data, "icon") || "users";
  return (
    <SignupForm
      heading={heading || null}
      iconKey={iconKey}
      introMd={intro || null}
      ctaLabel={cta || null}
      successMd={success || null}
      anchorId={blockAnchorId(block) || "prov-en-trening"}
    />
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

/* ── Page header (big display title + optional intro) ─────────── */

const PageHeaderRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const intro = pickLang(
    typeof data.intro_no === "string" ? (data.intro_no as string) : null,
    typeof data.intro_en === "string" ? (data.intro_en as string) : null,
    lang,
  );
  if (!title && !intro) return null;
  return (
    <section id={blockAnchorId(block)} className="pt-4 pb-2 px-6 scroll-mt-16">
      <div className="max-w-2xl mx-auto">
        {title && (
          <h1 className="font-display text-4xl md:text-5xl mt-3 mb-2">{title}</h1>
        )}
        {intro && <MdBlock md={intro} className="mb-4" />}
      </div>
    </section>
  );
};

/* ── Position quiz ────────────────────────────────────────────── */

type QuizAnswerData = { label: string; weights: Record<string, number> };
type QuizQuestionData = { q: string; answers: QuizAnswerData[] };

const ALL_POSITIONS = [...offensePositions, ...defensePositions];

const PositionQuizGame = ({
  questions,
  labels,
}: {
  questions: QuizQuestionData[];
  labels: {
    questionN: (n: number, total: number) => string;
    yourPosition: string;
    readMore: string;
    seeScores: string;
    retake: string;
  };
}) => {
  const [answers, setAnswers] = useState<number[]>([]);
  const total = questions.length;
  const idx = answers.length;
  const done = idx >= total;

  const result = useMemo(() => {
    if (!done) return null;
    const score: Record<string, number> = {};
    answers.forEach((ai, qi) => {
      const w = questions[qi].answers[ai]?.weights ?? {};
      Object.keys(w).forEach((k) => {
        score[k] = (score[k] ?? 0) + (w[k] ?? 0);
      });
    });
    const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return { winners: [] as string[], sorted };
    const top = sorted[0][1];
    const winners = sorted.filter(([, s]) => s === top).map(([k]) => k);
    return { winners, sorted };
  }, [done, answers, questions]);

  if (total === 0) return null;
  if (!done) {
    return (
      <div className="rounded-lg border border-border bg-card/50 p-6">
        <div className="flex items-center gap-1 mb-6">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < idx ? "bg-primary" : i === idx ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          {labels.questionN(idx + 1, total)}
        </div>
        <h2 className="font-heading text-xl md:text-2xl mb-6">{questions[idx].q}</h2>
        <div className="flex flex-col gap-3">
          {questions[idx].answers.map((a, ai) => (
            <button
              key={ai}
              onClick={() => setAnswers([...answers, ai])}
              className="text-left px-4 py-3 rounded-md border border-border bg-background hover:border-primary hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)] transition"
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const abbrToPosition = (abbr: string) => ALL_POSITIONS.find((p) => p.abbr === abbr);

  return (
    <div className="rounded-lg border border-border bg-card/50 p-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
        {labels.yourPosition}
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        {result?.winners.map((abbr) => {
          const p = abbrToPosition(abbr);
          if (!p) return null;
          const slug = positionSlugMap[p.name];
          return (
            <Link
              key={abbr}
              to={`/posisjoner#${slug}`}
              className="flex-1 min-w-[180px] rounded-md border border-primary/50 bg-primary/5 p-5 hover:shadow-[0_0_12px_hsl(var(--primary)/0.5)] transition"
            >
              <div className="font-display text-3xl">{p.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{p.abbr}</div>
              <div className="text-sm mt-3 text-primary">{labels.readMore}</div>
            </Link>
          );
        })}
      </div>
      <details className="mb-6 text-sm text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">{labels.seeScores}</summary>
        <ul className="mt-3 space-y-1">
          {result?.sorted.map(([k, s]) => (
            <li key={k} className="flex justify-between border-b border-border/50 py-1">
              <span>{abbrToPosition(k)?.name ?? k}</span>
              <span className="font-mono">{s}</span>
            </li>
          ))}
        </ul>
      </details>
      <button
        onClick={() => setAnswers([])}
        className="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm"
      >
        {labels.retake}
      </button>
    </div>
  );
};

const PositionQuizRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const rawItems = list(data, "items");
  const questions: QuizQuestionData[] = rawItems
    .map((it) => {
      const q = pickLang(it.q_no as string, it.q_en as string, lang);
      const rawAnswers = Array.isArray(it.answers)
        ? (it.answers as Record<string, unknown>[])
        : [];
      const answers: QuizAnswerData[] = rawAnswers
        .map((a) => {
          const label = pickLang(a.a_no as string, a.a_en as string, lang);
          const weightsRaw = Array.isArray(a.weights)
            ? (a.weights as Record<string, unknown>[])
            : [];
          const weights: Record<string, number> = {};
          weightsRaw.forEach((w) => {
            const p = typeof w.position === "string" ? w.position : "";
            const v = Number(w.weight);
            if (p && Number.isFinite(v)) weights[p] = (weights[p] ?? 0) + v;
          });
          return { label, weights };
        })
        .filter((a) => a.label);
      return { q, answers };
    })
    .filter((x) => x.q && x.answers.length > 0);

  const labels =
    lang === "en"
      ? {
          questionN: (n: number, total: number) => `Question ${n} / ${total}`,
          yourPosition: "Your position",
          readMore: "Read more →",
          seeScores: "See full scores",
          retake: "Retake the quiz",
        }
      : {
          questionN: (n: number, total: number) => `Spørsmål ${n} / ${total}`,
          yourPosition: "Din posisjon",
          readMore: "Les mer →",
          seeScores: "Se alle poeng",
          retake: "Ta quizen på nytt",
        };

  return (
    <section id={blockAnchorId(block) ?? "quiz"} className="py-4 px-6 scroll-mt-16">
      <div className="max-w-2xl mx-auto">
        {title && (
          <h2 className="font-heading text-2xl md:text-3xl mb-4">{title}</h2>
        )}
        <PositionQuizGame questions={questions} labels={labels} />
      </div>
    </section>
  );
};

export const VARIANTS: Record<VariantKey, Variant> = {
};

/* ── Field diagram ─────────────────────────────────────────── */

const PLAYER_COLORS: Record<string, { fill: string; ring: string; text: string }> = {
  amber: { fill: "fill-amber-400", ring: "stroke-amber-400", text: "text-amber-950" },
  emerald: { fill: "fill-emerald-400", ring: "stroke-emerald-400", text: "text-emerald-950" },
  sky: { fill: "fill-sky-400", ring: "stroke-sky-400", text: "text-sky-950" },
  rose: { fill: "fill-rose-400", ring: "stroke-rose-400", text: "text-rose-950" },
  orange: { fill: "fill-orange-400", ring: "stroke-orange-400", text: "text-orange-950" },
};
const ROUTE_COLORS: Record<string, string> = {
  sky: "stroke-sky-400",
  emerald: "stroke-emerald-400",
  amber: "stroke-amber-400",
  rose: "stroke-rose-400",
  orange: "stroke-orange-400",
};

const CustomFieldSvg = ({
  players,
  routes,
}: {
  players: { label: string; x: number; y: number; color: string }[];
  routes: { from: string; to_x: number; to_y: number; color: string }[];
}) => {
  const byLabel = Object.fromEntries(players.map((p) => [p.label, p]));
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[2/3] rounded-xl overflow-hidden bg-emerald-900/60 border border-emerald-500/30">
      {/* Field lines */}
      <svg viewBox="0 0 100 150" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {/* End zones */}
        <rect x="0" y="0" width="100" height="15" className="fill-emerald-950/50" />
        <rect x="0" y="135" width="100" height="15" className="fill-emerald-950/50" />
        {/* Yard lines every 10 yd */}
        {[15, 30, 45, 60, 75, 90, 105, 120, 135].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} className="stroke-white/20" strokeWidth="0.3" />
        ))}
        {/* Midfield */}
        <line x1="0" y1="75" x2="100" y2="75" className="stroke-white/40" strokeWidth="0.6" />
        {/* Routes */}
        {routes.map((r, i) => {
          const from = byLabel[r.from];
          if (!from) return null;
          const stroke = ROUTE_COLORS[r.color] ?? "stroke-sky-400";
          const y1 = (from.y / 100) * 150;
          const y2 = (r.to_y / 100) * 150;
          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={y1}
                x2={r.to_x}
                y2={y2}
                strokeWidth="0.8"
                strokeDasharray="1.5,1.5"
                className={stroke}
                markerEnd={`url(#arrow-${r.color})`}
              />
            </g>
          );
        })}
        <defs>
          {Object.keys(ROUTE_COLORS).map((c) => (
            <marker
              key={c}
              id={`arrow-${c}`}
              markerWidth="6"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L5,3 L0,6 z" className={ROUTE_COLORS[c].replace("stroke-", "fill-")} />
            </marker>
          ))}
        </defs>
      </svg>
      {/* Players */}
      {players.map((p, i) => {
        const tone = PLAYER_COLORS[p.color] ?? PLAYER_COLORS.sky;
        return (
          <div
            key={i}
            className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-heading text-xs font-bold ${tone.text}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: "currentColor",
            }}
          >
            <span
              className={`absolute inset-0 rounded-full ${tone.fill.replace("fill-", "bg-")}`}
              aria-hidden
            />
            <span className="relative">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const FieldDiagramRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const preset = (s(data, "preset") || "simple") as "simple" | "classic";
  const fullscreen = s(data, "fullscreen") === "yes";
  const rawPlayers = list(data, "players");
  const rawRoutes = list(data, "routes");
  const players = rawPlayers
    .map((p) => ({
      label: typeof p.label === "string" ? p.label : "",
      x: Number(p.x),
      y: Number(p.y),
      color: typeof p.color === "string" ? p.color : "sky",
    }))
    .filter((p) => p.label && Number.isFinite(p.x) && Number.isFinite(p.y));
  const routes = rawRoutes
    .map((r) => ({
      from: typeof r.from === "string" ? r.from : "",
      to_x: Number(r.to_x),
      to_y: Number(r.to_y),
      color: typeof r.color === "string" ? r.color : "sky",
    }))
    .filter((r) => r.from && Number.isFinite(r.to_x) && Number.isFinite(r.to_y));

  const inner =
    players.length > 0 ? (
      <CustomFieldSvg players={players} routes={routes} />
    ) : (
      <FieldDiagram
        variant={preset}
        fullscreen={fullscreen}
        onPositionNavigate={(slug) => navigate(`/posisjoner#${slug}`)}
        navigateMode="direct"
      />
    );

  if (fullscreen && players.length === 0) {
    return (
      <section id={blockAnchorId(block)} className="relative w-full scroll-mt-16">
        {title && (
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground max-w-3xl mx-auto px-6 pt-8 pb-2">{title}</h2>
        )}
        {inner}
      </section>
    );
  }

  return (
    <SectionShell title={title || null} id={blockAnchorId(block)}>
      {inner}
    </SectionShell>
  );
};

/* ── Position list ─────────────────────────────────────────── */

const HEADING_TONES: Record<string, string> = {
  sky: "text-sky-400",
  rose: "text-rose-400",
  primary: "text-primary",
  none: "text-foreground",
};

const PositionListRenderer = (block: ContentBlock) => {
  const { lang } = useLang();
  const data = block.data ?? {};
  const title = pickLang(block.title_no, block.title_en, lang);
  const side = (s(data, "side") || "offense") as "offense" | "defense" | "custom";
  const layout = (s(data, "layout") || "stack") as "stack" | "grid";
  const headingTone = s(data, "heading_tone") || "auto";
  const toneClass =
    headingTone === "auto"
      ? side === "offense"
        ? "text-sky-400"
        : side === "defense"
          ? "text-rose-400"
          : "text-foreground"
      : HEADING_TONES[headingTone] ?? "text-foreground";

  let items: PositionData[] = [];
  if (side === "offense") items = offensePositionsDetail;
  else if (side === "defense") items = defensePositionsDetail;
  else {
    const ids = list(data, "ids")
      .map((it) => (typeof it.id === "string" ? it.id : ""))
      .filter(Boolean);
    const byId = Object.fromEntries(positionsDetail.map((p) => [p.id, p]));
    items = ids.map((id) => byId[id]).filter(Boolean);
  }
  if (items.length === 0) return null;

  const gridEntries = layout === "grid"
    ? items
        .map((p) => ({
          full: p,
          entry: [...offensePositions, ...defensePositions].find((e) => e.abbr === p.abbr),
        }))
        .filter((x): x is { full: PositionData; entry: NonNullable<typeof x.entry> } => !!x.entry)
    : [];

  return (
    <PositionListSection title={title} id={blockAnchorId(block)} heading={toneClass}>
      {layout === "stack" ? (
        <StackList items={items} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {gridEntries.map(({ full, entry }) => (
            <PositionCard
              key={full.id}
              name={entry.name}
              abbr={entry.abbr}
              taglineKey={entry.taglineKey}
              icon={entry.icon}
              glowBg={entry.glowBg}
              supColor={entry.supColor}
              roleKey={entry.roleKey}
              traitsKey={entry.traitsKey}
              nflExamples={entry.nflExamples}
              variant={full.side}
            />
          ))}
        </div>
      )}
    </PositionListSection>
  );
};

const PositionListSection = ({
  title,
  id,
  heading,
  children,
}: {
  title: string;
  id?: string;
  heading: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="py-8 px-6 scroll-mt-16">
    <div className="max-w-4xl mx-auto space-y-4">
      {title && (
        <h3 className={`font-heading text-lg font-medium ${heading}`}>{title}</h3>
      )}
      {children}
    </div>
  </section>
);

const StackList = ({ items }: { items: PositionData[] }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div>
      {items.map((pos) => (
        <PositionRow
          key={pos.id}
          pos={pos}
          open={openId === pos.id}
          onToggle={() => setOpenId(openId === pos.id ? null : pos.id)}
        />
      ))}
    </div>
  );
};

const VARIANT_STUB__end_of_renderers__: null = null;

const VARIANTS_INNER: Record<VariantKey, Variant> = {
  "markdown": {
    key: "markdown",
    label: "Markdown",
    usesMarkdownBody: true,
    dataFields: [
      {
        key: "align",
        label: "Justering",
        type: "select",
        options: [
          { value: "left", label: "Venstre" },
          { value: "center", label: "Sentrert" },
        ],
      },
    ],
    render: MarkdownRenderer,
  },
  "page-header": {
    key: "page-header",
    label: "Sidetittel + intro",
    usesMarkdownBody: false,
    dataFields: [
      { key: "intro", label: "Introtekst (markdown)", type: "markdown", bilingual: true },
    ],
    render: PageHeaderRenderer,
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
            label: "Ikon",
            type: "select",
            options: [
              { value: "calendar", label: "Kalender" },
              { value: "clock", label: "Klokke" },
              { value: "pin", label: "Kart-nål" },
              { value: "bag", label: "Bag / utstyr" },
              { value: "info", label: "Info" },
            ],
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
        label: "Karttype",
        type: "select",
        options: [
          { value: "roadmap", label: "Kart" },
          { value: "satellite", label: "Satellitt" },
          { value: "hybrid", label: "Hybrid" },
          { value: "terrain", label: "Terreng" },
        ],
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
          {
            key: "icon",
            label: "Ikon",
            type: "select",
            options: [
              { value: "external", label: "Ekstern lenke" },
              { value: "facebook", label: "Facebook" },
              { value: "instagram", label: "Instagram" },
              { value: "phone", label: "Telefon" },
              { value: "mail", label: "E-post" },
              { value: "users", label: "Personer" },
              { value: "userplus", label: "Bli medlem" },
              { value: "shield", label: "Skjold / forsikring" },
              { value: "calendar", label: "Kalender" },
              { value: "bag", label: "Bag / utstyr" },
            ],
          },
          {
            key: "glow",
            label: "Glow-farge",
            type: "select",
            options: [
              { value: "primary", label: "Primær (rød)" },
              { value: "facebook", label: "Facebook-blå" },
              { value: "instagram", label: "Instagram-rosa" },
              { value: "sky", label: "Himmelblå" },
              { value: "rose", label: "Rosa" },
              { value: "emerald", label: "Grønn" },
              { value: "amber", label: "Gul" },
            ],
          },
        ],
      },
    ],
    render: LinksRenderer,
  },
  "signup-form": {
    key: "signup-form",
    label: "Meld interesse (skjema)",
    usesMarkdownBody: false,
    dataFields: [
      {
        key: "icon",
        label: "Ikon",
        type: "select",
        options: [
          { value: "users", label: "Personer" },
          { value: "megaphone", label: "Megafon" },
          { value: "userplus", label: "Bli med" },
          { value: "flag", label: "Flagg" },
          { value: "shield", label: "Skjold" },
        ],
      },
      { key: "intro", label: "Introtekst (markdown, overstyrer standard)", type: "markdown", bilingual: true },
      { key: "cta", label: "Knappetekst (kollapset)", type: "text", bilingual: true, placeholder: "Meld interesse" },
      { key: "success", label: "Suksessmelding (markdown)", type: "markdown", bilingual: true },
    ],
    render: SignupFormRenderer,
  },
  "position-quiz": {
    key: "position-quiz",
    label: "Posisjonsquiz",
    usesMarkdownBody: false,
    dataFields: [
      {
        key: "items",
        label: "Spørsmål",
        type: "list",
        itemLabel: "spørsmål",
        itemFields: [
          { key: "q", label: "Spørsmål", type: "textarea", bilingual: true },
          {
            key: "answers",
            label: "Svaralternativer",
            type: "list",
            itemLabel: "svar",
            itemFields: [
              { key: "a", label: "Svartekst", type: "textarea", bilingual: true },
              {
                key: "weights",
                label: "Poeng til posisjoner",
                type: "list",
                itemLabel: "posisjon",
                itemFields: [
                  {
                    key: "position",
                    label: "Posisjon",
                    type: "select",
                    options: ALL_POSITIONS.map((p) => ({
                      value: p.abbr,
                      label: `${p.abbr} — ${p.name}`,
                    })),
                  },
                  { key: "weight", label: "Poeng", type: "number", placeholder: "1" },
                ],
              },
            ],
          },
        ],
      },
    ],
    render: PositionQuizRenderer,
  },
  "field-diagram": {
    key: "field-diagram",
    label: "Banediagram",
    usesMarkdownBody: false,
    dataFields: [
      {
        key: "preset",
        label: "Feltvariant",
        type: "select",
        options: [
          { value: "simple", label: "Fullt felt (posisjoner-side)" },
          { value: "classic", label: "Kort felt (forside)" },
        ],
      },
      {
        key: "fullscreen",
        label: "Fullskjerm",
        type: "select",
        options: [
          { value: "no", label: "Nei — inline" },
          { value: "yes", label: "Ja — bredt / kant-til-kant" },
        ],
      },
      {
        key: "players",
        label: "Egendefinerte spillere (valgfritt — overstyrer preset)",
        type: "list",
        itemLabel: "spiller",
        itemFields: [
          { key: "label", label: "Etikett", type: "text", placeholder: "QB" },
          { key: "x", label: "X (0–100 %)", type: "number", placeholder: "50" },
          { key: "y", label: "Y (0–100 %, 0 = topp)", type: "number", placeholder: "70" },
          {
            key: "color",
            label: "Farge",
            type: "select",
            options: [
              { value: "amber", label: "Gul (QB)" },
              { value: "emerald", label: "Grønn (RB)" },
              { value: "sky", label: "Blå (WR/C)" },
              { value: "rose", label: "Rosa (DB/S)" },
              { value: "orange", label: "Oransje (Rusher)" },
            ],
          },
        ],
      },
      {
        key: "routes",
        label: "Egendefinerte ruter (valgfritt)",
        type: "list",
        itemLabel: "rute",
        itemFields: [
          { key: "from", label: "Fra-etikett", type: "text", placeholder: "QB" },
          { key: "to_x", label: "Til X (%)", type: "number", placeholder: "70" },
          { key: "to_y", label: "Til Y (%)", type: "number", placeholder: "30" },
          {
            key: "color",
            label: "Farge",
            type: "select",
            options: [
              { value: "sky", label: "Blå" },
              { value: "emerald", label: "Grønn" },
              { value: "amber", label: "Gul" },
              { value: "rose", label: "Rosa" },
              { value: "orange", label: "Oransje" },
            ],
          },
        ],
      },
    ],
    render: FieldDiagramRenderer,
  },
  "position-list": {
    key: "position-list",
    label: "Posisjonsliste",
    usesMarkdownBody: false,
    dataFields: [
      {
        key: "side",
        label: "Side",
        type: "select",
        options: [
          { value: "offense", label: "Offense (angrep)" },
          { value: "defense", label: "Defense (forsvar)" },
          { value: "custom", label: "Egen utvalg" },
        ],
      },
      {
        key: "layout",
        label: "Visning",
        type: "select",
        options: [
          { value: "stack", label: "Stabel (klikk for detaljer, som posisjoner-siden)" },
          { value: "grid", label: "Rutenett (kompakt, som forsiden)" },
        ],
      },
      {
        key: "heading_tone",
        label: "Overskrift-farge",
        type: "select",
        options: [
          { value: "auto", label: "Auto (sky/rose etter side)" },
          { value: "sky", label: "Blå" },
          { value: "rose", label: "Rosa" },
          { value: "primary", label: "Primær" },
          { value: "none", label: "Ingen (vanlig tekst)" },
        ],
      },
      {
        key: "ids",
        label: "Egendefinerte posisjoner (bare hvis side = «Egen utvalg»)",
        type: "list",
        itemLabel: "posisjon",
        itemFields: [
          {
            key: "id",
            label: "Posisjon",
            type: "select",
            options: positionsDetail.map((p) => ({ value: p.id, label: `${p.abbr} — ${p.name}` })),
          },
        ],
      },
    ],
    render: PositionListRenderer,
  },
};

export const VARIANT_ORDER: VariantKey[] = [
  "markdown", "page-header", "training-info", "training-schedule", "signup-form", "faq", "contact-card",
  "links-grid", "field-diagram", "position-list", "position-quiz", "map-basic", "image-card", "video-embed",
];

export function getVariant(key: string): Variant {
  return (VARIANTS as Record<string, Variant>)[key] ?? VARIANTS.markdown;
}