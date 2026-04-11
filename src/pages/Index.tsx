import { Facebook, Instagram, Phone, MapPin, Clock, Calendar, ExternalLink, ChevronDown, Flag, Users, Star, Shield, Zap, Target } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.png";
import FieldDiagram from "@/components/FieldDiagram";

const POSITIONS_URL = "https://flaggfotball.no/pages/posisjoner-i-flaggfotball";

const navItems = [
  { id: "om", label: "Om sporten" },
  { id: "treninger", label: "Treninger" },
  { id: "spillet", label: "Slik spilles det" },
  { id: "coachene", label: "Coachene" },
  { id: "kom-i-gang", label: "Kom i gang" },
  { id: "video", label: "Video" },
  { id: "faq", label: "FAQ" },
];

const offensePositions = [
  {
    name: "Quarterback (QB)",
    icon: <Star className="w-5 h-5" />,
    role: "Lagets playmaker og leder på banen. Quarterback kaster ballen til medspillere og styrer spillet.",
    traits: "God oversikt, presise kast, rask beslutningstaking. Trenger ikke være raskest — men må lese spillet godt.",
  },
  {
    name: "Center (C)",
    icon: <Shield className="w-5 h-5" />,
    role: "Starter hvert spill ved å snappe ballen til QB. Går deretter ut som mottaker eller blokkerer rusheren.",
    traits: "Pålitelig, god kommunikasjon, allsidig. En stabil spiller som gjør de små tingene riktig.",
  },
  {
    name: "Wide Receiver (WR)",
    icon: <Zap className="w-5 h-5" />,
    role: "Løper ruter og fanger pasninger fra QB. Målet er å bli fri fra forsvareren og ta imot ballen.",
    traits: "Hurtighet, gode hender, evne til å lese forsvar. Perfekt for de som liker å løpe og gjøre raske vendinger.",
  },
  {
    name: "Running Back (RB)",
    icon: <Target className="w-5 h-5" />,
    role: "Tar imot ballen fra QB og løper med den. Kan også brukes som mottaker på korte pasninger.",
    traits: "Eksplosiv fart, god balanse, evne til å lese blokker. Perfekt for de som liker å løpe med ballen.",
  },
];

const defensePositions = [
  {
    name: "Rusher",
    icon: <Zap className="w-5 h-5" />,
    role: "Forsvarsspilleren som jager QB etter snap. Har et visst antall sekunder før hen kan krysse scrimmage-linjen.",
    traits: "Eksplosiv fart, timing, aggressivitet. Liker du å jage og presse — er dette rollen for deg.",
  },
  {
    name: "Defensive Back (DB)",
    icon: <Shield className="w-5 h-5" />,
    role: "Dekker motstanderens mottakere. Målet er å hindre pasninger og dra flagget til ballbæreren.",
    traits: "Rask reaksjon, god fotarbeid, evne til å speile en motstander. Passer for de som liker en-mot-en-dueller.",
  },
];

