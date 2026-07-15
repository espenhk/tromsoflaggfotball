import { Facebook, Instagram, Phone, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageProvider";
import {
  ContentBlocksProvider,
  AfterSection,
  MdBlock,
  useSlot,
} from "@/hooks/useContentBlocks";
import heroBg from "@/assets/hero-bg.png";
import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "@/theme/ThemeProvider";
import LanguageToggle from "@/components/LanguageToggle";
import { useT } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/dictionaries";
import {
  positionSlugMap,
  offensePositions,
  defensePositions,
  type PositionEntry,
} from "@/data/positions";

// Defer the 1.5k-line FieldDiagram bundle until the section is reached.
const FieldDiagram = lazy(() => import("@/components/FieldDiagram"));
const FieldDiagramFallback = () => (
  <div className="w-full aspect-[2/3] rounded-xl bg-card/40 border border-border animate-pulse" />
);

const POSITIONS_URL = "/posisjoner";

const navItemIds = ["om", "treninger", "spillet", "coachene", "kom-i-gang", "video", "faq"] as const;
const navItemKeyFor = (id: typeof navItemIds[number]): TranslationKey => {
  switch (id) {
    case "om": return "nav.om";
    case "treninger": return "nav.treninger";
    case "spillet": return "nav.spillet";
    case "coachene": return "nav.coachene";
    case "kom-i-gang": return "nav.komIGang";
    case "video": return "nav.video";
    case "faq": return "nav.faq";
  }
};

const IndexInner = () => {
  const t = useT();
  const { lang } = useLang();
  const { theme, selectedTheme, revealMode, revealActive, revealStage } = useTheme();
  const inReveal = revealActive && revealMode && selectedTheme === "tuil";
  // Show the red sweep overlay during stage 1; from stage 2 the nav is natively bg-primary.
  const showHeaderSweep = inReveal && revealStage >= 1 && revealStage < 2;
  // The sweep overlay does the actual red wipe during stage 1 — keep the
  // nav's own background dark so we don't double up two reds on top of one
  // another (which read as a sudden hue shift). From stage 2 onward the
  // sweep is gone, so paint the nav natively red to bridge until the theme
  // flips to TUIL underneath the blue dissolve.
  const navIsRedNow = theme === "tuil" || (inReveal && revealStage >= 2);
  const navTextOverRed = navIsRedNow || showHeaderSweep;
  // Hero title state during the reveal:
  //  - stages 0–1: keep the default-theme heading (the header is changing, hero is unchanged)
  //  - stage 2: only «FLAGGFOTBALL»
  //  - stages 3+: TUIL line fades in above
  // Keep the default two-line title visible until the blue dissolve fully covers
  // the hero (stage 3), so the «Tromsø» line doesn't pop away before the wipe.
  // Switch to the TUIL layout at stage 2 (while the blue overlay covers the
  // hero) so the «Tromsø» line doesn't snap to «TUIL» when fading back in.
  // Switch to the TUIL hero layout only when `theme` flips (which happens while
  // the blue overlay is fully opaque), so the old «Tromsø / Flaggfotball» text
  // stays visible until it's covered, not before.
  const heroShowDefaultTitle = theme !== "tuil";
  const heroShowTuilWordmark = !inReveal ? theme === "tuil" : revealStage >= 3;
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handler);
      document.addEventListener("keydown", keyHandler);
    }
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop nav */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md hidden md:block overflow-hidden border-b ${navIsRedNow ? "border-white/20" : "bg-background/80 border-border"}`}
        style={navIsRedNow ? { backgroundColor: "hsl(3 79% 49%)" } : undefined}
      >
        {showHeaderSweep && <div className="reveal-header-sweep" aria-hidden />}
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-1 py-2 relative z-10">
          <BrandLogo variant="mark" alt="Logo" className="h-10 w-auto shrink-0 mr-3" />
          {navItemIds.map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-sm font-heading font-medium transition-colors whitespace-nowrap px-4 py-1.5 rounded-lg ${navTextOverRed ? "text-white/80 hover:text-white hover:bg-white/10 reveal-nav-tuil-font" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
            >
              {t(navItemKeyFor(id))}
            </button>
          ))}
          <div className="ml-auto">
            <LanguageToggle />
          </div>
        </div>
      </nav>

      {/* Mobile floating glass bubble nav */}
      <div className="fixed top-4 left-4 z-50 md:hidden" ref={menuRef}>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl backdrop-blur-xl shadow-lg shadow-black/20 ${theme === "tuil" ? "bg-primary/90 border border-white/20" : "bg-background/40 border border-white/15"}`}
          aria-label={t("nav.menu")}
        >
          <BrandLogo variant="mark" alt="Logo" className="h-9 w-auto" />
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-foreground/80" />
          ) : (
            <Menu className="w-5 h-5 text-foreground/80" />
          )}
        </button>

        {/* Expanded menu bubble */}
        {mobileMenuOpen && (
          <div className={`absolute top-full left-0 mt-2 min-w-[200px] rounded-2xl backdrop-blur-xl shadow-xl shadow-black/30 p-2 animate-in fade-in slide-in-from-top-2 duration-200 ${theme === "tuil" ? "bg-primary/95 border border-white/20" : "bg-background/50 border border-white/15"}`}>
            {navItemIds.map((id) => (
              <button
                key={id}
                onClick={() => { scrollTo(id); setMobileMenuOpen(false); }}
                className={`w-full text-left text-sm font-heading font-medium transition-colors px-4 py-2.5 rounded-xl ${theme === "tuil" ? "text-white/90 hover:text-white hover:bg-white/10" : "text-foreground/80 hover:text-primary hover:bg-white/10"}`}
              >
                {t(navItemKeyFor(id))}
              </button>
            ))}
            <div className="px-4 pt-2 pb-1 flex items-center justify-between">
              <span className={`text-[10px] uppercase tracking-wider font-heading font-bold ${theme === "tuil" ? "text-white/80" : "text-muted-foreground"}`}>
                {t("nav.languageLabel")}
              </span>
              <LanguageToggle />
            </div>
          </div>
        )}
      </div>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <BrandLogo
            alt={t("hero.logoAlt")}
            className="w-40 h-40 md:w-56 md:h-56 mb-8 drop-shadow-2xl"
          />
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
            {heroShowDefaultTitle ? (
              <>
                {t("hero.title.line1")}
                <br />
                {t("hero.title.line2")}
              </>
            ) : (
              <>
                <span
                  className={`block ${heroShowTuilWordmark ? "reveal-fade-in" : "invisible"}`}
                  aria-hidden={!heroShowTuilWordmark}
                >
                  TUIL
                </span>
                <span className="block text-primary">
                  {lang === "en" ? "FLAG FOOTBALL" : "FLAGGFOTBALL"}
                </span>
              </>
            )}
          </h1>
          <div className="w-16 h-px bg-primary/50 mb-4" />
          <HeroTagline fallback={t("hero.tagline")} />
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/tromsoflaggfotball/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#E1306C] hover:-translate-y-0.5 transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61587334652354&locale=nb_NO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-[#1877F2] hover:-translate-y-0.5 transition-all"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>
      <div className="zebra">
      <AfterSection page="home" after="hero" />

      {/* Banediagram + Posisjoner */}
      <GameSection />
      <AfterSection page="home" after="spillet" />

      </div>

      {/* Footer */}
      <footer className={`py-8 px-6 ${theme === "tuil" ? "bg-primary border-t border-white/20" : "border-t border-border"}`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo variant="mark" alt="Logo" className="h-9 w-auto" />
            <span className={`font-heading text-sm font-medium ${theme === "tuil" ? "text-white" : "text-muted-foreground"}`}>
              {theme === "tuil" ? "Flaggfotball" : t("footer.brand")}
            </span>
          </div>
          <div className={`flex items-center gap-4 text-xs ${theme === "tuil" ? "text-white/80" : "text-muted-foreground"}`}>
            <Link to="/presse" className="hover:underline">
              {t("footer.press")}
            </Link>
            <span>
              © {new Date().getFullYear()} Tromsø Flaggfotball / TUIL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};


