import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { useT } from "@/i18n/LanguageProvider";
import { useLang } from "@/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";

type Match = {
  id: string;
  kicks_off_at: string;
  venue: string | null;
  round_label: string | null;
  home_name: string;
  home_tag: string | null;
  home_logo: string | null;
  home_color: string | null;
  home_score: number | null;
  away_name: string;
  away_tag: string | null;
  away_logo: string | null;
  away_color: string | null;
  away_score: number | null;
};

const played = (m: Match) => m.home_score !== null || m.away_score !== null;

const Kamper = () => {
  const t = useT();
  const { lang } = useLang();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          "id,kicks_off_at,venue,round_label,home_name,home_tag,home_logo,home_color,home_score,away_name,away_tag,away_logo,away_color,away_score",
        )
        .order("kicks_off_at", { ascending: true });
      if (cancelled) return;
      if (error) setError(true);
      else setMatches((data ?? []) as Match[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const locale = lang === "en" ? "en-GB" : "nb-NO";

  const upcoming = useMemo(
    () => matches.filter((m) => !played(m)),
    [matches],
  );
  const results = useMemo(
    () => matches.filter(played).slice().reverse(),
    [matches],
  );

  useEffect(() => {
    document.title = lang === "en" ? "Fixtures & results | Tromsø Flaggfotball" : "Kamper og resultater | Tromsø Flaggfotball";
  }, [lang]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/20" style={{ backgroundColor: "hsl(3 79% 49%)" }}>
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-3 py-3">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <BrandLogo variant="mark" whiteMark alt="Logo" className="h-6 w-auto" />
          </Link>
          <h1 className="font-heading font-medium text-white text-sm">{t("matches.headerTitle")}</h1>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <header className="space-y-3">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t("matches.h2")}</h2>
          <p className="text-muted-foreground font-body leading-relaxed max-w-2xl">{t("matches.intro")}</p>
        </header>

        {loading && <p className="text-muted-foreground font-body">{t("matches.loading")}</p>}
        {error && <p className="text-muted-foreground font-body">{t("matches.error")}</p>}

        {!loading && !error && (
          <>
            <MatchGroup title={t("matches.upcoming")} empty={t("matches.noUpcoming")} matches={upcoming} locale={locale} />
            <MatchGroup title={t("matches.results")} empty={t("matches.noResults")} matches={results} locale={locale} showScore />
          </>
        )}

        <div className="pt-2 pb-8">
          <Link to="/" className="text-sm hover:underline font-body inline-flex items-center gap-1 text-primary">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("posPage.back")}
          </Link>
        </div>
      </main>
    </div>
  );
};

const MatchGroup = ({
  title, empty, matches, locale, showScore = false,
}: {
  title: string;
  empty: string;
  matches: Match[];
  locale: string;
  showScore?: boolean;
}) => (
  <section className="space-y-4">
    <h3 className="font-heading text-lg font-bold text-foreground uppercase tracking-wide">{title}</h3>
    {matches.length === 0 ? (
      <p className="text-sm text-muted-foreground font-body">{empty}</p>
    ) : (
      <ul className="space-y-3">
        {matches.map((m) => (
          <MatchRow key={m.id} match={m} locale={locale} showScore={showScore} />
        ))}
      </ul>
    )}
  </section>
);

const Team = ({
  name, tag, logo, color, align,
}: {
  name: string;
  tag: string | null;
  logo: string | null;
  color: string | null;
  align: "left" | "right";
}) => (
  <div className={`flex items-center gap-3 min-w-0 flex-1 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
    <span
      className="h-9 w-9 shrink-0 rounded-full border border-border/60 bg-muted/40 bg-cover bg-center"
      style={{
        backgroundImage: logo ? `url(${logo})` : undefined,
        boxShadow: color ? `0 0 12px ${color}55` : undefined,
      }}
      aria-hidden="true"
    />
    <div className="min-w-0">
      <div className="font-heading font-bold text-foreground truncate">{name}</div>
      {tag && <div className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">{tag}</div>}
    </div>
  </div>
);

const MatchRow = ({ match: m, locale, showScore }: { match: Match; locale: string; showScore: boolean }) => {
  const when = new Date(m.kicks_off_at);
  const dateLabel = when.toLocaleDateString(locale, { weekday: "short", day: "2-digit", month: "short" });
  const timeLabel = when.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });

  return (
    <li className="rounded-xl border border-border bg-card/50 px-4 py-4 transition-shadow hover:shadow-[0_0_12px_hsl(var(--primary)/0.35)]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="w-3.5 h-3.5" />
          <time dateTime={m.kicks_off_at}>{dateLabel} · {timeLabel}</time>
        </span>
        {m.venue && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {m.venue}
          </span>
        )}
        {m.round_label && <span>{m.round_label}</span>}
      </div>
      <div className="flex items-center gap-3">
        <Team name={m.home_name} tag={m.home_tag} logo={m.home_logo} color={m.home_color} align="left" />
        <div className="shrink-0 px-2 text-center">
          {showScore ? (
            <span className="font-heading text-2xl font-bold text-primary tabular-nums">
              {m.home_score ?? 0}–{m.away_score ?? 0}
            </span>
          ) : (
            <span className="font-heading text-sm font-bold text-muted-foreground">VS</span>
          )}
        </div>
        <Team name={m.away_name} tag={m.away_tag} logo={m.away_logo} color={m.away_color} align="right" />
      </div>
    </li>
  );
};

export default Kamper;