const Index = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
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
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-2">
            TROMSØ
          </h1>
          <p className="font-heading text-xl md:text-2xl font-bold text-primary tracking-widest uppercase mb-4">
            Flaggfotball
          </p>
          <div className="w-16 h-px bg-primary/50 mb-4" />
          <p className="font-body text-muted-foreground text-sm tracking-widest uppercase">
            Arktisk flaggfotball · 69°N
          </p>
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
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8">
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
        </div>
      </section>

      {/* Treninger */}
      <section id="treninger" className="py-16 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
              Treninger
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard icon={<Calendar className="w-5 h-5" />} label="Dag" value="Mandager" />
              <InfoCard icon={<Clock className="w-5 h-5" />} label="Tid" value="20:30 – 22:00" />
              <InfoCard icon={<MapPin className="w-5 h-5" />} label="Sted" value="Mellomvegen 110" />
            </div>
            <div className="mt-8 rounded-xl overflow-hidden border border-border aspect-video">
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

      {/* Banediagram */}
      <section id="spillet" className="py-16 px-6 scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            Slik spilles det
          </h2>
          <p className="text-muted-foreground font-body text-center mb-8">
            Utforsk formasjoner, spilltyper og forsvarstaktikker.
          </p>
          <FieldDiagram />
        </div>
      </section>

      {/* Posisjoner */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            Posisjoner
          </h2>

          <h3 className="font-heading text-lg font-bold text-primary mb-4">Angrep</h3>
          <div className="space-y-4 mb-8">
            {offensePositions.map((pos) => (
              <PositionCard key={pos.name} {...pos} />
            ))}
          </div>

          <h3 className="font-heading text-lg font-bold text-primary mb-4">Forsvar</h3>
          <div className="space-y-4 mb-6">
            {defensePositions.map((pos) => (
              <PositionCard key={pos.name} {...pos} />
            ))}
          </div>

          <a
            href={POSITIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-primary font-body hover:opacity-80 transition-opacity"
          >
            Les mer om alle posisjoner på flaggfotball.no →
          </a>
        </div>
      </section>

      {/* Coachene */}
      <section id="coachene" className="py-16 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            Coachene
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <CoachCard
              title="Head Coach"
              name="Espen Haukeland Kristensen"
              phone="958 48 889"
              bio="Espen har fire sesonger som spiller i Vålerenga Trolls (amerikansk fotball) bak seg, der han spilte quarterback, wide receiver og linebacker. Etter spillerkarrieren gikk han over til trenerbenken — tre år som coach for seniorer, U13 og damelag, med spesialfelt som QB-coach. Tok NM-bronse i flaggfotball i 2025."
            />
            <CoachCard
              title="Assistentcoach"
              name="Martin Sand Monsen"
              phone="952 99 706"
              bio="Martin er en av de sentrale figurene fra Tromsø Trailblazers og har spilt flaggfotball i 3–4 år — på alle posisjoner. Til daglig jobber han som lærer, noe som gjør ham til en naturlig pedagog på banen. Flink til å bryte ned spillet og gjøre det forståelig for alle, uansett nivå."
            />
          </div>
        </div>
      </section>

      {/* Kom i gang */}
      <section id="kom-i-gang" className="py-16 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            Kom i gang
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <LinkCard
              href="https://www.facebook.com/profile.php?id=61587334652354&locale=nb_NO"
              title="Facebook"
              description="Lik siden vår for aktuell info om treninger og arrangementer."
              icon={<Facebook className="w-5 h-5" />}
            />
            <LinkCard
              href="https://www.instagram.com/tromsoflaggfotball/"
              title="Instagram"
              description="Bilder og videoer fra trening og kamper."
              icon={<Instagram className="w-5 h-5" />}
            />
            <LinkCard
              href="https://flaggfotball.no"
              title="Flaggfotball.no"
              description="Lær mer om sporten, regler og turneringer i Norge."
              icon={<Flag className="w-5 h-5" />}
            />
            <LinkCard
              href="https://club.spond.com/landing/signup/naik/form/0A2A60617F184406B7FFEAA4EDC61409"
              title="Bli medlem"
              description="Meld deg inn i Amerikanske Idretters klubb via Spond."
            />
            <LinkCard
              href="https://amerikanskeidretter.no/forbund/klubbdrift/lisens-og-forsikring/#amerikansk-fotball-lisens"
              title="Lisens & forsikring"
              description="Forsikring for deltakere i flaggfotball via Min Idrett."
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
      <section id="faq" className="py-16 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            Ofte stilte spørsmål
          </h2>
          <div className="space-y-3">
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
              a="Trening er helt gratis! Du trenger medlemskap i Amerikanske Idretters klubb (ca 80 kr) og lisens/forsikring via Min Idrett (ca 100 kr). Reiser og påmelding til kamper eller turneringer dekkes av den enkelte."
            />
            <FaqItem
              q="Hva trenger jeg å ta med?"
              a="Sportklær og joggesko. Alt annet utstyr har vi. Ta gjerne med en vannflaske."
            />
            <FaqItem
              q="Hvor mange er på et lag?"
              a="Flaggfotball spilles vanligvis 5 mot 5 på banen. Vi deler inn i lag på trening."
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
}: {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-card border border-border rounded-xl p-6 flex items-start gap-4 hover:border-primary/40 transition-colors"
  >
    <div className="text-primary mt-0.5">
      {icon || <ExternalLink className="w-5 h-5" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">
        {title}
      </p>
      <p className="text-sm text-muted-foreground font-body mt-1">{description}</p>
    </div>
  </a>
);

const CoachCard = ({
  title,
  name,
  phone,
  bio,
}: {
  title: string;
  name: string;
  phone: string;
  bio: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-primary uppercase tracking-wider font-body mb-1">{title}</p>
          <p className="font-heading font-bold text-foreground text-lg">{name}</p>
          <a
            href={`tel:+47${phone.replace(/\s/g, "")}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mt-1"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="text-sm text-muted-foreground font-body leading-relaxed mt-4 border-t border-border pt-4">
          {bio}
        </p>
      )}
    </button>
  );
};

const PositionCard = ({
  name,
  icon,
  role,
  traits,
}: {
  name: string;
  icon: React.ReactNode;
  role: string;
  traits: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <h3 className="font-heading font-bold text-foreground flex-1">{name}</h3>
        <svg
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && (
        <div className="mt-3 space-y-2 pl-8">
          <p className="text-sm text-muted-foreground font-body leading-relaxed">{role}</p>
          <p className="text-xs text-primary font-body">
            <span className="text-muted-foreground">Passer for:</span> {traits}
          </p>
          <a
            href={POSITIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-block text-xs text-muted-foreground hover:text-primary transition-colors font-body"
          >
            Les mer på flaggfotball.no →
          </a>
        </div>
      )}
    </button>
  );
};

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-card border border-border rounded-xl p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-heading font-bold text-foreground">{q}</p>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <p className="text-sm text-muted-foreground font-body mt-3 leading-relaxed">{a}</p>
      )}
    </button>
  );
};

export default Index;
