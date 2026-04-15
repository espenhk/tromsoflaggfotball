import { useState } from "react";
import { ChevronDown, Clock, Play, ExternalLink, Package, Timer, ArrowLeft, Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import { adultTrainingPlans, type Drill, type WeekPlan, type PhasePlan } from "@/data/adultTrainingPlans";

/* ── Drill Card ─────────────────────────────────────────── */
const DrillCard = ({ drill, index }: { drill: Drill; index: number }) => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setShowVideo(!showVideo)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm shrink-0">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h4 className="font-heading text-base md:text-lg text-foreground">{drill.name}</h4>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{drill.duration}</span>
              {drill.progression && (
                <span className="text-primary text-xs font-medium">● Progresjon</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-primary" />
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showVideo ? "rotate-180" : ""}`} />
        </div>
      </button>

      <div className={`grid transition-all duration-300 ${showVideo ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 space-y-3">
            <p className="text-muted-foreground text-sm">{drill.description}</p>
            <div className="aspect-video rounded-md overflow-hidden bg-background">
              {showVideo && (
                <video
                  controls
                  className="w-full h-full"
                  src={drill.videoUrl}
                  preload="metadata"
                >
                  Nettleseren din støtter ikke video.
                </video>
              )}
            </div>
            <a
              href={drill.drillBankUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Se i øvelsesbanken
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Week Card ──────────────────────────────────────────── */
const WeekPlanCard = ({ weekPlan, defaultOpen = false }: { weekPlan: WeekPlan; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-secondary/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <span className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary text-primary-foreground font-heading font-bold text-lg md:text-xl">
            {weekPlan.week}
          </span>
          <div>
            <h3 className="font-heading text-lg md:text-xl text-foreground">
              {weekPlan.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-muted-foreground text-sm mt-1">
              <span className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                {weekPlan.totalDuration}
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                {weekPlan.equipment.join(", ")}
              </span>
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 md:px-5 pb-4 md:pb-5 space-y-4">
            {/* Warmup */}
            <div className="rounded-lg border border-border bg-secondary/20 p-3">
              <p className="text-sm text-muted-foreground italic">
                🏃 {weekPlan.warmup}
              </p>
            </div>

            {/* Drills */}
            <div className="space-y-3">
              <h4 className="font-heading text-sm text-muted-foreground uppercase tracking-wider">
                Øvelser
              </h4>
              {weekPlan.drills.map((drill, i) => (
                <DrillCard key={drill.name + i} drill={drill} index={i} />
              ))}
            </div>

            {/* Game time */}
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-heading text-foreground uppercase text-sm">
                  {weekPlan.gameTime}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mt-1.5">
                Oppdeling av lag &amp; kort gjennomgang av fokusområder før kampstart. Avslutt med opprydding og evaluering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Phase Selector ─────────────────────────────────────── */
const PhaseSelector = ({
  selectedPhase,
  onSelect,
}: {
  selectedPhase: string | null;
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
      {adultTrainingPlans.map((plan) => (
        <button
          key={plan.id}
          onClick={() => onSelect(plan.id)}
          className={`group relative overflow-hidden rounded-lg border-2 p-4 md:p-6 text-center transition-all duration-300 ${
            selectedPhase === plan.id
              ? "border-primary bg-primary/10"
              : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
          }`}
        >
          <div className="font-heading text-3xl md:text-4xl font-bold text-primary mb-1">
            {plan.phase}
          </div>
          <div className="font-heading text-sm md:text-base text-foreground uppercase tracking-wider">
            {plan.title}
          </div>
          <p className="text-muted-foreground text-xs md:text-sm mt-2 leading-relaxed hidden md:block">
            {plan.description}
          </p>
          <div
            className={`absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300 ${
              selectedPhase === plan.id ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────────── */
const TrainingPlans = () => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const activePlan = adultTrainingPlans.find((p) => p.id === selectedPhase);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-10 md:py-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Treningsplaner for{" "}
            <span className="text-primary">voksne</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            16 uker fordelt på 4 faser. 90-minuttersøkter, én gang i uken. Velg fase for å se ukeplanene med øvelser og videoer.
          </p>
        </div>
      </section>

      {/* Phase selector */}
      <section className="px-4 pb-8">
        <PhaseSelector selectedPhase={selectedPhase} onSelect={setSelectedPhase} />
      </section>

      {/* Week plans */}
      {activePlan && (
        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-6 text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Fase {activePlan.phase}: {activePlan.title}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {activePlan.weeks.length} uker • Klikk på en uke for å se øvelsene
              </p>
              <p className="text-muted-foreground text-xs mt-2 max-w-lg mx-auto">
                {activePlan.description}
              </p>
            </div>

            <div className="space-y-4">
              {activePlan.weeks.map((week) => (
                <WeekPlanCard
                  key={week.week}
                  weekPlan={week}
                  defaultOpen={week.week === activePlan.weeks[0].week}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer credit */}
      <div className="py-6 px-4 text-center text-muted-foreground text-sm border-t border-border">
        <p>
          Øvelsesvideoer fra{" "}
          <a
            href="https://amerikanskeidretter.brik.no/folder/amerikansk_fotball/flaggfotball/flaggfotball_ovelser"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Øvelsesbanken
          </a>
          {" "}• Inspirert av{" "}
          <a
            href="https://flaggfotball.no/pages/quick3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Quick3
          </a>
        </p>
      </div>
    </div>
  );
};

export default TrainingPlans;
