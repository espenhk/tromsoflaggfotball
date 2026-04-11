import { ArrowLeft, Users, Target, Shield, Zap, Brain, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "@/assets/logo.png";
import FieldDiagram from "@/components/FieldDiagram";

const POSITIONS_URL = "https://flaggfotball.no/pages/posisjoner-i-flaggfotball";

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
    icon: <Zap className="w-5 h-5" />,
    role: "Tar imot ballen fra QB og løper med den. Kan også brukes som mottaker på korte pasninger.",
    traits: "Eksplosiv fart, god balanse, evne til å lese blokker. Perfekt for de som liker å løpe med ballen.",
  },
];

const defensePositions = [
  {
    name: "Rusher",
    icon: <Target className="w-5 h-5" />,
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

const tactics = [
  {
    title: "Angrep: Spread Offense",
    description:
      "Mottakerne sprer seg over hele banen for å skape rom. QB leser forsvaret og kaster til den som er mest åpen. Enkel å lære, vanskelig å forsvare.",
  },
  {
    title: "Angrep: Play Action",
    description:
      "QB later som hen skal gi ballen til en løper, men kaster i stedet en lang pasning. Effektivt for å lure forsvaret ut av posisjon.",
  },
  {
    title: "Forsvar: Man-to-Man",
    description:
      "Hver forsvarsspiller dekker én bestemt mottaker. Krever god fart og disiplin, men er enklest å organisere.",
  },
  {
    title: "Forsvar: Zone",
    description:
      "Forsvarerne dekker hver sin sone på banen i stedet for én spiller. Godt mot lag med mange mottakere, men krever kommunikasjon.",
  },
];

const OmSporten = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="font-heading text-sm font-bold text-muted-foreground">
              Tromsø Flaggfotball
            </span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Om sporten
          </h1>
          <p className="text-lg text-muted-foreground font-body leading-relaxed">
            Flaggfotball er en kontaktfri variant av amerikansk fotball. I stedet for å tackle
            drar du av et flagg som henger i beltet til motstanderen. Sporten er rask, taktisk
            og inkluderende — og vokser raskt over hele verden. Flaggfotball blir olympisk
            idrett i LA 2028.
          </p>
        </div>
      </section>

      {/* Mixed / inkludering */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="text-primary mt-1">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-3">
                  Åpent for alle
                </h2>
                <p className="text-muted-foreground font-body leading-relaxed mb-3">
                  Flaggfotball er åpent for alle kjønn. I Norge spilles det ofte <strong className="text-foreground">mixed</strong> — med
                  spillere av alle kjønn på samme lag og i samme kamper. Det gjør sporten
                  unik: fart, teknikk og spilleforståelse betyr mer enn fysisk styrke.
                </p>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Både nasjonalt og internasjonalt finnes det egne divisjoner for herrer,
                  damer og mixed. I Tromsø trener vi alltid sammen — og det er nettopp det
                  som gjør det gøy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spillformat */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
            Hvordan spilles det?
          </h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              Flaggfotball spilles vanligvis <strong className="text-foreground">5 mot 5</strong> på en bane
              som er omtrent 70 × 30 meter. Hvert lag har fire forsøk (downs) på å krysse
              midtlinjen, og deretter fire nye forsøk for å score touchdown i endesonen.
            </p>
            <p>
              Det er ingen kontakt — for å stoppe en ballbærer drar du av et av flaggene som
              henger i beltet. Spillet går raskt, med mange vendinger og taktiske valg.
            </p>
            <p>
              En kamp varer typisk 2 × 20 minutter med løpende klokke. Lagene bytter mellom
              angrep og forsvar.
            </p>
          </div>
        </div>
      </section>

      {/* Posisjoner */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
            Posisjoner
          </h2>

          <FieldDiagram />

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

      {/* Taktikk */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
            Enkel taktikk
          </h2>
          <p className="text-muted-foreground font-body mb-8">
            Flaggfotball er et taktisk spill der forberedelse og kommunikasjon er like viktig
            som fart. Her er noen grunnleggende konsepter.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {tactics.map((t) => (
              <div key={t.title} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <h3 className="font-heading font-bold text-foreground text-sm">{t.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {t.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
            Klar for å prøve?
          </h2>
          <p className="text-muted-foreground font-body mb-6">
            Ingen erfaring nødvendig. Møt opp på trening, så lærer du underveis.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-primary-foreground font-heading font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Tilbake til forsiden
          </Link>
        </div>
      </section>
    </div>
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

export default OmSporten;
