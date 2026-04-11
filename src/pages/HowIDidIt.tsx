import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, Sparkles, MessageSquare, Code2, Layers, Palette, Rocket, Eye, Zap } from "lucide-react";
import canvaOriginal from "@/assets/canva-original.png";
import { useNavigate } from "react-router-dom";

/* ── Mini preview components ────────────────────────────── */

function MiniFieldDiagram() {
  return (
    <div className="bg-card/80 border border-border rounded-lg p-3 max-w-[260px]">
      <div className="font-heading text-[0.55rem] uppercase tracking-widest text-primary mb-2">
        ▸ Banediagram Preview
      </div>
      <div className="relative h-32 bg-emerald-900/30 rounded overflow-hidden">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400 border border-white/60" />
        <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-3 h-3 rounded-full bg-sky-400 border border-white/60" />
        <div className="absolute top-[25%] left-[15%] w-3 h-3 rounded-full bg-sky-400 border border-white/60" />
        <div className="absolute top-[25%] left-[85%] -translate-x-full w-3 h-3 rounded-full bg-sky-400 border border-white/60" />
        <div className="absolute top-[12%] left-[63%] w-3 h-3 rounded-full bg-orange-400 border border-white/60" />
        <div className="absolute top-[8%] left-[40%] w-3 h-3 rounded-full bg-rose-400 border border-white/60" />
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-sky-900/40 flex items-center justify-center">
          <span className="text-[0.5rem] text-sky-300 font-heading">Kastespill</span>
        </div>
        <div className="absolute top-0 left-0 right-0 h-4 bg-rose-900/40 flex items-center justify-center">
          <span className="text-[0.5rem] text-rose-300 font-heading">Formasjon</span>
        </div>
      </div>
    </div>
  );
}

function MiniPositionCard() {
  return (
    <div className="bg-card/80 border border-border rounded-lg p-3 max-w-[260px]">
      <div className="font-heading text-[0.55rem] uppercase tracking-widest text-primary mb-2">
        ▸ Posisjonskort Preview
      </div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded bg-amber-400/20 flex items-center justify-center">
          <span className="text-amber-400 text-[0.5rem]">★</span>
        </div>
        <span className="font-heading text-xs font-bold text-foreground">Quarterback (QB)</span>
      </div>
      <p className="text-[0.6rem] text-muted-foreground leading-relaxed">
        Lagets playmaker og leder på banen...
      </p>
    </div>
  );
}

