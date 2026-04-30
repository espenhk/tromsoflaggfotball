import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronDown, Star, Zap, Users, Target, Crosshair, Shield, Eye } from "lucide-react";
import logo from "@/assets/logo.png";
import FieldDiagram from "@/components/FieldDiagram";
// QB and WR images are intentionally swapped — the source PDF had them mislabeled
import qbImg from "@/assets/positions/wide-receiver.png";
import centerImg from "@/assets/positions/center.png";
import rbImg from "@/assets/positions/running-back.png";
import wrImg from "@/assets/positions/quarterback.png";
import dbImg from "@/assets/positions/defensive-back.png";
import rusherImg from "@/assets/positions/rusher.png";
import safetyImg from "@/assets/positions/safety.png";

type PositionData = {
  id: string;
  name: string;
  abbr: string;
  side: "offense" | "defense";
  tagline: string;
  icon: React.ReactNode;
  accentColor: string;
  glowBg: string;
  image: string;
  intro: string;
  description: string[];
  skills: { label: string; detail: string }[];
  whoFits: string;
  nflExamples: string;
};

const positions: PositionData[] = [
  {
    id: "quarterback",
    name: "Quarterback",
    abbr: "QB",
    side: "offense",
    tagline: "Lagets hjerne og leder",
    icon: <Star className="w-5 h-5" />,
    accentColor: "text-amber-400",
    glowBg: "bg-amber-400/10",
    image: qbImg,
    intro:
      "Quarterbacken er lagets offensive leder og den viktigste posisjonen på banen. Tenk på QBen som hjernen i angrepet – det er denne spilleren som mottar ballen ved hvert eneste spill, leser forsvaret og tar avgjørelsen om ballen skal kastes eller leveres videre.",
    description: [
      "Hvert spill i flaggfotball starter med et snap til quarterbacken. Deretter må QBen raskt bestemme seg: Skal ballen kastes til en mottaker, eller skal den leveres til en running back? I flaggfotball har QBen typisk ikke lov til å løpe med ballen selv etter snappet, noe som gjør kasteferdigheter og spillforståelse enda viktigere enn i vanlig fotball.",
      "QBen er den mest synlige spilleren på banen og berører ballen på hvert eneste drive. Det krever mental styrke å stå under press fra en rusher som kommer stormende, samtidig som du skal finne en åpen mottaker.",
    ],
    skills: [
      { label: "Overblikk", detail: "Evnen til å skanne feltet og finne åpne mottakere" },
      { label: "Lese forsvar", detail: "Forstå hva motstanderens forsvar prøver å gjøre" },
      { label: "Kastfundamenter", detail: "Opptrekk, utløsning, presisjon og styrke i kastearmen" },
      { label: "Hurtighet", detail: "Evnen til å unngå forsvarets passrush" },
      { label: "Lederskap", detail: "Holde hodet kaldt når det koker rundt deg" },
    ],
    whoFits:
      "Du trenger ikke være størst eller raskest – men du må elske å ta ansvar, kommunisere med lagkameratene og ta raske beslutninger. Gode ledere som holder seg rolige under press trives i denne rollen.",
    nflExamples: "Patrick Mahomes, Josh Allen, Lamar Jackson",
  },
  {
    id: "center",
    name: "Center",
    abbr: "C",
    side: "offense",
    tagline: "Den allsidige starteren",
    icon: <Users className="w-5 h-5" />,
    accentColor: "text-sky-400",
    glowBg: "bg-sky-400/10",
    image: centerImg,
    intro:
      "Centeren er spilleren som setter i gang hvert eneste spill ved å snappe ballen til quarterbacken. Men i flaggfotball stopper ikke jobben der – centeren blir umiddelbart en mottaker etter snappet!",
    description: [
      "I motsetning til i tackle-fotball, der centeren hovedsakelig blokkerer, blir centeren i flaggfotball en wide receiver etter å ha snappet ballen. Det betyr at denne posisjonen er dobbelt så krevende: Du må mestre det tekniske snappet, og i neste sekund akselerere ut på en løpsrute for å ta imot en pasning.",
      "Centeren må også kommunisere tett med quarterbacken før hvert spill – de leser forsvaret sammen og kan justere spillet basert på hva de ser.",
    ],
    skills: [
      { label: "Presis koordinasjon", detail: "Å snappe ballen nøyaktig til QBen for å starte spillet" },
      { label: "Raske reflekser", detail: "Gå fra snap til sprint på et øyeblikk" },
      { label: "Lese forsvar", detail: "Kommunisere med QBen om forsvarets oppsett" },
      { label: "Mottakerferdigheter", detail: "Akselerere kraftig, løpe ruter og ta imot pasninger" },
    ],
    whoFits:
      "Den allsidige spilleren som liker å ha mange ulike oppgaver. Du er like komfortabel med det tekniske snappet som med å løpe en skarp slant-rute. Denne posisjonen passer for spillere som er flinke til å multitaske.",
    nflExamples: "Travis Kelce (TE), Jason Kelce",
  },
  {
    id: "wide-receiver",
    name: "Wide Receiver",
    abbr: "WR",
    side: "offense",
    tagline: "Fartsdemonen og fangstartisten",
    icon: <Target className="w-5 h-5" />,
    accentColor: "text-sky-400",
    glowBg: "bg-sky-400/10",
    image: wrImg,
    intro:
      "Wide receiverens hovedjobb er å fange pasninger fra quarterbacken og avansere nedover banen – eller score! Mottakerne løper presise og ofte komplekse løpsruter for å komme fri fra forsvarerne sine.",
    description: [
      "I flaggfotball har lagene typisk to til tre wide receivers på banen samtidig. Mottakerne er ofte de raskeste spillerne på laget. De må mestre en rekke ulike løpsruter – som slant, curl, post og go-ruter – og utføre dem med presisjonstiming sammen med QBen.",
      "En god mottaker er ikke bare rask – de har «gode hender» og evnen til å ta imot vanskelige pasninger i fart, med forsvarere tett på. Etter fangsten handler det om å beskytte flaggene sine og vinne mest mulig yardage.",
    ],
    skills: [
      { label: "Fart og utholdenhet", detail: "Du prøver alltid å utløpe motstanderen" },
      { label: "Løpsruter", detail: "Presisjonen i føttene er avgjørende" },
      { label: "Gode hender", detail: "Akselerasjon, styrke og hoppevne for vanskelige fangster" },
      { label: "Kommunikasjon", detail: "Timing og forståelse med quarterbacken" },
    ],
    whoFits:
      "Er du rask, elsker å løpe og har gode hender? Da er wide receiver din posisjon. Du trenger ikke være størst, men du må elske å utfordre forsvarere i en-mot-en-dueller og ha selvtillit til å ta imot avgjørende pasninger.",
    nflExamples: "Tyreek Hill, Ja'Marr Chase, CeeDee Lamb",
  },
  {
    id: "running-back",
    name: "Running Back",
    abbr: "RB",
    side: "offense",
    tagline: "Den smidige allrounderen",
    icon: <Zap className="w-5 h-5" />,
    accentColor: "text-emerald-400",
    glowBg: "bg-emerald-400/10",
    image: rbImg,
    intro:
      "Running backen er ansvarlig for å bære ballen under løpespill. Etter at ballen er snappet, mottar de en hand-off fra quarterbacken og løper med ballen for å avansere nedover banen. Får de ikke ballen, blir de en mottaker.",
    description: [
      "Running backen stiller opp i bakfeltet og er en svært allsidig spiller. Løpespill er ikke tillatt innenfor fem yards fra midtbanen eller endesonen i NFL FLAG-fotball, noe som betyr at denne posisjonen typisk tilpasser rollen sin til spillet oftere enn andre.",
      "Denne spilleren må kunne lese forsvaret i sanntid – finne hull og utnytte dem. Når de ikke løper med ballen, blir de en ekstra mottaker, noe som gjør dem ekstra vanskelige å forsvare seg mot.",
    ],
    skills: [
      { label: "Raske føtter", detail: "Akselerasjon og smidighet – nøkkelegenskaper for en god RB" },
      { label: "Allsidighet", detail: "Forstår grunnleggende ferdigheter og fyller inn der det trengs" },
      { label: "Mottakerferdigheter", detail: "Gode hender for å ta vanskelige pasninger" },
      { label: "Spillforståelse", detail: "Evnen til å lese hull i forsvaret og ta raske avgjørelser" },
    ],
    whoFits:
      "Du er den ultimate allrounderen. Rask, smidig, med gode hender og en instinktiv evne til å finne åpne rom. Du er like komfortabel med å ta imot en hand-off som å løpe en mottakerrute.",
    nflExamples: "Derrick Henry, Saquon Barkley, Christian McCaffrey",
  },
  {
    id: "rusher",
    name: "Rusher",
    abbr: "R",
    side: "defense",
    tagline: "Pressmaskinen",
    icon: <Crosshair className="w-5 h-5" />,
    accentColor: "text-orange-400",
    glowBg: "bg-orange-400/10",
    image: rusherImg,
    intro:
      "Rusheren er forsvarets presselement – oppgaven er å stresse quarterbacken og forhindre at pasningen blir fullført. Rusheren starter syv yards bak scrimmage-linjen ved snappet, og QBen har en syv-sekunders klokke til å kaste ballen.",
    description: [
      "Essensen er enkel: jo raskere rusheren kommer frem til quarterbacken, jo større sjanse har forsvaret til å tvinge frem feil og avskjæringer.",
      "Rusheren er forsvarets angriper. Du starter med en eksplosiv sprint fra syv yards unna, og målet er å nå QBen før de rekker å kaste. Når du er nær nok, handler det om kontrollert aggressivitet – du må bremse ned nok til å dra flaggene av QBen uten å skli forbi.",
    ],
    skills: [
      { label: "Eksplosiv fart", detail: "Startfart fra stående posisjon" },
      { label: "Kontroll", detail: "Bremse ned i rett øyeblikk for å dra flagget" },
      { label: "Flaggteknikk", detail: "Korrekt posisjonering og bevegelse" },
      { label: "Utholdenhet", detail: "Du sprinter på hvert eneste spill" },
      { label: "Strategiske vinkler", detail: "Kutte av QBens fluktmuligheter" },
    ],
    whoFits:
      "Du er eksplosiv, elsker å jage og har et drivende ønske om å påvirke hvert eneste spill. Du er typen som trives med å sette press og skape kaos for motstanderen.",
    nflExamples: "Myles Garrett, Micah Parsons, T.J. Watt",
  },
  {
    id: "defensive-back",
    name: "Defensive Back",
    abbr: "DB",
    side: "defense",
    tagline: "Skyggen som klistrer seg til mottakerne",
    icon: <Shield className="w-5 h-5" />,
    accentColor: "text-rose-400",
    glowBg: "bg-rose-400/10",
    image: dbImg,
    intro:
      "En defensive backs primære mål er å forsvare wide receivers og enten snappe en pasning i luften (interception) eller dra flaggene av ballbæreren.",
    description: [
      "Defensive backs kan spille enten mann-mot-mann eller soneforsvar, avhengig av trenerens strategi. I mann-mot-mann følger du én spesifikk mottaker over hele banen – du er skyggen deres. I soneforsvar dekker du et bestemt område og reagerer på hvem som kommer inn i din sone.",
      "Denne posisjonen krever en sjelden kombinasjon av fysisk fart og mental skarphet. Du må kunne løpe baklengs, snu raskt, lese QBens øyne og reagere lynraskt når ballen er i luften.",
    ],
    skills: [
      { label: "Rask og smidig", detail: "For å forsvare motstanderens raskeste spillere" },
      { label: "Mental skarphet", detail: "Lese banen og reagere på kaste- eller løpespill" },
      { label: "Ballreaksjon", detail: "Fange (intercepte) pasninger i luften" },
      { label: "Flaggteknikk", detail: "Korrekt posisjonering og bevegelse for å rive flagget av ballbæreren" },
    ],
    whoFits:
      "Du er konkurranseinstinkt i menneskeform. Du elsker en-mot-en-dueller, har raske føtter og øyne som alltid følger ballen. Du trives med å ødelegge for motstanderens angrep.",
    nflExamples: "Sauce Gardner, Patrick Surtain II, Jalen Ramsey",
  },
  {
    id: "safety",
    name: "Safety",
    abbr: "S",
    side: "defense",
    tagline: "Siste skanse",
    icon: <Eye className="w-5 h-5" />,
    accentColor: "text-rose-400",
    glowBg: "bg-rose-400/10",
    image: safetyImg,
    intro:
      "Safetyen står lengre bak fra scrimmage-linjen og fungerer som et sikkerhetsnett – ansvarlig for å stoppe motstandere som slipper løs.",
    description: [
      "Denne spilleren sitter lengre bak bak scrimmage-linjen og fungerer som en «catch-all», og stopper alle som slipper gjennom. Hvis en offensiv spiller bryter gjennom på et løpespill, eller en wide receiver løper en dyp rute, dekker safetyen og forhindrer ballbæreren fra å score.",
      "Safetyen er forsvarets siste forsvarslinje. Du må ha et fugleperspektiv på hele banen, lese spillet før det utfolder seg, og ta kampavgjørelser i sanntid om hvor dekningen trengs mest. Denne posisjonen er mer vanlig i 7-mot-7-format, men brukes også i 5-mot-5 som en taktisk variant.",
    ],
    skills: [
      { label: "Lese spillet", detail: "Ta beslutninger i kampfart om hvor dekning trengs" },
      { label: "Fart", detail: "Dekke store avstander raskt" },
      { label: "Flaggteknikk", detail: "Som alle forsvarsspillere" },
      { label: "Spilloversikt", detail: "Forstå helheten i motstanderens angrep" },
      { label: "Kommunikasjon", detail: "Dirigere medspillerne foran deg" },
    ],
    whoFits:
      "Du er den rolige, oversiktlige spilleren som ser spillet fra et overordnet perspektiv. Du er smart, rask og trives med ansvaret for å være den siste som kan redde situasjonen.",
    nflExamples: "Kyle Hamilton, Derwin James, Jessie Bates III",
  },
];

