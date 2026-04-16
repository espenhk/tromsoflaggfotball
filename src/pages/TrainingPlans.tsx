import { useState } from "react";
import { ChevronDown, Clock, Play, ExternalLink, Package, Timer, ArrowLeft, Dumbbell, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { adultTrainingPlans, type Drill, type WeekPlan, type PhasePlan } from "@/data/adultTrainingPlans";
import { youthTrainingPlans, type YouthAgeGroup } from "@/data/youthTrainingPlans";

/* ── Age-group definitions ─────────────────────────────── */
type AgeGroupOption = {
  id: string;
  label: string;
  description: string;
};

const AGE_GROUPS: AgeGroupOption[] = [
  { id: "8-10", label: "8–10 år", description: "45 min • 1 øvelse + Quick3" },
  { id: "11-13", label: "11–13 år", description: "60 min • 2 øvelser + Quick3" },
  { id: "14-16", label: "14–16 år", description: "90 min • 2 øvelser + Quick3" },
  { id: "voksne", label: "Voksne", description: "90 min • 3-4 øvelser + scrimmage" },
];

/* ── Session Item (unified card for warmup, drills, walkthrough, scrimmage) ── */
interface SessionItem {
  index: number;
  name: string;
  duration: string;
  description: string;
  videoUrl?: string;
  drillBankUrl?: string;
  progression?: string;
}

function buildSessionItems(week: WeekPlan, skipEmptyWarmup = false): SessionItem[] {
  const items: SessionItem[] = [];
  let idx = 0;

  // Warmup as #0 (skip if duration is "0 min" for youth plans)
  if (!skipEmptyWarmup || week.warmup.duration !== "0 min") {
    items.push({
      index: idx++,
      name: "Oppvarming",
      duration: week.warmup.duration,
      description: week.warmup.description,
    });
  }

  // Drills
  for (const drill of week.drills) {
    items.push({
      index: idx++,
      name: drill.name,
      duration: drill.duration,
      description: drill.description,
      videoUrl: drill.videoUrl,
      drillBankUrl: drill.drillBankUrl,
      progression: drill.progression,
    });
  }

  // Walkthrough
  items.push({
    index: idx++,
    name: "Lagdeling / gjennomgang",
    duration: week.walkthrough.duration,
    description: week.walkthrough.description,
  });

  // Scrimmage
  items.push({
    index: idx++,
    name: "Quick3 kamper",
    duration: week.scrimmage.duration,
    description: week.scrimmage.description,
  });

  return items;
}

function buildAdultSessionItems(week: WeekPlan): SessionItem[] {
  const items: SessionItem[] = [];
  let idx = 0;

  items.push({
    index: idx++,
    name: "Oppvarming",
    duration: week.warmup.duration,
    description: week.warmup.description,
  });

  for (const drill of week.drills) {
    items.push({
      index: idx++,
      name: drill.name,
      duration: drill.duration,
      description: drill.description,
      videoUrl: drill.videoUrl,
      drillBankUrl: drill.drillBankUrl,
      progression: drill.progression,
    });
  }

  items.push({
    index: idx++,
    name: "Walkthrough",
    duration: week.walkthrough.duration,
    description: week.walkthrough.description,
  });

  items.push({
    index: idx++,
    name: "Scrimmage",
    duration: week.scrimmage.duration,
    description: week.scrimmage.description,
  });

  return items;
}

const SessionItemCard = ({ item }: { item: SessionItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasVideo = !!item.videoUrl;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm shrink-0">
            {item.index}
          </span>
          <div className="min-w-0">
            <h4 className="font-heading text-base md:text-lg text-foreground">{item.name}</h4>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{item.duration}</span>
              {item.progression && (
                <span className="text-primary text-xs font-medium">● Progresjon</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasVideo && <Play className="w-4 h-4 text-primary" />}
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 space-y-3">
            <p className="text-muted-foreground text-sm">{item.description}</p>
            {item.progression && (
              <div className="rounded-md bg-primary/10 border border-primary/20 px-3 py-2">
                <p className="text-primary text-sm font-medium">📈 Progresjon: {item.progression}</p>
              </div>
            )}
            {hasVideo && isOpen && (
              <div className="aspect-video rounded-md overflow-hidden bg-background">
                <video
                  controls
                  className="w-full h-full"
                  src={item.videoUrl}
                  preload="metadata"
                >
                  Nettleseren din støtter ikke video.
                </video>
              </div>
            )}
            {item.drillBankUrl && (
              <a
                href={item.drillBankUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-primary text-sm hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Se i øvelsesbanken
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Week Card ──────────────────────────────────────────── */
const WeekPlanCard = ({
  weekPlan,
  defaultOpen = false,
  isYouth = false,
}: {
  weekPlan: WeekPlan;
  defaultOpen?: boolean;
  isYouth?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sessionItems = isYouth
    ? buildSessionItems(weekPlan, true)
    : buildAdultSessionItems(weekPlan);

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
          <div className="px-4 md:px-5 pb-4 md:pb-5 space-y-3">
            {sessionItems.map((item) => (
              <SessionItemCard key={item.index} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Phase Selector (adults only) ──────────────────────── */
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

/* ── Age Group Selector ────────────────────────────────── */
const AgeGroupSelector = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
      {AGE_GROUPS.map((group) => (
        <button
          key={group.id}
          onClick={() => onSelect(group.id)}
          className={`rounded-full px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-heading font-medium transition-all duration-300 ${
            selected === group.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
          }`}
        >
          {group.label}
        </button>
      ))}
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────────── */
const TrainingPlans = () => {
  const [ageGroup, setAgeGroup] = useState("voksne");
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const isAdult = ageGroup === "voksne";
  const activePlan = isAdult ? adultTrainingPlans.find((p) => p.id === selectedPhase) : null;
  const activeYouthPlan = !isAdult ? youthTrainingPlans.find((p) => p.id === ageGroup) : null;

  const currentAgeGroupInfo = AGE_GROUPS.find((g) => g.id === ageGroup);

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
            Treningsplaner
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            Quick3-baserte treningsplaner for alle aldersgrupper. Velg aldersgruppe for å se ukeplaner med øvelser og videoer.
          </p>

          {/* Age group selector */}
          <AgeGroupSelector selected={ageGroup} onSelect={(id) => { setAgeGroup(id); setSelectedPhase(null); }} />

          {currentAgeGroupInfo && (
            <p className="text-muted-foreground text-sm mt-4">
              {currentAgeGroupInfo.description}
            </p>
          )}
        </div>
      </section>

      {/* Adult: Phase selector */}
      {isAdult && (
        <>
          <section className="px-4 pb-8">
            <PhaseSelector selectedPhase={selectedPhase} onSelect={setSelectedPhase} />
          </section>

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
        </>
      )}

      {/* Youth: Direct week list */}
      {activeYouthPlan && (
        <section className="px-4 pb-16">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-6 text-center">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {activeYouthPlan.label}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {activeYouthPlan.weeks.length} uker • {activeYouthPlan.sessionDuration} per økt
              </p>
              <p className="text-muted-foreground text-xs mt-2 max-w-lg mx-auto">
                {activeYouthPlan.description}
              </p>
            </div>

            <div className="space-y-4">
              {activeYouthPlan.weeks.map((week) => (
                <WeekPlanCard
                  key={week.week}
                  weekPlan={week}
                  defaultOpen={week.week === 1}
                  isYouth
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
