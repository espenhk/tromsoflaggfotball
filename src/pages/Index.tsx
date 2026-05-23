import { Facebook, Instagram, Phone, MapPin, Clock, Calendar, ExternalLink, ChevronDown, Flag, Users, Star, Shield, Zap, Target, Eye, Crosshair, Menu, X, UserPlus, ShieldCheck, Megaphone, ConeIcon, ShoppingBag, Send, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageProvider";
import heroBg from "@/assets/hero-bg.png";
import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "@/theme/ThemeProvider";
import FieldDiagram from "@/components/FieldDiagram";
import LanguageToggle from "@/components/LanguageToggle";
import { useT } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/dictionaries";

const POSITIONS_URL = "/posisjoner";

const positionSlugMap: Record<string, string> = {
  "Quarterback": "quarterback",
  "Running Back": "running-back",
  "Center": "center",
  "Wide Receiver": "wide-receiver",
  "Rusher": "rusher",
  "Defensive Back": "defensive-back",
  "Safety": "safety",
};

// Position cards source data — text fields are translation keys, resolved at render time.
type PositionEntry = {
  name: string;
  abbr: string;
  taglineKey: TranslationKey;
  icon: React.ReactNode;
  glowBg: string;
  supColor?: string;
  roleKey: TranslationKey;
  traitsKey: TranslationKey;
  nflExamples: string;
};

const offensePositions: PositionEntry[] = [
  {
    name: "Quarterback",
    abbr: "QB",
    taglineKey: "pos.qb.tagline",
    icon: <Star className="w-5 h-5 text-amber-400" />,
    glowBg: "bg-amber-400/10",
    supColor: "text-amber-400",
    roleKey: "pos.qb.role",
    traitsKey: "pos.qb.traits",
    nflExamples: "Patrick Mahomes, Josh Allen, Lamar Jackson",
  },
  {
    name: "Running Back",
    abbr: "RB",
    taglineKey: "pos.rb.tagline",
    icon: <Zap className="w-5 h-5 text-emerald-400" />,
    glowBg: "bg-emerald-400/10",
    supColor: "text-emerald-400",
    roleKey: "pos.rb.role",
    traitsKey: "pos.rb.traits",
    nflExamples: "Derrick Henry, Saquon Barkley, Christian McCaffrey",
  },
  {
    name: "Center",
    abbr: "C",
    taglineKey: "pos.c.tagline",
    icon: <Users className="w-5 h-5" />,
    glowBg: "bg-sky-400/10",
    roleKey: "pos.c.role",
    traitsKey: "pos.c.traits",
    nflExamples: "Travis Kelce (TE), Jason Kelce",
  },
  {
    name: "Wide Receiver",
    abbr: "WR",
    taglineKey: "pos.wr.tagline",
    icon: <Target className="w-5 h-5" />,
    glowBg: "bg-sky-400/10",
    roleKey: "pos.wr.role",
    traitsKey: "pos.wr.traits",
    nflExamples: "Tyreek Hill, Ja'Marr Chase, CeeDee Lamb",
  },
];

const defensePositions: PositionEntry[] = [
  {
    name: "Rusher",
    abbr: "R",
    taglineKey: "pos.r.tagline",
    icon: <Crosshair className="w-5 h-5 text-orange-400" />,
    glowBg: "bg-orange-400/10",
    supColor: "text-orange-400",
    roleKey: "pos.r.role",
    traitsKey: "pos.r.traits",
    nflExamples: "Myles Garrett, Micah Parsons, T.J. Watt",
  },
  {
    name: "Defensive Back",
    abbr: "DB",
    taglineKey: "pos.db.tagline",
    icon: <Shield className="w-5 h-5" />,
    glowBg: "bg-rose-400/10",
    roleKey: "pos.db.role",
    traitsKey: "pos.db.traits",
    nflExamples: "Sauce Gardner, Patrick Surtain II, Jalen Ramsey",
  },
  {
    name: "Safety",
    abbr: "S",
    taglineKey: "pos.s.tagline",
    icon: <Eye className="w-5 h-5" />,
    glowBg: "bg-rose-400/10",
    roleKey: "pos.s.role",
    traitsKey: "pos.s.traits",
    nflExamples: "Kyle Hamilton, Derwin James, Jessie Bates III",
  },
];

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

const Index = () => {
  const t = useT();
  const { lang } = useLang();
  const { theme } = useTheme();
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
    if (mobileMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border hidden md:block">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-1 py-2">
          <BrandLogo alt="Logo" className="w-7 h-7 shrink-0 mr-3" />
          {navItemIds.map((id) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-heading font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap px-4 py-1.5 rounded-lg hover:bg-primary/5"
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
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/15 shadow-lg shadow-black/20"
          aria-label={t("nav.menu")}
        >
          <BrandLogo alt="Logo" className="w-6 h-6" />
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-foreground/80" />
          ) : (
            <Menu className="w-5 h-5 text-foreground/80" />
          )}
        </button>

        {/* Expanded menu bubble */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 mt-2 min-w-[200px] rounded-2xl bg-background/50 backdrop-blur-xl border border-white/15 shadow-xl shadow-black/30 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItemIds.map((id) => (
              <button
                key={id}
                onClick={() => { scrollTo(id); setMobileMenuOpen(false); }}
                className="w-full text-left text-sm font-heading font-medium text-foreground/80 hover:text-primary hover:bg-white/10 transition-colors px-4 py-2.5 rounded-xl"
              >
                {t(navItemKeyFor(id))}
              </button>
            ))}
            <div className="px-4 pt-2 pb-1 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-heading font-bold text-muted-foreground">
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
            {theme === "tuil" ? (
              <>
                TUIL
                <br />
                {lang === "en" ? "FLAG FOOTBALL" : "FLAGGFOTBALL"}
              </>
            ) : (
              <>
                {t("hero.title.line1")}
                <br />
                {t("hero.title.line2")}
              </>
            )}
          </h1>
          <div className="w-16 h-px bg-primary/50 mb-4" />
          <p className="font-body text-muted-foreground text-sm tracking-widest uppercase mb-6">
            {t("hero.tagline")}
          </p>
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

      {/* Om sporten */}
      <section id="om" className="py-20 px-6 scroll-mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            {t("om.h")}
          </h2>
          <p className="font-body text-muted-foreground text-lg leading-relaxed mb-4">
            {t("om.p1.pre")}
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            {t("om.p2.pre")}<strong className="text-foreground">{t("om.p2.strong")}</strong>{t("om.p2.post")}
          </p>
        </div>
      </section>

      {/* Åpent for alle + Prøv en trening */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="text-primary mt-1">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl md:text-2xl font-medium text-foreground mb-3">
                {t("open.h")}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed mb-3">
                {t("open.p1.pre")}<strong className="text-foreground">{t("open.p1.strong")}</strong>{t("open.p1.post")}
              </p>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                {t("open.p2")}
              </p>
              <TryTrainingSection />
            </div>
          </div>
        </div>
      </section>

      {/* Treninger */}
      <TrainingSection />

      {/* Banediagram + Posisjoner */}
      <GameSection />

      {/* Coachene */}
      <section id="coachene" className="py-16 px-6 scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            {t("coaches.h")}
          </h2>
          <div className="space-y-0">
            {[
              { icon: <Megaphone className="w-5 h-5" />, title: t("coaches.headTitle"), name: "Espen Haukeland Kristensen", phone: "958 48 889", bio: t("coaches.head.bio") },
              { icon: <ConeIcon className="w-5 h-5" />, title: t("coaches.assistantTitle"), name: "Martin Sand Monsen", phone: "952 99 706", bio: t("coaches.assistant.bio") },
            ].map((coach) => (
              <CoachCard key={coach.name} {...coach} />
            ))}
          </div>
        </div>
      </section>

      {/* Kom i gang */}
      <section id="kom-i-gang" className="py-16 px-6 scroll-mt-16 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            {t("links.h")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <LinkCard
              href="https://www.facebook.com/profile.php?id=61587334652354&locale=nb_NO"
              title={t("links.fb.title")}
              description={t("links.fb.desc")}
              icon={<Facebook className="w-5 h-5" />}
              iconColor="text-[#4267B2]"
              glowColor="bg-[#4267B2]/15"
              hoverTitle="group-hover:text-[#4267B2]"
            />
            <LinkCard
              href="https://www.instagram.com/tromsoflaggfotball/"
              title={t("links.ig.title")}
              description={t("links.ig.desc")}
              icon={<Instagram className="w-5 h-5" />}
              iconColor="text-[#C13584]"
              glowColor="bg-[#C13584]/15"
              hoverTitle="group-hover:text-[#C13584]"
            />
            <LinkCard
              href="https://flaggfotball.no"
              title={t("links.flag.title")}
              description={t("links.flag.desc")}
              icon={<Flag className="w-5 h-5" />}
              iconColor="text-emerald-400"
              glowColor="bg-emerald-400/15"
              hoverTitle="group-hover:text-emerald-400"
            />
            <LinkCard
              href="https://club.spond.com/landing/signup/naik/form/0A2A60617F184406B7FFEAA4EDC61409"
              title={t("links.member.title")}
              description={t("links.member.desc")}
              icon={<UserPlus className="w-5 h-5" />}
              iconColor="text-sky-400"
              glowColor="bg-sky-400/15"
              hoverTitle="group-hover:text-sky-400"
            />
            <LinkCard
              href="https://amerikanskeidretter.no/forbund/klubbdrift/lisens-og-forsikring/#amerikansk-fotball-lisens"
              title={t("links.license.title")}
              description={t("links.license.desc")}
              icon={<ShieldCheck className="w-5 h-5" />}
              iconColor="text-amber-400"
              glowColor="bg-amber-400/15"
              hoverTitle="group-hover:text-amber-400"
            />
          </div>
        </div>
      </section>

      {/* Video */}
      <section id="video" className="py-16 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
            {t("video.h")}
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-6">
            {t("video.sub")}
          </p>
          <div className="aspect-video rounded-xl overflow-hidden border border-border">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/BqLI6k8HEk8"
              title="Wildcats vs Team USA – Fanatics Flag Football Classic"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 px-6 scroll-mt-16 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            {t("faq.h")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
            <FaqItem
              q={t("faq.q1")}
              a={t("faq.a1")}
            />
            <FaqItem
              q={t("faq.q2")}
              a={t("faq.a2")}
            />
            <FaqItem
              q={t("faq.q3")}
              a={t("faq.a3")}
            />
            <FaqItem
              q={t("faq.q4")}
              a={t("faq.a4")}
            />
            <FaqItem
              q={t("faq.q5")}
              a={t("faq.a5")}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo alt="Logo" className="w-6 h-6" />
            <span className="font-heading text-sm font-bold text-muted-foreground">
              {t("footer.brand")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t("footer.brand")}
          </p>
        </div>
      </footer>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <div className="text-primary mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">{label}</p>
      <p className="font-heading text-lg font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const LinkCard = ({
  href,
  title,
  description,
  icon,
  iconColor,
  glowColor,
  hoverTitle,
}: {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  iconColor?: string;
  glowColor?: string;
  hoverTitle?: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative flex items-start gap-4 px-6 py-4 rounded-xl transition-all"
  >
    {/* Glow background */}
    <div
      className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glowColor || "bg-primary/10"}`}
      style={{ filter: "blur(12px)" }}
    />
    <div
      className={`absolute inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glowColor || "bg-primary/10"}`}
    />
    <div className={`relative mt-1 ${iconColor || "text-primary"}`}>
      {icon || <ExternalLink className="w-5 h-5" />}
    </div>
    <div className="relative flex-1 min-w-0">
      <p className={`font-heading font-medium text-foreground transition-colors ${hoverTitle || "group-hover:text-primary"}`}>
        {title}
      </p>
      <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>
    </div>
  </a>
);

const GameSection = () => {
  const navigate = useNavigate();
  const t = useT();
  const goToPosition = (slug: string) => navigate(`/posisjoner#${slug}`);

  return (
    <section id="spillet" className="py-16 px-6 scroll-mt-16 bg-card/50">
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
            <FieldDiagram onPositionNavigate={goToPosition} />
            <Link
              to={POSITIONS_URL}
              className="inline-block text-sm text-primary font-body hover:opacity-80 transition-opacity mt-4"
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
            <FieldDiagram onPositionNavigate={goToPosition} />
            <Link
              to={POSITIONS_URL}
              className="inline-block text-sm text-primary font-body hover:opacity-80 transition-opacity mt-4"
            >
              {t("game.readMoreAll")}
            </Link>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="font-heading text-base font-bold text-sky-400 mb-2.5">{t("game.offense")}</h3>
              <div className="space-y-0">
                {offensePositions.map((pos) => (
                  <PositionCard key={pos.name} {...pos} variant="offense" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading text-base font-bold text-rose-400 mb-2.5">{t("game.defense")}</h3>
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

const TrainingSection = () => {
  const t = useT();
  return (
    <section id="treninger" className="py-16 px-6 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
          {t("training.h")}
        </h2>

        <div className="flex flex-col md:flex-row md:items-stretch gap-6">
          <div className="flex flex-col gap-4 md:w-1/3 shrink-0">
            <InfoCard icon={<Calendar className="w-5 h-5" />} label={t("training.day")} value={t("training.dayValue")} />
            <InfoCard icon={<Clock className="w-5 h-5" />} label={t("training.time")} value={t("training.timeValue")} />
            <InfoCard icon={<MapPin className="w-5 h-5" />} label={t("training.place")} value={t("training.placeValue")} />
            <InfoCard icon={<ShoppingBag className="w-5 h-5" />} label={t("training.bring")} value={t("training.bringValue")} />
          </div>

          <div className="rounded-xl overflow-hidden border border-border flex-1 h-[180px] md:h-auto md:self-stretch">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=TUIL+Arena,+Tromsø&maptype=satellite&zoom=17"
              title="TUIL Arena, Tromsø"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const TryTrainingSection = () => {
  const t = useT();
  const { lang } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    if (trimmedName.length < 1 || trimmedName.length > 100 || trimmedContact.length < 3 || trimmedContact.length > 200) {
      setStatus("error");
      return;
    }

    const { error } = await supabase
      .from("training_signups")
      .insert({
        name: trimmedName,
        contact: trimmedContact,
        age_group: ageGroup || null,
        preferred_date: preferredDate.trim() || null,
        message: message.trim() || null,
        language: lang,
      });

    if (error) {
      console.error("Sign-up insert failed", error);
      setStatus("error");
      return;
    }

    // Fire-and-forget notification email to the head coach.
    // Safe to ignore failure here — the sign-up is already stored in the DB.
    void supabase.functions
      .invoke("send-transactional-email", {
        body: {
          templateName: "training-signup-notification",
          recipientEmail: "espenhkristensen@gmail.com",
          idempotencyKey: `training-signup-${Date.now()}-${trimmedContact}`,
          templateData: {
            name: trimmedName,
            contact: trimmedContact,
            ageGroup: ageGroup || null,
            preferredDate: preferredDate.trim() || null,
            message: message.trim() || null,
            language: lang,
          },
        },
      })
      .catch((err) => console.warn("Notification email failed (sign-up still saved):", err));

    setStatus("success");
    setName("");
    setContact("");
    setAgeGroup("");
    setPreferredDate("");
    setMessage("");
  };

  const inputCls =
    "w-full rounded-lg bg-background border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/60 font-body focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary transition";

  return (
    <div id="prov-en-trening" className="scroll-mt-16">
      {status === "success" ? (
        <div className="flex items-start gap-3 rounded-xl border border-primary/40 bg-primary/10 p-5">
          <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
          <p className="font-body text-foreground">{t("try.success")}</p>
        </div>
      ) : (
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div
            className={`grid transition-[grid-template-rows] duration-500 ease-out ${
              expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
            aria-hidden={!expanded}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="space-y-4 pb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-body text-muted-foreground mb-1.5">{t("try.name")}</span>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("try.namePh")}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-body text-muted-foreground mb-1.5">{t("try.contact")}</span>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={t("try.contactPh")}
                  className={inputCls}
                />
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-body text-muted-foreground mb-1.5">{t("try.ageGroup")}</span>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className={inputCls}
                >
                  <option value="">{t("try.ageGroupPh")}</option>
                  <option value="adult">{t("try.ageAdult")}</option>
                  <option value="youth">{t("try.ageYouth")}</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-sm font-body text-muted-foreground mb-1.5">
                  {t("try.preferredDate")} <span className="text-muted-foreground/60">{t("try.optional")}</span>
                </span>
                <input
                  type="text"
                  maxLength={100}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  placeholder={t("try.preferredDatePh")}
                  className={inputCls}
                />
              </label>
            </div>

            <label className="block">
              <span className="block text-sm font-body text-muted-foreground mb-1.5">{t("try.message")}</span>
              <textarea
                rows={3}
                maxLength={1000}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("try.messagePh")}
                className={inputCls + " resize-y min-h-[88px]"}
              />
            </label>

            {status === "error" && (
              <p className="text-sm font-body text-destructive">{t("try.error")}</p>
            )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type={expanded ? "submit" : "button"}
              onClick={expanded ? undefined : () => setExpanded(true)}
              aria-expanded={expanded}
              disabled={expanded && status === "submitting"}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-heading font-bold px-6 py-3 min-w-[200px] hover:shadow-[0_0_12px_hsl(var(--primary)/0.6)] transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {expanded ? <Send className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {expanded
                ? (status === "submitting" ? t("try.submitting") : t("try.submit"))
                : t("try.cta")}
            </button>
            <a
              href="https://www.facebook.com/profile.php?id=61587334652354&locale=nb_NO"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-[#1877F2] hover:-translate-y-0.5 transition-all"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/tromsoflaggfotball/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-[#E1306C] hover:-translate-y-0.5 transition-all"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className={`ml-auto inline-flex items-center gap-1.5 font-heading font-bold text-primary hover:text-primary/80 hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.6)] transition-opacity duration-300 ${
                expanded ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={!expanded}
              tabIndex={expanded ? 0 : -1}
            >
              {t("try.close")}
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const CoachCard = ({
  icon,
  title,
  name,
  phone,
  bio,
}: {
  icon: React.ReactNode;
  title: string;
  name: string;
  phone: string;
  bio: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <article className="relative md:border-0 border-t border-white/5 first:border-t-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-2 md:py-1.5"
      >
        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-[24px_140px_1fr_auto_auto] items-center gap-x-4">
          <div className="text-primary shrink-0">{icon}</div>
          <span className="text-xs text-primary uppercase tracking-wider font-body">{title}</span>
          <span className="font-heading font-bold text-foreground">{name}</span>
          <a
            href={`tel:+47${phone.replace(/\s/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-body text-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            {phone}
          </a>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
        {/* Mobile layout - compact single line */}
        <div className="flex md:hidden items-center gap-2 px-1">
          <div className="text-primary shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <span className="font-heading font-bold text-foreground text-sm">{name}</span>
            <span className="text-xs text-muted-foreground font-body ml-1.5">{title}</span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${open ? "mt-1 md:mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="pl-8 md:pl-9 pr-3 pb-2 md:pb-1 space-y-1.5">
            {/* Phone visible on mobile only when expanded */}
            <a
              href={`tel:+47${phone.replace(/\s/g, "")}`}
              onClick={(e) => e.stopPropagation()}
              className="flex md:hidden items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-body text-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              {phone}
            </a>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {bio}
            </p>
          </div>
        </div>
      </div>
    </article>
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
            <h3 className="font-heading font-bold text-foreground text-sm">
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
              className="inline-flex items-center gap-1 text-xs font-body text-primary hover:underline mt-1"
            >
              {t("pos.card.readMorePrefix")} {name.toLowerCase()} →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};


const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-muted/60 border border-border rounded-xl p-4 transition-all hover:bg-muted hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-heading text-sm font-bold text-foreground leading-snug">{q}</p>
        <ChevronDown
          className={`w-4 h-4 text-primary/50 shrink-0 mt-0.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
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

export default Index;