// Order matches the main page (Index.tsx)
const offenseOrder = ["quarterback", "running-back", "center", "wide-receiver"];
const defenseOrder = ["rusher", "defensive-back", "safety"];
const byId = Object.fromEntries(positions.map((p) => [p.id, p]));
const offensePositions = offenseOrder.map((id) => byId[id]);
const defensePositions = defenseOrder.map((id) => byId[id]);

const Posisjoner = () => {
  const { hash } = useLocation();
  const [openId, setOpenId] = useState<string | null>(null);
  // Fullscreen diagram view shown when user lands on /posisjoner without a target hash
  const [showFullscreen, setShowFullscreen] = useState<boolean>(!hash);

  const openAndScroll = (id: string) => {
    // Leaving fullscreen view to reveal the page content
    setShowFullscreen(false);
    setOpenId(id);
    // Wait for the page to render before scrolling
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  useEffect(() => {
    if (hash) {
      setShowFullscreen(false);
      openAndScroll(hash.slice(1));
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-3 py-3">
          <Link
            to="/#spillet"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <img src={logo} alt="Logo" className="w-5 h-5" />
          </Link>
          <h1 className="font-heading font-bold text-foreground text-sm">Posisjoner i flaggfotball</h1>
        </div>
      </nav>
      {/* Closing message */}
      <section className="space-y-2 pt-4 border-t border-border">
        <p className="text-foreground font-body leading-relaxed font-semibold">
          Alle posisjoner i flaggfotball har fordeler – og det beste er at spillere ikke trenger en bestemt
          kroppsbygning for å lykkes.
        </p>
        <p className="text-sm text-muted-foreground font-body leading-relaxed">
          Flaggfotball er utrolig inkluderende, og mange spillere med ulik utvikling finner en posisjon der de kan være
          konkurransedyktige. I flaggfotball spiller hver spiller både angrep og forsvar, noe som betyr at allsidige
          spillere som behersker flere ferdigheter har størst suksess.
        </p>
      </section>

      {/* Fullscreen edge-to-edge field — shown when no specific position requested */}
      {showFullscreen && (
        <section className="relative w-full">
          <FieldDiagram
            onPositionNavigate={openAndScroll}
            navigateMode="direct"
            fullscreen
            variant="simple"
            stickyTopOffset={48}
          />
        </section>
      )}

      <main id="posisjoner-liste" className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">Posisjoner i flaggfotball</h2>
            <p className="text-muted-foreground font-body leading-relaxed max-w-2xl">
              I flaggfotball spilles det 5 mot 5, og posisjonene er i hovedsak de samme som i tackle-fotball, men uten
              linjemenn. Hver posisjon har en unik rolle, og hvert spill er en maskin der alle må gjøre sin del. Trykk
              på en spiller på banen — eller en posisjon i listen — for å lese mer.
            </p>
          </div>

          {/* Compact field diagram for navigation while browsing the list */}
          {!showFullscreen && (
            <FieldDiagram onPositionNavigate={openAndScroll} navigateMode="direct" variant="simple" />
          )}
        </section>

        {/* Offense */}
        <section className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-sky-400">Angrep</h3>
          <div>
            {offensePositions.map((pos) => (
              <PositionRow
                key={pos.id}
                pos={pos}
                open={openId === pos.id}
                onToggle={() => setOpenId(openId === pos.id ? null : pos.id)}
              />
            ))}
          </div>
        </section>

        {/* Defense */}
        <section className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-rose-400">Forsvar</h3>
          <div>
            {defensePositions.map((pos) => (
              <PositionRow
                key={pos.id}
                pos={pos}
                open={openId === pos.id}
                onToggle={() => setOpenId(openId === pos.id ? null : pos.id)}
              />
            ))}
          </div>
        </section>

        <div className="pt-2 pb-8">
          <Link
            to="/#spillet"
            className="text-sm text-primary hover:underline font-body inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Tilbake til hovedsiden
          </Link>
        </div>
      </main>
    </div>
  );
};

const PositionRow = ({ pos, open, onToggle }: { pos: PositionData; open: boolean; onToggle: () => void }) => {
  return (
    <article id={pos.id} className="scroll-mt-20 group relative border-t border-white/5 last:border-b">
      {/* Glow background on hover (desktop) */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${pos.glowBg} hidden md:block pointer-events-none`}
        style={{ filter: "blur(12px)" }}
      />
      <button onClick={onToggle} className="relative w-full text-left py-3 md:py-4" aria-expanded={open}>
        <div className="flex items-center gap-3">
          <div className={pos.accentColor}>{pos.icon}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-bold text-foreground">
              {pos.name}
              <sup className={`ml-1 text-[0.7em] align-super ${pos.accentColor} opacity-60`}>{pos.abbr}</sup>
            </h4>
            <p className="text-xs text-muted-foreground font-body italic mt-0.5">{pos.tagline}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <div
        className={`relative grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-6 md:pb-8 pl-8 pr-2 grid grid-cols-1 md:grid-cols-[1fr_180px] gap-6 md:gap-8 items-start">
            <div className="space-y-4 order-2 md:order-1">
              <p className="text-sm text-foreground/90 font-body leading-relaxed">{pos.intro}</p>
              {pos.description.map((p, i) => (
                <p key={i} className="text-sm text-muted-foreground font-body leading-relaxed">
                  {p}
                </p>
              ))}

              <div className="pt-1">
                <h5 className={`text-xs font-heading font-bold uppercase tracking-wider ${pos.accentColor} mb-2`}>
                  Ferdigheter & egenskaper
                </h5>
                <ul className="space-y-1.5">
                  {pos.skills.map((skill) => (
                    <li key={skill.label} className="flex items-start gap-2">
                      <div
                        className={`w-1 h-1 rounded-full ${pos.accentColor.replace("text-", "bg-")} mt-2 shrink-0`}
                      />
                      <p className="text-sm font-body">
                        <span className="text-foreground font-semibold">{skill.label}</span>
                        <span className="text-muted-foreground"> – {skill.detail}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-heading font-bold uppercase tracking-wider text-foreground mb-1">
                  Hvem passer som {pos.name.toLowerCase()}?
                </h5>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{pos.whoFits}</p>
              </div>

              <p className="text-xs font-body text-muted-foreground">
                <span className="text-foreground font-semibold">NFL-forbilder:</span> {pos.nflExamples}
              </p>
            </div>

            {/* Image */}
            <div className="order-1 md:order-2 flex justify-center md:justify-end">
              <div className="relative w-32 md:w-44">
                <div className={`absolute inset-0 rounded-full ${pos.glowBg}`} style={{ filter: "blur(24px)" }} />
                <img
                  src={pos.image}
                  alt={`${pos.name}-spiller i aksjon`}
                  className="relative w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Posisjoner;
