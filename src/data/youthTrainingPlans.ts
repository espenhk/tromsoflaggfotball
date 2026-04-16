import type { WeekPlan } from "./adultTrainingPlans";

const CF = "https://d1gumj4ccylcw8.cloudfront.net";
const DB = "https://amerikanskeidretter.brik.no/folder/amerikansk_fotball/flaggfotball/flaggfotball_ovelser";

const V = {
  partnerPass:  `${CF}/19c98ddb-5d9c-4a6b-9119-0ecbae93cae4_1625332826969-222s5n`,
  boxDrill:     `${CF}/fb78f4fa-f45d-4b55-bcb9-fc6ea07a1b18_1625332826969-222s5n`,
  rainMakers:   `${CF}/b254b41a-3814-4a67-acc9-add1e72865dc_1625332826969-222s5n`,
  runningLanes: `${CF}/09b65171-0b98-4d2f-b89f-96028a638020_1625332826969-222s5n`,
  catchLMH:     `${CF}/7c683b1d-de10-43b3-9aeb-aa741f681df8_1625332826969-222s5n`,
};

export interface YouthAgeGroup {
  id: string;
  label: string;
  ageRange: string;
  sessionDuration: string;
  description: string;
  weeks: WeekPlan[];
}

// ═══════════════════════════════════════════════════════════
// 8–10 ÅR — 45 min økter, 1 øvelse + Quick3 kamper
// ═══════════════════════════════════════════════════════════
const plan8to10: YouthAgeGroup = {
  id: "8-10",
  label: "8–10 år",
  ageRange: "8–10",
  sessionDuration: "45 min",
  description: "Korte, lekpregede økter med én øvelse og mye spilltid. Perfekt for nybegynnere.",
  weeks: [
    {
      week: 1,
      title: "Kast og mottak",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "45 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Partner Pass",
          duration: "5 min",
          videoUrl: V.partnerPass,
          drillBankUrl: DB,
          description: "Spillerne står parvis og kaster ballen frem og tilbake. Fokus på grep og kasteteknikk.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag og kort gjennomgang av Quick3-regler." },
      scrimmage: { duration: "30 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 2,
      title: "Bevegelse og mottak",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "45 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Box Drill",
          duration: "5 min",
          videoUrl: V.boxDrill,
          drillBankUrl: DB,
          description: "Spillerne løper ruter i en firkant og øver på mottak i bevegelse.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag og kort gjennomgang av regler." },
      scrimmage: { duration: "30 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 3,
      title: "Lange kast",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "45 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Rain Makers",
          duration: "5 min",
          videoUrl: V.rainMakers,
          drillBankUrl: DB,
          description: "Øv på lange, høye kast – «regnmakere». Mottaker trener på å fange ballen over hodet.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag og kort gjennomgang av regler." },
      scrimmage: { duration: "30 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 4,
      title: "Løp med ball",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "45 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Running Lanes",
          duration: "5 min",
          videoUrl: V.runningLanes,
          drillBankUrl: DB,
          description: "Løp gjennom kjegle-korridorer med ball. Fokus på fart, retningsendring og ballsikkerhet.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag og kort gjennomgang av regler." },
      scrimmage: { duration: "30 min", description: "Quick3 kamper / turnering." },
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// 11–13 ÅR — 60 min økter, 2 øvelser + Quick3 kamper
// ═══════════════════════════════════════════════════════════
const plan11to13: YouthAgeGroup = {
  id: "11-13",
  label: "11–13 år",
  ageRange: "11–13",
  sessionDuration: "60 min",
  description: "Litt lengre økter med to øvelser for å bygge grunnleggende ferdigheter før spilltid.",
  weeks: [
    {
      week: 1,
      title: "Kast og bevegelse",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "60 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Partner Pass",
          duration: "5 min",
          videoUrl: V.partnerPass,
          drillBankUrl: DB,
          description: "Spillerne står parvis og kaster ballen frem og tilbake. Fokus på grep og kasteteknikk.",
        },
        {
          name: "Box Drill",
          duration: "5 min",
          videoUrl: V.boxDrill,
          drillBankUrl: DB,
          description: "Spillerne løper ruter i en firkant og øver på mottak i bevegelse.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag og kort gjennomgang av Quick3-regler." },
      scrimmage: { duration: "40 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 2,
      title: "Kast og lange baller",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "60 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Partner Pass",
          duration: "5 min",
          videoUrl: V.partnerPass,
          drillBankUrl: DB,
          description: "Spillerne står parvis og kaster ballen frem og tilbake. Fokus på grep og kasteteknikk.",
        },
        {
          name: "Rain Makers",
          duration: "5 min",
          videoUrl: V.rainMakers,
          drillBankUrl: DB,
          description: "Øv på lange, høye kast – «regnmakere». Mottaker trener på å fange ballen over hodet.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag og kort gjennomgang av regler." },
      scrimmage: { duration: "40 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 3,
      title: "Mottak og bevegelse",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "60 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Catching Low-Medium-High",
          duration: "5 min",
          videoUrl: V.catchLMH,
          drillBankUrl: DB,
          description: "Øv på å fange baller i ulike høyder: lav, middels og høy. Trener reaksjon og håndferdighet.",
        },
        {
          name: "Box Drill",
          duration: "5 min",
          videoUrl: V.boxDrill,
          drillBankUrl: DB,
          description: "Spillerne løper ruter i en firkant og øver på mottak i bevegelse.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag." },
      scrimmage: { duration: "40 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 4,
      title: "Kast og løp",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "60 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Rain Makers",
          duration: "5 min",
          videoUrl: V.rainMakers,
          drillBankUrl: DB,
          description: "Øv på lange, høye kast – «regnmakere». Mottaker trener på å fange ballen over hodet.",
        },
        {
          name: "Running Lanes",
          duration: "5 min",
          videoUrl: V.runningLanes,
          drillBankUrl: DB,
          description: "Løp gjennom kjegle-korridorer med ball. Fokus på fart, retningsendring og ballsikkerhet.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag." },
      scrimmage: { duration: "40 min", description: "Quick3 kamper / turnering." },
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// 14–16 ÅR — 90 min økter, 2 øvelser (lengre) + Quick3 kamper
// ═══════════════════════════════════════════════════════════
const plan14to16: YouthAgeGroup = {
  id: "14-16",
  label: "14–16 år",
  ageRange: "14–16",
  sessionDuration: "90 min",
  description: "Lengre økter med grundigere øvelser og lang spilltid. For spillere som vil ta neste steg.",
  weeks: [
    {
      week: 1,
      title: "Grunnleggende kast og mottak",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "90 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Partner Pass",
          duration: "5 min",
          videoUrl: V.partnerPass,
          drillBankUrl: DB,
          description: "Spillerne står parvis og kaster ballen frem og tilbake. Fokus på grep og kasteteknikk.",
        },
        {
          name: "Box Drill",
          duration: "10 min",
          videoUrl: V.boxDrill,
          drillBankUrl: DB,
          description: "Spillerne løper ruter i en firkant og øver på mottak i bevegelse. Lengre varighet for å jobbe med presisjon.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag og kort gjennomgang av Quick3-regler." },
      scrimmage: { duration: "60 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 2,
      title: "Kast og lange baller",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "90 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Partner Pass",
          duration: "5 min",
          videoUrl: V.partnerPass,
          drillBankUrl: DB,
          description: "Spillerne står parvis og kaster ballen frem og tilbake. Fokus på grep og kasteteknikk.",
        },
        {
          name: "Rain Makers",
          duration: "10 min",
          videoUrl: V.rainMakers,
          drillBankUrl: DB,
          description: "Øv på lange, høye kast – «regnmakere». Mottaker trener på å fange ballen over hodet.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag og kort gjennomgang av regler." },
      scrimmage: { duration: "60 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 3,
      title: "Mottak og teknikk",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "90 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Catching Low-Medium-High",
          duration: "5 min",
          videoUrl: V.catchLMH,
          drillBankUrl: DB,
          description: "Øv på å fange baller i ulike høyder: lav, middels og høy. Trener reaksjon og håndferdighet.",
        },
        {
          name: "Box Drill",
          duration: "10 min",
          videoUrl: V.boxDrill,
          drillBankUrl: DB,
          description: "Spillerne løper ruter i en firkant og øver på mottak i bevegelse.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag." },
      scrimmage: { duration: "60 min", description: "Quick3 kamper / turnering." },
    },
    {
      week: 4,
      title: "Kast og løp",
      equipment: ["Kjegler", "Flaggsett", "Baller"],
      totalDuration: "90 min",
      warmup: { duration: "0 min", description: "" },
      drills: [
        {
          name: "Rain Makers",
          duration: "5 min",
          videoUrl: V.rainMakers,
          drillBankUrl: DB,
          description: "Øv på lange, høye kast – «regnmakere». Mottaker trener på å fange ballen over hodet.",
        },
        {
          name: "Running Lanes",
          duration: "10 min",
          videoUrl: V.runningLanes,
          drillBankUrl: DB,
          description: "Løp gjennom kjegle-korridorer med ball. Fokus på fart, retningsendring og ballsikkerhet.",
        },
      ],
      walkthrough: { duration: "5 min", description: "Oppdeling av lag." },
      scrimmage: { duration: "60 min", description: "Quick3 kamper / turnering." },
    },
  ],
};

export const youthTrainingPlans: YouthAgeGroup[] = [plan8to10, plan11to13, plan14to16];