const GameSection = () => {
  const navigate = useNavigate();
  const t = useT();
  const { theme } = useTheme();
  const goToPosition = (slug: string) => navigate(`/posisjoner#${slug}`);

  return (
    <section id="spillet" className="py-16 px-6 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
          {t("game.h")}
        </h2>
        <p className="text-muted-foreground font-body mb-6">
          {t("game.sub")}
        </p>

        {/* Desktop: 3-column layout with positions flanking the diagram */}
        <div className="hidden md:grid md:grid-cols-[1fr_2fr_1fr] gap-6 items-start">
          {/* Offense positions - left */}
          <div>
            <h3 className="font-heading text-lg font-medium text-sky-400 mb-4">{t("game.offense")}</h3>
            <div className="space-y-3">
              {offensePositions.map((pos) => (
                <PositionCard key={pos.name} {...pos} variant="offense" />
              ))}
            </div>
          </div>

          {/* Field diagram - center */}
          <div>
            <Suspense fallback={<FieldDiagramFallback />}>
              <FieldDiagram onPositionNavigate={goToPosition} />
            </Suspense>
            <Link
              to={POSITIONS_URL}
              className={`inline-block text-sm font-body hover:opacity-80 transition-opacity mt-4 ${theme === "tuil" ? "text-rose-300" : "text-primary"}`}
            >
              {t("game.readMoreAll")}
            </Link>
            <Link
              to="/quiz"
              className={`block text-sm font-body hover:opacity-80 transition-opacity mt-2 ${theme === "tuil" ? "text-rose-300" : "text-primary"}`}
            >
              {t("game.quizCta")}
            </Link>
          </div>

          {/* Defense positions - right */}
          <div>
            <h3 className="font-heading text-lg font-medium text-rose-400 mb-4">{t("game.defense")}</h3>
            <div className="space-y-3">
              {defensePositions.map((pos) => (
                <PositionCard key={pos.name} {...pos} variant="defense" />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: stacked layout */}
        <div className="space-y-6 md:hidden">
          <div>
            <Suspense fallback={<FieldDiagramFallback />}>
              <FieldDiagram onPositionNavigate={goToPosition} />
            </Suspense>
            <Link
              to={POSITIONS_URL}
              className={`inline-block text-sm font-body hover:opacity-80 transition-opacity mt-4 ${theme === "tuil" ? "text-rose-300" : "text-primary"}`}
            >
              {t("game.readMoreAll")}
            </Link>
            <Link
              to="/quiz"
              className={`block text-sm font-body hover:opacity-80 transition-opacity mt-2 ${theme === "tuil" ? "text-rose-300" : "text-primary"}`}
            >
              {t("game.quizCta")}
            </Link>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="font-heading text-base font-medium text-sky-400 mb-2.5">{t("game.offense")}</h3>
              <div className="space-y-0">
                {offensePositions.map((pos) => (
                  <PositionCard key={pos.name} {...pos} variant="offense" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading text-base font-medium text-rose-400 mb-2.5">{t("game.defense")}</h3>
              <div className="space-y-0">
                {defensePositions.map((pos) => (
                  <PositionCard key={pos.name} {...pos} variant="defense" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};



const PositionCard = ({
  name,
  abbr,
  taglineKey,
  icon,
  glowBg,
  roleKey,
  traitsKey,
  nflExamples,
  variant = "offense",
  supColor,
}: {
  name: string;
  abbr: string;
  taglineKey: TranslationKey;
  icon: React.ReactNode;
  glowBg?: string;
  roleKey: TranslationKey;
  traitsKey: TranslationKey;
  nflExamples?: string;
  variant?: "offense" | "defense";
  supColor?: string;
}) => {
  const t = useT();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const isOffense = variant === "offense";
  const accentColor = isOffense ? "text-sky-400" : "text-rose-400";
  const resolvedSupColor = supColor || accentColor;
  const resolvedGlow = glowBg || (isOffense ? "bg-sky-400/10" : "bg-rose-400/10");

  return (
    <article className="group relative md:border-0 border-t border-white/5 first:border-t-0">
      {/* Glow background on hover (desktop) */}
      <div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${resolvedGlow} hidden md:block`}
        style={{ filter: "blur(12px)" }}
      />
      <div
        className={`absolute inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${resolvedGlow} hidden md:block`}
      />
      <button
        onClick={() => setOpen(!open)}
        className="relative w-full text-left px-3 py-2 md:py-1.5"
      >
        <div className="relative flex items-center gap-2">
          <div className={accentColor}>{icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-medium text-foreground text-sm">
              {name}
              {abbr && (
                <sup className={`ml-0.5 transition-all duration-300 text-[0.7em] align-super ${resolvedSupColor} ${open ? "opacity-0" : "opacity-50"}`}>
                  {abbr}
                </sup>
              )}
            </h3>
            {/* Tagline: hidden on mobile when collapsed, always visible on desktop */}
            <p className={`text-xs text-muted-foreground font-body mt-0.5 transition-all duration-300 overflow-hidden hidden md:block ${open ? "md:max-h-0 md:opacity-0 md:mt-0" : "md:max-h-10 md:opacity-100"}`}>{t(taglineKey)}</p>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div className={`relative grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${open ? "mt-1 md:mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-1.5 pl-10 md:pl-7 pb-2 md:pb-1.5 pr-3">
            {/* Show tagline inside expanded content on mobile */}
            <p className="text-xs text-muted-foreground font-body leading-relaxed italic md:hidden">{t(taglineKey)}</p>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">{t(roleKey)}</p>
            <p className={`text-xs font-body ${accentColor}`}>
              <span className="text-muted-foreground">{t("pos.card.fits")}</span> {t(traitsKey)}
            </p>
            {nflExamples && (
              <p className="text-xs font-body text-muted-foreground">
                <span className="text-foreground font-semibold">NFL:</span> {nflExamples}
              </p>
            )}
            <Link
              to={`/posisjoner#${positionSlugMap[name] || name.toLowerCase()}`}
              className={`inline-flex items-center gap-1 text-xs font-body hover:underline mt-1 ${theme === "tuil" ? "text-rose-300" : "text-primary"}`}
            >
              {t("pos.card.readMorePrefix")} {name.toLowerCase()} →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};



const HeroTagline = ({ fallback }: { fallback: string }) => {
  const slot = useSlot("hero.tagline");
  if (slot) {
    return (
      <div className="mb-6 max-w-2xl">
        <MdBlock md={slot.body} className="text-sm tracking-widest uppercase [&_p]:text-muted-foreground" />
      </div>
    );
  }
  return (
    <p className="font-body text-muted-foreground text-sm tracking-widest uppercase mb-6">
      {fallback}
    </p>
  );
};

const Index = () => (
  <ContentBlocksProvider page="home">
    <IndexInner />
  </ContentBlocksProvider>
);

export default Index;