function MiniGlassNav() {
  return (
    <div className="bg-card/80 border border-border rounded-lg p-3 max-w-[260px]">
      <div className="font-heading text-[0.55rem] uppercase tracking-widest text-primary mb-2">
        ▸ Glass-nav Preview
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/40 backdrop-blur border border-white/15">
        <div className="w-4 h-4 rounded-full bg-primary/30" />
        <div className="w-3.5 h-3.5 text-foreground/60">☰</div>
      </div>
      <div className="mt-2 w-36 rounded-xl bg-background/50 backdrop-blur border border-white/15 p-1.5">
        {["Om sporten", "Treninger", "FAQ"].map(item => (
          <div key={item} className="text-[0.55rem] font-heading text-foreground/70 px-2 py-1 rounded">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniLinkCards() {
  return (
    <div className="bg-card/80 border border-border rounded-lg p-3 max-w-[260px]">
      <div className="font-heading text-[0.55rem] uppercase tracking-widest text-primary mb-2">
        ▸ LinkCard hover Preview
      </div>
      <div className="space-y-1.5">
        {[
          { name: "Facebook", color: "bg-[#4267B2]/15 border-[#4267B2]/30", icon: "f", iconColor: "text-[#4267B2]" },
          { name: "Instagram", color: "bg-[#C13584]/15 border-[#C13584]/30", icon: "📷", iconColor: "text-[#C13584]" },
        ].map(item => (
          <div key={item.name} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${item.color}`}>
            <span className={`text-[0.6rem] ${item.iconColor}`}>{item.icon}</span>
            <span className="text-[0.6rem] font-heading font-bold text-foreground/80">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Expandable section ─────────────────────────────────── */

function ExpandableDetail({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/5 border border-primary/15 hover:border-primary/30 transition-colors text-left"
      >
        <Code2 className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm font-heading font-bold text-primary/80 flex-1">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="mt-2 px-4 py-3 rounded-lg bg-card/50 border border-border text-sm text-muted-foreground font-body leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Step data ──────────────────────────────────────────── */

interface Step {
  phase: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  color: string;
  preview?: React.ReactNode;
}

const steps: Step[] = [
  {
    phase: "Fase 0",
    icon: <Sparkles size={20} />,
    title: "Utgangspunktet: Canva + GPT-5.2",
    description:
      "Prosjektet startet ikke med kode — det startet med en enkel Canva-side og en lang samtale med GPT-5.2. Før noe ble bygget i Lovable, var den visuelle identiteten allerede definert.",
    details: [
      "Den opprinnelige nettsiden var bygget som en enkel one-pager i Canva. Funksjonell, men statisk — ingen interaktivitet, ingen animasjoner, ingen mulighet for å utvide innhold dynamisk.",
      "Gjennom en serie samtaler med GPT-5.2 ble den visuelle retningen utforsket: arktisk tema, mørke bakgrunner, nordlys-grønne aksenter. GPT foreslo fargepaletter, fontkombos og layout-prinsipper.",
      "Font-valget landet på Syne (geometrisk, fet — perfekt for overskrifter) og Outfit (moderne, lettlest — ideell for brødtekst). Begge ble valgt for å balansere sportslighet med lesbarhet.",
      "Fargepaletten ble definert i HSL: natt-blå (#001a14) som bakgrunn, fjord-teal som sekundær, nordlys-grønn som primærfarge, og is-mint som aksent. Alt inspirert av Tromsøs arktiske landskap.",
      "Logo, ikoner og det overordnede designspråket var altså klart før Lovable kom inn i bildet. Lovable-jobben handlet om å ta en statisk visjon og gjøre den levende.",
    ],
    color: "hsl(var(--primary))",
    preview: (
      <div className="bg-card/80 border border-border rounded-lg p-3 max-w-[340px]">
        <div className="font-heading text-[0.55rem] uppercase tracking-widest text-primary mb-2">
          ▸ Original Canva-side
        </div>
        <img src={canvaOriginal} alt="Den originale Canva-siden for Tromsø Flaggfotball" className="rounded border border-border" />
      </div>
    ),
  },
  {
    phase: "Fase 1",
    icon: <Layers size={20} />,
    title: "Fra Canva til kode i Lovable",
    description:
      "Med designretningen klar ble alt overført til Lovable. Grunnstrukturen ble bygget ut: hero-seksjon, navigasjon, seksjoner for info, treninger, posisjoner og FAQ — alt med Tailwind design tokens.",
    details: [
      "Hele fargepaletten ble implementert som CSS-variabler i HSL-format, slik at alle komponenter bruker semantiske tokens (--primary, --background, --card) i stedet for hardkodede farger.",
      "Grunnstrukturen: hero med bakgrunnsbilde, sticky navigasjon, og logisk inndeling i seksjoner som brukeren kan scrolle mellom.",
      "Innholdet fra Canva-siden ble overført og reorganisert for en bedre informasjonsflyt — med ekspanderbare kort og mer interaktive elementer enn en statisk side kan tilby.",
    ],
    color: "hsl(var(--primary))",
  },
  {
    phase: "Fase 2",
    icon: <Layers size={20} />,
    title: "Interaktivt banediagram",
    description:
      "Hjertet av siden: et SVG-basert banediagram som viser flaggfotball-posisjoner og formasjoner. Spillere kan klikkes for beskrivelser, og diagrammet animerer mellom ulike spilltyper.",
    details: [
      "SVG-overlay med viewBox='0 0 100 100' for responsiv skalering. Spillerprikker posisjonert med prosent-verdier.",
      "CSS-transitions på top, left og background-color for smooth animasjoner når spillere beveger seg mellom formasjoner.",
      "Tre offensive moduser: kastespill, innleggsruter, og løpespill. Ved bytte til løpespill animeres WR til en RB-posisjon bak QB.",
      "Tre defensive moduser: formasjon, soneforsvar (med fargede ellipser), og mann-mot-mann (med dynamiske linjer).",
      "Rusher-pilen er alltid synlig med en animert SVG-markør. Pilhoder skalert med 'non-scaling-stroke' for riktig størrelse på alle skjermer.",
      "Hver spiller har klikkbare tooltips med posisjonsnavn og beskrivelse.",
    ],
    color: "hsl(var(--primary))",
    preview: <MiniFieldDiagram />,
  },
  {
    phase: "Fase 3",
    icon: <Eye size={20} />,
    title: "Posisjoner med fargekoding",
    description:
      "Posisjonskortene ble fargekodede: blå toner for angrep, røde for forsvar. Hver posisjon fikk et unikt ikon og aksent-farge for gjenkjennelse.",
    details: [
      "QB fikk en gull-stjerne, RB et grønt blink, Rusher oransje crosshair — slik at de skiller seg ut i både diagram og kortliste.",
      "Angrepskort: blå gradient-bakgrunn, blå border, blå aksenter. Forsvarskort: røde toner.",
      "Hvert kort er ekspanderbart med rolle-beskrivelse, personlige egenskaper, og NFL-eksempler.",
      "Rekkefølgen ble justert: QB → RB → C → WR for logisk flyt.",
    ],
    color: "hsl(var(--primary))",
    preview: <MiniPositionCard />,
  },
  {
    phase: "Fase 4",
    icon: <Palette size={20} />,
    title: "Mobilnavigasjon med Apple Glass-design",
    description:
      "Den horisontale scrollbare navigasjonen fungerte dårlig på mobil. Løsningen: en flytende glass-boble inspirert av Apples frosted glass-estetikk.",
    details: [
      "Desktop beholder sticky top-nav med alle seksjonslenker synlige.",
      "Mobil: en flytende boble med logo + hamburger-ikon, posisjonert øverst til venstre.",
      "Boblen bruker backdrop-blur-xl og semi-transparent bakgrunn for glass-effekten.",
      "Klikk åpner en dropdown med alle menyvalg. Menyen lukkes ved klikk utenfor (mousedown event listener).",
      "Animert innfading med Tailwind animate-in utilities.",
    ],
    color: "hsl(var(--primary))",
    preview: <MiniGlassNav />,
  },
  {
    phase: "Fase 5",
    icon: <Zap size={20} />,
    title: "Sosiale medier-ikoner med merkevarefarger",
    description:
      "Alle lenke-kort i 'Kom i gang'-seksjonen fikk individuelle merkevarefarger — Facebook-blå, Instagram-lilla, og egne farger for de andre.",
    details: [
      "Facebook: #4267B2 (tonet ned fra standard FB-blå). Instagram: #C13584 (lilla).",
      "Flaggfotball.no: emerald-grønn. Bli medlem: sky-blå. Lisens & forsikring: amber med ShieldCheck-ikon.",
      "Hover-effekt: bakgrunn, border og tittel endrer alle farge til å matche ikonet.",
      "Toppens sosiale ikoner løfter seg opp (-translate-y-0.5) på hover for en subtil microinteraction.",
    ],
    color: "hsl(var(--primary))",
    preview: <MiniLinkCards />,
  },
  {
    phase: "Fase 6",
    icon: <Rocket size={20} />,
    title: "Polering & detaljer",
    description:
      "Siste runde handlet om småting som gjør forskjellen: FAQ-grid som ikke strekker nabokort, kollapsbare seksjoner med fade-effekt, og responsiv typografi.",
    details: [
      "FAQ-grid med items-start: kort som ikke utvides forblir i sin opprinnelige størrelse.",
      "Kollapsbar 'Dette er flaggfotball'-seksjon med gradient-fade og pil-indikator.",
      "Pilhoder i SVG-diagrammet fikset med viewBox og markerUnits for konsistent størrelse på mobil vs desktop.",
      "Video-seksjon med responsiv YouTube-embed.",
    ],
    color: "hsl(var(--primary))",
  },
];

/* ── Main page ──────────────────────────────────────────── */

export default function HowIDidIt() {
  const navigate = useNavigate();
  const [openStep, setOpenStep] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-bold text-foreground text-sm">
            Hvordan denne siden ble laget
          </h1>
        </div>
      </div>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-4">
          Bygget med GPT-5.2 + Lovable
        </h2>
        <p className="text-muted-foreground font-body leading-relaxed text-lg mb-2">
          Denne nettsiden startet som en enkel Canva-side. Den visuelle identiteten — farger, fonter, og designretning — ble utviklet gjennom samtaler med <strong className="text-foreground/80">GPT-5.2</strong>. Deretter ble alt bygget ut til en interaktiv nettside med <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Lovable</a>.
        </p>
        <p className="text-muted-foreground font-body leading-relaxed">
          Ingen manuell koding. Ingen Figma. Bare naturlig språk, to AI-er, og en visjon om å gjøre flaggfotball tilgjengelig.
          Her er prosessen, steg for steg.
        </p>
      </section>

      {/* Steps */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[17px] top-0 bottom-0 w-px bg-border" />

          {steps.map((step, i) => {
            const isOpen = openStep === i;
            return (
              <div key={i} className="relative pl-16 pb-12">
                {/* Timeline icon dot */}
                <div
                  className="absolute left-0 top-0 w-[36px] h-[36px] rounded-full border-2 border-primary/40 bg-background flex items-center justify-center cursor-pointer group/dot transition-all hover:border-primary animate-pulse hover:animate-none"
                  onClick={() => setOpenStep(isOpen ? null : i)}
                >
                  <span className="text-primary/70 transition-opacity group-hover/dot:opacity-0">
                    {step.icon}
                  </span>
                  {/* Hover overlay with arrow */}
                  <div className="absolute inset-0 rounded-full bg-muted-foreground/20 flex items-center justify-center opacity-0 group-hover/dot:opacity-100 transition-opacity">
                    <ChevronDown size={16} className={`text-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </div>

                {/* Phase label */}
                <div className="font-heading text-sm uppercase tracking-[0.15em] text-primary/60 mb-1">
                  {step.phase}
                </div>

                {/* Title */}
                <button
                  onClick={() => setOpenStep(isOpen ? null : i)}
                  className="w-full text-left group"
                >
                  <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                </button>

                {/* Description (always visible) */}
                <p className="text-muted-foreground font-body leading-relaxed mt-2 text-sm">
                  {step.description}
                </p>

                {/* Expanded content */}
                {isOpen && (
                  <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Preview */}
                    {step.preview && (
                      <div className="mb-4">{step.preview}</div>
                    )}

                    {/* Detail list */}
                    <ul className="space-y-2">
                      {step.details.map((detail, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground font-body leading-relaxed">
                          <span className="text-primary/50 mt-1 shrink-0">▸</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Outro */}
        <div className="mt-8 p-6 rounded-2xl bg-card border border-border">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-heading font-bold text-foreground mb-2">
                Alt gjort via samtale
              </p>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Hele denne nettsiden — fra første linje til siste hover-effekt — ble bygget ved å chatte med Lovable.
                Ingen VS Code. Ingen Figma. Bare naturlig språk og en AI som skjønner hva du mener.
              </p>
              <a
                href="https://lovable.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-heading font-bold text-primary hover:underline"
              >
                Prøv Lovable selv →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
