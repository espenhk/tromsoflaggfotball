export interface Drill {
  name: string;
  duration: string;
  videoUrl: string;
  drillBankUrl: string;
  description: string;
}

export interface WeekPlan {
  week: number;
  title: string;
  equipment: string[];
  totalDuration: string;
  warmup: string;
  drills: Drill[];
  gameTime: string;
}

export interface PhasePlan {
  id: string;
  phase: number;
  label: string;
  title: string;
  description: string;
  weeks: WeekPlan[];
}

const DRILL_BANK = "https://amerikanskeidretter.brik.no/folder/amerikansk_fotball/flaggfotball/flaggfotball_ovelser";
const CF = "https://d1gumj4ccylcw8.cloudfront.net";

export const adultTrainingPlans: PhasePlan[] = [
  // ─── FASE 1: Grunnleggende ─────────────────────────────────
  {
    id: "phase-1",
    phase: 1,
    label: "Fase 1",
    title: "Grunnleggende",
    description: "Introduksjon til flaggfotball. Fokus på kast, mottak, flaggtrekking og grunnregler. Mye spilltid.",
    weeks: [
      {
        week: 1,
        title: "Intro til flaggfotball",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med dynamisk strekking og lett jogging",
        drills: [
          {
            name: "Partner Pass (Space Settler)",
            duration: "10 min",
            videoUrl: `${CF}/19c98ddb-5d9c-4a6b-9119-0ecbae93cae4_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6917`,
            description: "Spillerne står overfor hverandre og kaster ballen frem og tilbake. Fokus på grep, kastteknikk og spiralkast.",
          },
          {
            name: "The Tollbooth (Flag Pulling)",
            duration: "10 min",
            videoUrl: `${CF}/93f3ea52-39c3-4b3f-bc9e-2d4f5e6a7b8c_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/3_%22flag_pulling%22?v=6048`,
            description: "Forsvarsspillere står i en 'bom' og øver på å trekke flagg fra angripere som løper gjennom. Grunnleggende flaggtrekkingsteknikk.",
          },
        ],
        gameTime: "60 min – Quick3 kamper med rotasjon. Regler gjennomgås underveis.",
      },
      {
        week: 2,
        title: "Kast og mottak",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med baller: kast i bevegelse",
        drills: [
          {
            name: "Rain Makers",
            duration: "10 min",
            videoUrl: `${CF}/b254b41a-3814-4a67-acc9-add1e72865dc_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6852`,
            description: "Kastøvelse med fokus på høye kast og mottak. Spillerne øver på å kaste ballen i en bue og ta den imot over skulderen.",
          },
          {
            name: "Catching Low-Medium-High (Trust Catch)",
            duration: "10 min",
            videoUrl: `${CF}/7c683b1d-de10-43b3-9aeb-aa741f681df8_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6962`,
            description: "Mottaksøvelse på tre nivåer: lav, medium og høy. Spillerne øver på å ta imot ballen i ulike posisjoner.",
          },
        ],
        gameTime: "60 min – Quick3 kamper / turnering",
      },
      {
        week: 3,
        title: "Bevegelse og smidighet",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med smidighetsløyper",
        drills: [
          {
            name: "Box Drill",
            duration: "10 min",
            videoUrl: `${CF}/fb78f4fa-f45d-4b55-bcb9-fc6ea07a1b18_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/2_smidighet?v=7009`,
            description: "Smidighetsøvelse der spillerne løper i et firkantmønster med raske retningsskifter. Fokus på fotarbeid og balanse.",
          },
          {
            name: "The Gauntlet (Flag Pulling)",
            duration: "10 min",
            videoUrl: `${CF}/1cd6da3a-86dc-4e1c-8cc6-faa39baa1094_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/3_%22flag_pulling%22?v=6832`,
            description: "Angriperen løper gjennom en rekke med forsvarsspillere som prøver å trekke flagget. Øver på unnvikelse og flaggtrekking.",
          },
        ],
        gameTime: "60 min – Quick3 kamper / turnering",
      },
      {
        week: 4,
        title: "Oppsummering fase 1",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med partner-øvelser",
        drills: [
          {
            name: "Running Lanes",
            duration: "10 min",
            videoUrl: `${CF}/09b65171-0b98-4d2f-b89f-96028a638020_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/2_smidighet?v=7045`,
            description: "Løpeøvelse der spillerne øver på å løpe i bestemte baner med retningsskifter og fart.",
          },
          {
            name: "Short Pass Relay",
            duration: "10 min",
            videoUrl: `${CF}/19c98ddb-5d9c-4a6b-9119-0ecbae93cae4_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6916`,
            description: "Stafett-øvelse med korte kast i bevegelse. Spillerne kaster og mottar ballen mens de beveger seg fremover.",
          },
        ],
        gameTime: "60 min – Quick3 turnering med poengsum over flere kamper",
      },
    ],
  },

  // ─── FASE 2: Angrep ────────────────────────────────────────
  {
    id: "phase-2",
    phase: 2,
    label: "Fase 2",
    title: "Angrepsspill",
    description: "Bygger videre med snaps, løperuter, hand-offs og grunnleggende spillforståelse på angrep.",
    weeks: [
      {
        week: 5,
        title: "Snaps og grunnruter",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med kast og mottak i bevegelse",
        drills: [
          {
            name: "The Drop (Snapping Drill)",
            duration: "10 min",
            videoUrl: `${CF}/e44de3f4-3935-47bc-a6b8-c818b2630b1c_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/4_snapps?v=7082`,
            description: "Øvelse i center snap. Spillerne øver på å snappe ballen bakover til quarterback med riktig teknikk.",
          },
          {
            name: "Partner Pass (Space Settler)",
            duration: "10 min",
            videoUrl: `${CF}/19c98ddb-5d9c-4a6b-9119-0ecbae93cae4_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6917`,
            description: "Kast og mottak med fokus på timing og presisjon. Øk avstanden gradvis.",
          },
          {
            name: "Tick Tock Passing",
            duration: "10 min",
            videoUrl: `${CF}/7c683b1d-de10-43b3-9aeb-aa741f681df8_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6961`,
            description: "Kastteknikk-øvelse med fokus på rask arm og presis levering. Spillerne roterer mellom kast og mottak.",
          },
        ],
        gameTime: "50 min – Quick3 kamper med fokus på snap-til-kast-sekvenser",
      },
      {
        week: 6,
        title: "Hand-offs og løpespill",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med smidighetsøvelser",
        drills: [
          {
            name: "The Handoff",
            duration: "10 min",
            videoUrl: `${CF}/8b99ab50-cfad-4aef-83aa-a0acc9b8b8e2_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/6_lopespillhand_off?v=6985`,
            description: "Øvelse i hand-off mellom QB og RB. Fokus på timing, ballsikring og riktig vinkler.",
          },
          {
            name: "Handoff Relay",
            duration: "10 min",
            videoUrl: `${CF}/8b99ab50-cfad-4aef-83aa-a0acc9b8b8e2_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/6_lopespillhand_off?v=6983`,
            description: "Stafett-øvelse med hand-offs. Lagene konkurrerer om raskest gjennomføring med riktig teknikk.",
          },
          {
            name: "Box Drill",
            duration: "10 min",
            videoUrl: `${CF}/fb78f4fa-f45d-4b55-bcb9-fc6ea07a1b18_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/2_smidighet?v=7009`,
            description: "Smidighetsøvelse med retningsskifter. Simulerer unnamanøvre etter hand-off.",
          },
        ],
        gameTime: "50 min – Quick3 kamper med hand-off-plays",
      },
      {
        week: 7,
        title: "Løperuter og timing",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med ruteløping",
        drills: [
          {
            name: "Snap Attack (Snapping Drill)",
            duration: "10 min",
            videoUrl: `${CF}/e44de3f4-3935-47bc-a6b8-c818b2630b1c_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/4_snapps?v=7077`,
            description: "Snap-øvelse med tidsmåling. Center snapper og QB mottar under press. Bygger automatisering.",
          },
          {
            name: "Rain Makers",
            duration: "10 min",
            videoUrl: `${CF}/b254b41a-3814-4a67-acc9-add1e72865dc_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6852`,
            description: "Kast med bue og dybde. Mottakere øver på å lese ballbanen og posisjonere seg riktig.",
          },
          {
            name: "Running Lanes",
            duration: "10 min",
            videoUrl: `${CF}/09b65171-0b98-4d2f-b89f-96028a638020_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/2_smidighet?v=7045`,
            description: "Løpeøvelse med fokus på å følge bestemte ruter og lese forsvar.",
          },
        ],
        gameTime: "50 min – Quick3 kamper med styrt angrepsspill",
      },
      {
        week: 8,
        title: "Oppsummering angrep",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med baller",
        drills: [
          {
            name: "Snap, Toss, and Tuck",
            duration: "10 min",
            videoUrl: `${CF}/8b99ab50-cfad-4aef-83aa-a0acc9b8b8e2_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/6_lopespillhand_off?v=6984`,
            description: "Komplett sekvens: snap → mottak → toss til RB → ballsikring. Alle posisjoner øver sammen.",
          },
          {
            name: "Catching Low-Medium-High",
            duration: "10 min",
            videoUrl: `${CF}/7c683b1d-de10-43b3-9aeb-aa741f681df8_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6962`,
            description: "Mottaksøvelse i tre høyder. Fokus på myke hender og riktig kroppsstilling.",
          },
          {
            name: "The Handoff",
            duration: "10 min",
            videoUrl: `${CF}/8b99ab50-cfad-4aef-83aa-a0acc9b8b8e2_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/6_lopespillhand_off?v=6985`,
            description: "Repetisjon av hand-off med høyere tempo. Fokus på rask gjennomføring.",
          },
        ],
        gameTime: "50 min – Quick3 turnering med styrt angrepsspill",
      },
    ],
  },

  // ─── FASE 3: Forsvar ───────────────────────────────────────
  {
    id: "phase-3",
    phase: 3,
    label: "Fase 3",
    title: "Forsvarsspill",
    description: "Fokus på forsvarsteknikk: flaggtrekking, dekning, soner og kommunikasjon.",
    weeks: [
      {
        week: 9,
        title: "Flaggtrekking og dekning",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med sprintøvelser",
        drills: [
          {
            name: "The Chase (Flag Pulling)",
            duration: "10 min",
            videoUrl: `${CF}/1cd6da3a-86dc-4e1c-8cc6-faa39baa1094_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/3_%22flag_pulling%22?v=6831`,
            description: "En-mot-en flaggøvelse. Forsvarsspiller jager angriper bakfra og øver på å trekke flagg i full fart.",
          },
          {
            name: "Happy Trails (Defense)",
            duration: "10 min",
            videoUrl: `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/8_defense_ovelser?v=7133`,
            description: "Forsvarsspillere øver på å følge ('trail') mottakere tett i mann-mot-mann-dekning.",
          },
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: `${CF}/19c98ddb-5d9c-4a6b-9119-0ecbae93cae4_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6917`,
            description: "Vedlikeholdsøvelse kast/mottak for å holde angrepsteknikk varm.",
          },
        ],
        gameTime: "50 min – Quick3 kamper med fokus på forsvarskommunikasjon",
      },
      {
        week: 10,
        title: "Sonedekning",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med lateral bevegelse",
        drills: [
          {
            name: "Zone Pass Defend",
            duration: "10 min",
            videoUrl: `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/8_defense_ovelser?v=7136`,
            description: "Forsvarsspillere øver på sonedekning. Fokus på å lese QB-ens øyne og reagere på kast.",
          },
          {
            name: "Cross the River (Flag Pulling)",
            duration: "10 min",
            videoUrl: `${CF}/1cd6da3a-86dc-4e1c-8cc6-faa39baa1094_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/3_%22flag_pulling%22?v=6383`,
            description: "Angripere prøver å krysse et område mens forsvarsspillere forsøker å trekke flagg. Øver på vinkling og timing.",
          },
          {
            name: "Crazy Corral (Defense)",
            duration: "10 min",
            videoUrl: `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/8_defense_ovelser?v=7163`,
            description: "Forsvarsspillere jobber sammen for å drive angriperen inn i en felle. Kommunikasjon og samarbeid.",
          },
        ],
        gameTime: "50 min – Quick3 kamper med styrt sonedekning",
      },
      {
        week: 11,
        title: "Rush og press",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med akselerasjonsøvelser",
        drills: [
          {
            name: "The Break Up (Defense)",
            duration: "10 min",
            videoUrl: `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/8_defense_ovelser?v=7170`,
            description: "Forsvarsspillere øver på å bryte opp pasninger. Timing og posisjonering for å slå ballen ned.",
          },
          {
            name: "Defensive Duos",
            duration: "10 min",
            videoUrl: `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/8_defense_ovelser?v=7132`,
            description: "To forsvarsspillere samarbeider om dekning. Øver på bytting og hjelp i forsvar.",
          },
          {
            name: "4 Cone Relay (Conditioning)",
            duration: "10 min",
            videoUrl: `${CF}/fb78f4fa-f45d-4b55-bcb9-fc6ea07a1b18_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/7_utholdenhet?v=7087`,
            description: "Kondisjonsstafett med fire kjegler. Bygger utholdenhet og eksplosivitet for forsvarsspill.",
          },
        ],
        gameTime: "50 min – Quick3 kamper med fokus på rusher-rollen",
      },
      {
        week: 12,
        title: "Oppsummering forsvar",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med flaggøvelser",
        drills: [
          {
            name: "The Invisible Defender",
            duration: "10 min",
            videoUrl: `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/8_defense_ovelser?v=7169`,
            description: "Forsvarsspillere øver på å lese angrepets bevegelser og reagere uten å se ballen direkte.",
          },
          {
            name: "The Anchor (Flag Pulling)",
            duration: "10 min",
            videoUrl: `${CF}/1cd6da3a-86dc-4e1c-8cc6-faa39baa1094_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/3_%22flag_pulling%22?v=6101`,
            description: "Forsvarsspiller planter seg og bruker teknikk for å trekke flagg fra angripere som kommer rett mot dem.",
          },
          {
            name: "Rain Makers",
            duration: "10 min",
            videoUrl: `${CF}/b254b41a-3814-4a67-acc9-add1e72865dc_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6852`,
            description: "Vedlikeholdsøvelse kast/mottak. Angrepsteknikk holdes varm parallelt med forsvarsfokus.",
          },
        ],
        gameTime: "50 min – Quick3 turnering med forsvarsfokus",
      },
    ],
  },

  // ─── FASE 4: Helhet og spillforståelse ─────────────────────
  {
    id: "phase-4",
    phase: 4,
    label: "Fase 4",
    title: "Helhet og strategi",
    description: "Alt settes sammen. Spillsystemer, laginndeling, roller og kampforberedelse.",
    weeks: [
      {
        week: 13,
        title: "Spillsystemer – angrep",
        equipment: ["Kjegler", "Flaggsett", "Baller", "Whiteboard/tavle"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med baller og ruter",
        drills: [
          {
            name: "The Drop (Snapping)",
            duration: "10 min",
            videoUrl: `${CF}/e44de3f4-3935-47bc-a6b8-c818b2630b1c_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/4_snapps?v=7082`,
            description: "Snap-øvelse med fokus på konsistens under press. Gjøres i kampliknende tempo.",
          },
          {
            name: "The Handoff + Running Lanes",
            duration: "15 min",
            videoUrl: `${CF}/8b99ab50-cfad-4aef-83aa-a0acc9b8b8e2_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/6_lopespillhand_off?v=6985`,
            description: "Kombinasjonsøvelse: snap → hand-off → løp i bestemt bane. Simulerer angrepsspill med bevegelse.",
          },
        ],
        gameTime: "55 min – Quick3 kamper der hvert lag har 2-3 styrt angrepsspill de bruker",
      },
      {
        week: 14,
        title: "Spillsystemer – forsvar",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Oppvarming med smidighet og sprint",
        drills: [
          {
            name: "Zone Pass Defend",
            duration: "10 min",
            videoUrl: `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/8_defense_ovelser?v=7136`,
            description: "Sonedekning med rotasjon. Spillerne øver på å kommunisere og bytte soner.",
          },
          {
            name: "The Break Up + Chase",
            duration: "15 min",
            videoUrl: `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/8_defense_ovelser?v=7170`,
            description: "Kombinasjonsøvelse: rusher presser QB → forsvar dekker → bryt opp pasning eller trekk flagg.",
          },
        ],
        gameTime: "55 min – Quick3 kamper der lagene organiserer forsvarsformasjoner",
      },
      {
        week: 15,
        title: "Kampforberedelse",
        equipment: ["Kjegler", "Flaggsett", "Baller", "Whiteboard/tavle"],
        totalDuration: "90 min",
        warmup: "10 min – Full oppvarming med alle elementer",
        drills: [
          {
            name: "Scorpions and Spiders (Conditioning)",
            duration: "10 min",
            videoUrl: `${CF}/fb78f4fa-f45d-4b55-bcb9-fc6ea07a1b18_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/7_utholdenhet?v=7096`,
            description: "Kondisjoneringsøvelse med høy intensitet. Bygger utholdenhet og kampkondis.",
          },
          {
            name: "Flag Attack (Flag Pulling)",
            duration: "10 min",
            videoUrl: `${CF}/1cd6da3a-86dc-4e1c-8cc6-faa39baa1094_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/3_%22flag_pulling%22?v=6046`,
            description: "Intens flaggøvelse med flere angripere og forsvarere. Kampliknende tempo og press.",
          },
        ],
        gameTime: "60 min – Full scrimmage med dommere og styrt spillstans for coaching-momenter",
      },
      {
        week: 16,
        title: "Sesongavslutning",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: "10 min – Lett oppvarming og lagsamling",
        drills: [
          {
            name: "Tic Tac Toe (Conditioning)",
            duration: "10 min",
            videoUrl: `${CF}/fb78f4fa-f45d-4b55-bcb9-fc6ea07a1b18_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/7_utholdenhet?v=7101`,
            description: "Morsom konkurranseøvelse der lagene løper stafett for å vinne tre-på-rad med kjegler.",
          },
          {
            name: "Partner Pass – avstandstest",
            duration: "10 min",
            videoUrl: `${CF}/19c98ddb-5d9c-4a6b-9119-0ecbae93cae4_1625332826969-222s5n`,
            drillBankUrl: `${DRILL_BANK}/5_kast?v=6917`,
            description: "Lengste-kast-konkurranse parvis. Hvem kan holde presise kast på lengst avstand?",
          },
        ],
        gameTime: "60 min – Sesongavslutningsturnering! Quick3 med premiering og evaluering.",
      },
    ],
  },
];
