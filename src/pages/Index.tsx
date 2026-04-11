import { Facebook, Instagram, Phone, MapPin, Clock, Calendar, ExternalLink, ChevronDown, Flag, Users, Star, Shield, Zap, Target, Eye, Crosshair, Menu, X, UserPlus, ShieldCheck, Megaphone, ConeIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.png";
import FieldDiagram from "@/components/FieldDiagram";

const POSITIONS_URL = "https://flaggfotball.no/pages/posisjoner-i-flaggfotball";

const navItems = [
  { id: "om", label: "Om sporten" },
  { id: "treninger", label: "Treninger" },
  { id: "spillet", label: "Dette er flaggfotball" },
  { id: "coachene", label: "Coachene" },
  { id: "kom-i-gang", label: "Kom i gang" },
  { id: "video", label: "Video" },
  { id: "faq", label: "FAQ" },
];

const offensePositions = [
  {
    name: "Quarterback",
    abbr: "QB",
    tagline: "Lagets playmaker og leder",
    icon: <Star className="w-5 h-5 text-amber-400" />,
    glowBg: "bg-amber-400/10",
    role: "Styrer angrepet, leser forsvaret og kaster ballen til mottakerne. Handler om presise kast og rask beslutningstaking.",
    traits: "God oversikt, presise kast, rask beslutningstaking.",
    nflExamples: "Patrick Mahomes, Josh Allen, Lamar Jackson",
  },
  {
    name: "Running Back",
    abbr: "RB",
    tagline: "Eksplosiv løper med ballen",
    icon: <Zap className="w-5 h-5 text-emerald-400" />,
    glowBg: "bg-emerald-400/10",
    role: "Tar imot ballen fra QB og løper gjennom forsvaret. Brukes i løpespill og korte pasninger.",
    traits: "Eksplosiv fart, god balanse, smidighet.",
    nflExamples: "Derrick Henry, Saquon Barkley, Christian McCaffrey",
  },
  {
    name: "Center",
    abbr: "C",
    tagline: "Starter hvert spill",
    icon: <Users className="w-5 h-5" />,
    glowBg: "bg-sky-400/10",
    role: "Snapper ballen til QB og går deretter ut som mottaker eller blokkerer rusheren. Limet i laget.",
    traits: "Pålitelig, god kommunikasjon, allsidig.",
    nflExamples: "Travis Kelce (TE), Jason Kelce",
  },
  {
    name: "Wide Receiver",
    abbr: "WR",
    tagline: "Rask mottaker som fanger ballen",
    icon: <Target className="w-5 h-5" />,
    glowBg: "bg-sky-400/10",
    role: "Løper planlagte ruter for å bli fri fra forsvareren og ta imot pasninger fra QB.",
    traits: "Hurtighet, gode hender, raske vendinger.",
    nflExamples: "Tyreek Hill, Ja'Marr Chase, CeeDee Lamb",
  },
];

const defensePositions = [
  {
    name: "Rusher",
    abbr: "R",
    tagline: "Jager quarterbacken",
    icon: <Crosshair className="w-5 h-5 text-orange-400" />,
    glowBg: "bg-orange-400/10",
    role: "Forsvarets mest aggressive spiller. Starter 7 yards fra ballen og presser QB til å kaste for tidlig.",
    traits: "Eksplosiv fart, timing, aggressivitet.",
    nflExamples: "Myles Garrett, Micah Parsons, T.J. Watt",
  },
  {
    name: "Defensive Back",
    abbr: "DB",
    tagline: "Dekker mottakerne tett",
    icon: <Shield className="w-5 h-5" />,
    glowBg: "bg-rose-400/10",
    role: "Speiler motstanderens bevegelser og prøver å hindre pasninger. Ofte i en-mot-en-dueller.",
    traits: "Rask reaksjon, god fotarbeid, mental styrke.",
    nflExamples: "Sauce Gardner, Patrick Surtain II, Jalen Ramsey",
  },
  {
    name: "Safety",
    abbr: "S",
    tagline: "Siste skanse bakfra",
    icon: <Eye className="w-5 h-5" />,
    glowBg: "bg-rose-400/10",
    role: "Forsvarets siste linje med best oversikt. Leser spillet og sikrer mot lange pasninger.",
    traits: "God spilleforståelse, oversikt, allsidighet.",
    nflExamples: "Kyle Hamilton, Derwin James, Jessie Bates III",
  },
];

const Index = () => {
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
          <img src={logo} alt="Logo" className="w-6 h-6 shrink-0 mr-2" />
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-xs font-heading font-bold text-muted-foreground hover:text-primary transition-colors whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-primary/5"
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile floating glass bubble nav */}
      <div className="fixed top-4 left-4 z-50 md:hidden" ref={menuRef}>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-background/40 backdrop-blur-xl border border-white/15 shadow-lg shadow-black/20"
          aria-label="Meny"
        >
          <img src={logo} alt="Logo" className="w-6 h-6" />
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-foreground/80" />
          ) : (
            <Menu className="w-5 h-5 text-foreground/80" />
          )}
        </button>

        {/* Expanded menu bubble */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 mt-2 min-w-[200px] rounded-2xl bg-background/50 backdrop-blur-xl border border-white/15 shadow-xl shadow-black/30 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { scrollTo(item.id); setMobileMenuOpen(false); }}
                className="w-full text-left text-sm font-heading font-bold text-foreground/80 hover:text-primary hover:bg-white/10 transition-colors px-4 py-2.5 rounded-xl"
              >
                {item.label}
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
          <img
            src={logo}
            alt="Tromsø Flaggfotball logo"
            className="w-40 h-40 md:w-56 md:h-56 mb-8 drop-shadow-2xl"
          />
          <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
            TROMSØ
            <br />
            FLAGGFOTBALL
          </h1>
          <div className="w-16 h-px bg-primary/50 mb-4" />
          <p className="font-body text-muted-foreground text-sm tracking-widest uppercase mb-6">
            Arktisk flaggfotball · 69°N
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
            Hva er flaggfotball?
          </h2>
          <p className="font-body text-muted-foreground text-lg leading-relaxed mb-4">
            Flaggfotball er en kontaktfri variant av amerikansk fotball. I stedet for å tackle
            drar du av et flagg som henger i beltet til motstanderen. Sporten er rask, taktisk
            og inkluderende — og blir olympisk idrett i LA 2028.
          </p>
          <p className="font-body text-muted-foreground leading-relaxed">
            Det spilles <strong className="text-foreground">5 mot 5</strong> på en bane
            som er omtrent 70 × 30 meter. Hvert lag har fire forsøk på å krysse
            midtlinjen, og deretter fire nye forsøk for å score touchdown.
          </p>
        </div>
      </section>

      {/* Åpent for alle */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="text-primary mt-1">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-3">
                Åpent for alle
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed mb-3">
                I Norge spilles flaggfotball ofte <strong className="text-foreground">mixed</strong> — med
                spillere av alle kjønn på samme lag. Fart, teknikk og spilleforståelse betyr mer enn fysisk styrke.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                I Tromsø trener vi alltid sammen — og det er nettopp det som gjør det gøy.
                Ingen erfaring nødvendig, bare møt opp.
              </p>
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
            Coachene
          </h2>
          <div className="space-y-0">
            {[
              { icon: <Megaphone className="w-5 h-5" />, title: "Head Coach", name: "Espen Haukeland Kristensen", phone: "958 48 889", bio: "Espen har fire sesonger som spiller i Vålerenga Trolls (amerikansk fotball) bak seg, der han spilte quarterback, wide receiver og linebacker. Etter spillerkarrieren gikk han over til trenerbenken — tre år som coach for seniorer, U13 og damelag, med spesialfelt som QB-coach. Tok NM-bronse i flaggfotball i 2025." },
              { icon: <ConeIcon className="w-5 h-5" />, title: "Assistentcoach", name: "Martin Sand Monsen", phone: "952 99 706", bio: "Martin er en av de sentrale figurene fra Tromsø Trailblazers og har spilt flaggfotball i 3–4 år — på alle posisjoner. Til daglig jobber han som lærer, noe som gjør ham til en naturlig pedagog på banen. Flink til å bryte ned spillet og gjøre det forståelig for alle, uansett nivå." },
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
            Kom i gang
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <LinkCard
              href="https://www.facebook.com/profile.php?id=61587334652354&locale=nb_NO"
              title="Facebook"
              description="Lik siden vår for aktuell info om treninger."
              icon={<Facebook className="w-5 h-5" />}
              iconColor="text-[#4267B2]"
              glowColor="bg-[#4267B2]/15"
              hoverTitle="group-hover:text-[#4267B2]"
            />
            <LinkCard
              href="https://www.instagram.com/tromsoflaggfotball/"
              title="Instagram"
              description="Bilder og videoer fra trening og kamper."
              icon={<Instagram className="w-5 h-5" />}
              iconColor="text-[#C13584]"
              glowColor="bg-[#C13584]/15"
              hoverTitle="group-hover:text-[#C13584]"
            />
            <LinkCard
              href="https://flaggfotball.no"
              title="Flaggfotball.no"
              description="Lær mer om sporten, regler og turneringer i Norge."
              icon={<Flag className="w-5 h-5" />}
              iconColor="text-emerald-400"
              glowColor="bg-emerald-400/15"
              hoverTitle="group-hover:text-emerald-400"
            />
            <LinkCard
              href="https://club.spond.com/landing/signup/naik/form/0A2A60617F184406B7FFEAA4EDC61409"
              title="Bli medlem"
              description="Meld deg inn i Amerikanske Idretters klubb via Spond."
              icon={<UserPlus className="w-5 h-5" />}
              iconColor="text-sky-400"
              glowColor="bg-sky-400/15"
              hoverTitle="group-hover:text-sky-400"
            />
            <LinkCard
              href="https://amerikanskeidretter.no/forbund/klubbdrift/lisens-og-forsikring/#amerikansk-fotball-lisens"
              title="Lisens & forsikring"
              description="Forsikring for deltakere i flaggfotball via Min Idrett."
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
            Se flaggfotball i aksjon
          </h2>
          <p className="text-muted-foreground font-body text-sm mb-6">
            Fanatics Flag Football Classic — Wildcats FFC vs. Team USA
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
            Ofte stilte spørsmål
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
            <FaqItem
              q="Hvem kan være med?"
              a="Alle fra 16 år og oppover er velkommen! Ingen erfaring nødvendig — vi tilpasser treningene slik at alle kan delta og utvikle seg."
            />
            <FaqItem
              q="Trenger jeg erfaring?"
              a="Nei! Vi tar imot alle, fra nybegynnere til de med erfaring. Treningene er tilpasset slik at du lærer underveis."
            />
            <FaqItem
              q="Hva koster det?"
              a="Trening er helt gratis! Du trenger medlemskap i Amerikanske Idretters klubb (ca 80 kr) og lisens/forsikring via Min Idrett (ca 100 kr)."
            />
            <FaqItem
              q="Hva må jeg ta med?"
              a="Sportklær og joggesko. Alt annet utstyr har vi. Ta gjerne med en vannflaske."
            />
            <FaqItem
              q="Hvor mange på laget?"
              a="Flaggfotball spilles 5 mot 5 på banen. Vi deler inn i lag på trening."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-6 h-6" />
            <span className="font-heading text-sm font-bold text-muted-foreground">
              Tromsø Flaggfotball
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tromsø Flaggfotball
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
      <p className="font-heading text-lg font-bold text-foreground">{value}</p>
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
      <p className={`font-heading font-bold text-foreground transition-colors ${hoverTitle || "group-hover:text-primary"}`}>
        {title}
      </p>
      <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>
    </div>
  </a>
);

const GameSection = () => {
  return (
    <section id="spillet" className="py-16 px-6 scroll-mt-16 bg-card/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
          Dette er flaggfotball
        </h2>
        <p className="text-muted-foreground font-body mb-6">
          Utforsk formasjoner, spilltyper og forsvarstaktikker.
        </p>

        {/* Desktop: 3-column layout with positions flanking the diagram */}
        <div className="hidden md:grid md:grid-cols-[1fr_2fr_1fr] gap-6 items-start">
          {/* Offense positions - left */}
          <div>
            <h3 className="font-heading text-lg font-bold text-sky-400 mb-4">Angrep</h3>
            <div className="space-y-3">
              {offensePositions.map((pos) => (
                <PositionCard key={pos.name} {...pos} variant="offense" />
              ))}
            </div>
          </div>

          {/* Field diagram - center */}
          <div>
            <FieldDiagram />
            <a
              href={POSITIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-primary font-body hover:opacity-80 transition-opacity mt-4"
            >
              Les mer om alle posisjoner på flaggfotball.no →
            </a>
          </div>

          {/* Defense positions - right */}
          <div>
            <h3 className="font-heading text-lg font-bold text-rose-400 mb-4">Forsvar</h3>
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
            <FieldDiagram />
            <a
              href={POSITIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-primary font-body hover:opacity-80 transition-opacity mt-4"
            >
              Les mer om alle posisjoner på flaggfotball.no →
            </a>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="font-heading text-base font-bold text-sky-400 mb-2.5">Angrep</h3>
              <div className="space-y-0">
                {offensePositions.map((pos) => (
                  <PositionCard key={pos.name} {...pos} variant="offense" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading text-base font-bold text-rose-400 mb-2.5">Forsvar</h3>
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
  return (
    <section id="treninger" className="py-16 px-6 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
          Treninger
        </h2>

        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex flex-col gap-4 md:w-1/3 shrink-0">
            <InfoCard icon={<Calendar className="w-5 h-5" />} label="Dag" value="Mandager" />
            <InfoCard icon={<Clock className="w-5 h-5" />} label="Tid" value="20:30 – 22:00" />
            <InfoCard icon={<MapPin className="w-5 h-5" />} label="Sted" value="Mellomvegen 110" />
          </div>

          <div className="rounded-xl overflow-hidden border border-border flex-1 h-[180px] md:h-[160px]">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Mellomvegen+110,+9006+Tromsø&maptype=satellite&zoom=17"
              title="Mellomvegen 110, Tromsø"
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
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left py-1.5"
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
      {/* Mobile layout - stacked */}
      <div className="flex md:hidden items-start gap-3">
        <div className="text-primary shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <span className="text-xs text-primary uppercase tracking-wider font-body block">{title}</span>
          <span className="font-heading font-bold text-foreground block">{name}</span>
          <a
            href={`tel:+47${phone.replace(/\s/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors font-body text-sm mt-0.5"
          >
            <Phone className="w-3.5 h-3.5" />
            {phone}
          </a>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground font-body leading-relaxed mt-3 pl-9">
            {bio}
          </p>
        </div>
      </div>
    </button>
  );
};

const PositionCard = ({
  name,
  abbr,
  tagline,
  icon,
  glowBg,
  role,
  traits,
  nflExamples,
  variant = "offense",
}: {
  name: string;
  abbr: string;
  tagline: string;
  icon: React.ReactNode;
  glowBg?: string;
  role: string;
  traits: string;
  nflExamples?: string;
  variant?: "offense" | "defense";
}) => {
  const [open, setOpen] = useState(false);
  const isOffense = variant === "offense";
  const accentColor = isOffense ? "text-sky-400" : "text-rose-400";
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
        className="relative w-full text-left px-3 py-1.5 md:py-1.5 py-2"
      >
        <div className="relative flex items-center gap-2">
          <div className={accentColor}>{icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-bold text-foreground text-sm">
              {name}
              {abbr && (
                <sup className={`ml-0.5 transition-all duration-300 text-[0.7em] align-super ${accentColor} ${open ? "opacity-0" : "opacity-50"}`}>
                  {abbr}
                </sup>
              )}
            </h3>
            {/* Tagline: hidden on mobile when collapsed, always visible on desktop */}
            <p className={`text-xs text-muted-foreground font-body mt-0.5 transition-all duration-300 overflow-hidden hidden md:block ${open ? "md:max-h-0 md:opacity-0 md:mt-0" : "md:max-h-10 md:opacity-100"}`}>{tagline}</p>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div className={`relative grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${open ? "mt-1 md:mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-1.5 pl-10 md:pl-7 pb-1 md:pb-0.5 px-3">
            {/* Show tagline inside expanded content on mobile */}
            <p className="text-xs text-muted-foreground font-body leading-relaxed italic md:hidden">{tagline}</p>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">{role}</p>
            <p className={`text-xs font-body ${accentColor}`}>
              <span className="text-muted-foreground">Passer for:</span> {traits}
            </p>
            {nflExamples && (
              <p className="text-xs font-body text-muted-foreground">
                <span className="text-foreground font-semibold">NFL:</span> {nflExamples}
              </p>
            )}
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
      className="w-full text-left bg-primary/5 border border-primary/10 rounded-xl p-4 transition-all hover:bg-primary/10 hover:border-primary/20"
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
