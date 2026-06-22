import type { ReactNode } from "react";
import { Star, Zap, Users, Target, Crosshair, Shield, Eye } from "lucide-react";
import { createElement } from "react";
import type { TranslationKey } from "@/i18n/dictionaries";

// Shared position metadata used by the home page cards.
// The full Posisjoner page keeps a richer schema (intros, skills, images)
// in src/pages/Posisjoner.tsx — keep those in sync with this slug list.
export const positionSlugMap: Record<string, string> = {
  "Quarterback": "quarterback",
  "Running Back": "running-back",
  "Center": "center",
  "Wide Receiver": "wide-receiver",
  "Rusher": "rusher",
  "Defensive Back": "defensive-back",
  "Safety": "safety",
};

export type PositionEntry = {
  name: string;
  abbr: string;
  taglineKey: TranslationKey;
  icon: ReactNode;
  glowBg: string;
  supColor?: string;
  roleKey: TranslationKey;
  traitsKey: TranslationKey;
  nflExamples: string;
};

export const offensePositions: PositionEntry[] = [
  {
    name: "Quarterback",
    abbr: "QB",
    taglineKey: "pos.qb.tagline",
    icon: createElement(Star, { className: "w-5 h-5 text-amber-400" }),
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
    icon: createElement(Zap, { className: "w-5 h-5 text-emerald-400" }),
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
    icon: createElement(Users, { className: "w-5 h-5" }),
    glowBg: "bg-sky-400/10",
    roleKey: "pos.c.role",
    traitsKey: "pos.c.traits",
    nflExamples: "Travis Kelce (TE), Jason Kelce",
  },
  {
    name: "Wide Receiver",
    abbr: "WR",
    taglineKey: "pos.wr.tagline",
    icon: createElement(Target, { className: "w-5 h-5" }),
    glowBg: "bg-sky-400/10",
    roleKey: "pos.wr.role",
    traitsKey: "pos.wr.traits",
    nflExamples: "Tyreek Hill, Ja'Marr Chase, CeeDee Lamb",
  },
];

export const defensePositions: PositionEntry[] = [
  {
    name: "Rusher",
    abbr: "R",
    taglineKey: "pos.r.tagline",
    icon: createElement(Crosshair, { className: "w-5 h-5 text-orange-400" }),
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
    icon: createElement(Shield, { className: "w-5 h-5" }),
    glowBg: "bg-rose-400/10",
    roleKey: "pos.db.role",
    traitsKey: "pos.db.traits",
    nflExamples: "Sauce Gardner, Patrick Surtain II, Jalen Ramsey",
  },
  {
    name: "Safety",
    abbr: "S",
    taglineKey: "pos.s.tagline",
    icon: createElement(Eye, { className: "w-5 h-5" }),
    glowBg: "bg-rose-400/10",
    roleKey: "pos.s.role",
    traitsKey: "pos.s.traits",
    nflExamples: "Kyle Hamilton, Derwin James, Jessie Bates III",
  },
];