import { Facebook, Instagram, Phone, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/LanguageProvider";
import {
  ContentBlocksProvider,
  AfterSection,
  MdBlock,
  useSlot,
  useSlotRaw,
  useNavItems,
} from "@/hooks/useContentBlocks";
import {
  FOOTER_LINKS_SLOT,
  parseFooterLinks,
  isInternalHref,
  externalHref,
  type FooterLink,
} from "@/cms/footer";
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
import PositionCard from "@/components/PositionCard";

// Defer the 1.5k-line FieldDiagram bundle until the section is reached.
const FieldDiagram = lazy(() => import("@/components/FieldDiagram"));
const FieldDiagramFallback = () => (
  <div className="w-full aspect-[2/3] rounded-xl bg-card/40 border border-border animate-pulse" />
);

const POSITIONS_URL = "/posisjoner";

const IndexInner = () => {
  const t = useT();
  const navItems = useNavItems();
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
  // Desktop nav: normally left-aligned inside a max-w-4xl container. When the
  // items no longer fit that container, switch to a full-width centered row so
  // the menu grows symmetrically instead of running off the right edge.
  const navRowRef = useRef<HTMLDivElement>(null);
  const [navCentered, setNavCentered] = useState(false);
  useEffect(() => {
    const measure = () => {
      const el = navRowRef.current;
      if (!el) return;
      const natural = Array.from(el.children).reduce(
        (sum, c) => sum + (c as HTMLElement).offsetWidth,
        0,
      ) + 4 * Math.max(0, el.children.length - 1) + 12;
      setNavCentered(natural > 896 - 32);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [navItems]);
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
    <div className="min-h-screen bg-background relative">
      {/* Desktop nav */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md hidden md:block overflow-hidden border-b ${navIsRedNow ? "border-white/20" : "bg-background/80 border-border"}`}
        style={navIsRedNow ? { backgroundColor: "hsl(3 79% 49%)" } : undefined}
      >
        {showHeaderSweep && <div className="reveal-header-sweep" aria-hidden />}
        <div
          ref={navRowRef}
          className={`px-4 flex items-center gap-1 py-2 relative z-10 ${
            navCentered ? "w-full justify-center" : "max-w-4xl mx-auto"
          }`}
        >
          <BrandLogo variant="mark" alt="Logo" className="h-10 w-auto shrink-0 mr-3" />
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-sm font-heading font-medium transition-colors whitespace-nowrap px-4 py-1.5 rounded-lg ${navTextOverRed ? "text-white/80 hover:text-white hover:bg-white/10 reveal-nav-tuil-font" : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Language switcher: top-right, scrolls away with the page (not sticky) */}
      <div className="absolute top-4 right-4 md:top-[4.5rem] z-[60]">
        <LanguageToggle />
      </div>

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
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { scrollTo(id); setMobileMenuOpen(false); }}
                className={`w-full text-left text-sm font-heading font-medium transition-colors px-4 py-2.5 rounded-xl ${theme === "tuil" ? "text-white/90 hover:text-white hover:bg-white/10" : "text-foreground/80 hover:text-primary hover:bg-white/10"}`}
              >
                {label}
              </button>
            ))}
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
          <div className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs ${theme === "tuil" ? "text-white/80" : "text-muted-foreground"}`}>
            <FooterLinks />
            <span>
              © {new Date().getFullYear()} Tromsø Flaggfotball / TUIL
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};


/**
 * Footer links, editable from the CMS (slot `footer.links`). Falls back to
 * the built-in Kamper/Pressekit pair when nothing is configured.
 */
const FooterLinks = () => {
  const t = useT();
  const { lang } = useLang();
  const raw = useSlotRaw(FOOTER_LINKS_SLOT);
  const configured = parseFooterLinks(raw);
  const links: FooterLink[] =
    configured && configured.length > 0
      ? configured
      : [
          { href: "/kamper", label_no: t("matches.headerTitle"), label_en: t("matches.headerTitle") },
          { href: "/presse", label_no: t("footer.press"), label_en: t("footer.press") },
        ];
  return (
    <>
      {links.map((l, i) => {
        const label = (lang === "en" ? l.label_en?.trim() : "") || l.label_no;
        return isInternalHref(l.href) ? (
          <Link key={`${l.href}-${i}`} to={l.href} className="hover:underline">
            {label}
          </Link>
        ) : (
          <a
            key={`${l.href}-${i}`}
            href={externalHref(l.href)}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {label}
          </a>
        );
      })}
    </>
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
        <p className="text-muted-foreground font-body mb-4">
          {t("game.sub")}
        </p>
        <p className="font-body mb-6">
          <span className="font-semibold text-foreground">{t("game.quizPrompt")}</span>{" "}
          <Link
            to="/quiz"
            className={`hover:opacity-80 transition-opacity ${theme === "tuil" ? "text-rose-300" : "text-primary"}`}
          >
            {t("game.quizLink")} →
          </Link>
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
