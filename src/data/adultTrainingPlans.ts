export interface Drill {
  name: string;
  duration: string;
  videoUrl?: string;
  drillBankUrl?: string;
  description: string;
  progression?: string;
}

export interface WeekPlan {
  week: number;
  title: string;
  equipment: string[];
  totalDuration: string;
  warmup: { duration: string; description: string };
  drills: Drill[];
  walkthrough: { duration: string; description: string };
  scrimmage: { duration: string; description: string };
}

export interface PhasePlan {
  id: string;
  phase: number;
  label: string;
  title: string;
  description: string;
  weeks: WeekPlan[];
}

const DB = "https://amerikanskeidretter.brik.no/folder/amerikansk_fotball/flaggfotball/flaggfotball_ovelser";
const CF = "https://d1gumj4ccylcw8.cloudfront.net";

const V = {
  partnerPass:  `${CF}/19c98ddb-5d9c-4a6b-9119-0ecbae93cae4_1625332826969-222s5n`,
  boxDrill:     `${CF}/fb78f4fa-f45d-4b55-bcb9-fc6ea07a1b18_1625332826969-222s5n`,
  rainMakers:   `${CF}/b254b41a-3814-4a67-acc9-add1e72865dc_1625332826969-222s5n`,
  runningLanes: `${CF}/09b65171-0b98-4d2f-b89f-96028a638020_1625332826969-222s5n`,
  catchLMH:     `${CF}/7c683b1d-de10-43b3-9aeb-aa741f681df8_1625332826969-222s5n`,
  gauntlet:     `${CF}/1cd6da3a-86dc-4e1c-8cc6-faa39baa1094_1625332826969-222s5n`,
  theDrop:      `${CF}/e44de3f4-3935-47bc-a6b8-c818b2630b1c_1625332826969-222s5n`,
  handoff:      `${CF}/8b99ab50-cfad-4aef-83aa-a0acc9b8b8e2_1625332826969-222s5n`,
  defense:      `${CF}/d6568772-00d2-4cbd-87f2-ef6fccf49f0d_1625332826969-222s5n`,
};

const WARMUP_TEXT = "Fullkropps dynamisk oppvarming: lett jogging, dynamiske tøyninger, armrotasjoner og bevegelsesmønstre som forbereder kroppen på trening.";

export const adultTrainingPlans: PhasePlan[] = [
  // ═══════════════════════════════════════════════════════════
  // FASE 1 – Grunnleggende
  // ═══════════════════════════════════════════════════════════
  {
    id: "phase-1",
    phase: 1,
    label: "Fase 1",
    title: "Grunnleggende",
    description: "Introduksjon til flaggfotball. Grunnleggende kastteknikk, mottak, flaggtrekking og spillregler. Kjerneøvelser etableres her og gjentas gjennom hele programmet.",
    weeks: [
      {
        week: 1,
        title: "Første berøring",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "To og to – kast og mottak på 5-7 meters avstand. Fokus på grep, spiral og å peke med fremre skulder mot mottaker.",
          },
          {
            name: "Box Drill",
            duration: "10 min",
            videoUrl: V.boxDrill,
            drillBankUrl: `${DB}/2_smidighet?v=7009`,
            description: "Smidighetsløype i firkant med kjegler. Sprint fremover, sidelengs shuffle, baklengs, og sprint igjen. Rotér retning halvveis.",
          },
          {
            name: "The Tollbooth (flaggtrekking)",
            duration: "10 min",
            videoUrl: V.gauntlet,
            drillBankUrl: `${DB}/3_%22flag_pulling%22?v=6048`,
            description: "Forsvarsspillere står i en rekke som en 'bom'. Angripere løper gjennom én om gangen. Forsvar øver på å trekke flagg med riktig håndplassering.",
          },
        ],
        walkthrough: { duration: "25 min", description: "Gjennomgang av grunnregler: ned-system (4 forsøk), hvordan poeng scores, og flaggets rolle. Vis posisjoner på banen." },
        scrimmage: { duration: "25 min", description: "Fri scrimmage. Treneren stopper spillet for å forklare situasjoner når det trengs." },
      },
      {
        week: 2,
        title: "Kast og mottak",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "To og to – kast og mottak. Samme øvelse som uke 1, men nå med mer fokus på spiral.",
            progression: "Øk avstand til 8-10 meter. Mottaker skal ta imot med hendene (ikke kroppen).",
          },
          {
            name: "Box Drill",
            duration: "10 min",
            videoUrl: V.boxDrill,
            drillBankUrl: `${DB}/2_smidighet?v=7009`,
            description: "Smidighetsøvelse i firkantmønster med retningsskifter.",
            progression: "Legg til ball: spilleren bærer ballen i den ene hånden gjennom løypen.",
          },
          {
            name: "Catching Low-Medium-High",
            duration: "10 min",
            videoUrl: V.catchLMH,
            drillBankUrl: `${DB}/5_kast?v=6962`,
            description: "Ny øvelse: Mottaksøvelse på tre nivåer – lavt (knehøyde), medium (bryst), høyt (over hodet). Kasteren varierer bevisst.",
          },
        ],
        walkthrough: { duration: "20 min", description: "Grunnleggende offensive formasjoner. Vis hvor QB, center og mottakere stiller seg. Introduser snap." },
        scrimmage: { duration: "30 min", description: "Fri scrimmage. Spillerne prøver å bruke formasjonene fra walkthrough." },
      },
      {
        week: 3,
        title: "Bevegelse og unnamanøver",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "Kast og mottak parvis – bygger videre fra uke 1-2.",
            progression: "Kast i bevegelse: begge spillerne jogger sidelengs mens de kaster. Fokus på å lede mottakeren.",
          },
          {
            name: "Box Drill",
            duration: "10 min",
            videoUrl: V.boxDrill,
            drillBankUrl: `${DB}/2_smidighet?v=7009`,
            description: "Smidighetsøvelse med retningsskifter.",
            progression: "Legg til en forsvarsspiller i midten som prøver å trekke flagg. Angriperen må unngå mens de fullfører løypen.",
          },
          {
            name: "The Gauntlet (flaggtrekking)",
            duration: "10 min",
            videoUrl: V.gauntlet,
            drillBankUrl: `${DB}/3_%22flag_pulling%22?v=6832`,
            description: "Ny øvelse: Angriperen løper gjennom en rekke med 3-4 forsvarsspillere som prøver å trekke flagget. Øver på unnvikelse og raske retningsskifter under press.",
          },
        ],
        walkthrough: { duration: "15 min", description: "Defensiv oppstilling. Vis mann-mot-mann vs. enkel sonedekning. Hvem dekker hvem?" },
        scrimmage: { duration: "35 min", description: "Fri scrimmage. Forsvaret prøver å bruke det de lærte om oppstilling." },
      },
      {
        week: 4,
        title: "Fase 1 – oppsummering",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "Kast og mottak – siste progresjon i denne fasen.",
            progression: "Legg til en passiv forsvarer: mottaker må bevege seg bort fra forsvarsspilleren før de tar imot.",
          },
          {
            name: "Running Lanes",
            duration: "10 min",
            videoUrl: V.runningLanes,
            drillBankUrl: `${DB}/2_smidighet?v=7045`,
            description: "Ny øvelse: Løpeøvelse der spillerne øver på å følge bestemte baner med retningsskifter og fart. Simulerer løperuter.",
          },
          {
            name: "Rain Makers",
            duration: "10 min",
            videoUrl: V.rainMakers,
            drillBankUrl: `${DB}/5_kast?v=6852`,
            description: "Ny øvelse: Dype kast med bue. Kasteren øver på å legge ballen over forsvareren. Mottaker posisjonerer seg under ballen.",
          },
        ],
        walkthrough: { duration: "10 min", description: "Signaler og kommunikasjon. Hvordan kalle et play i huddle, snap-count, og audibles. Oppsummering av fase 1." },
        scrimmage: { duration: "40 min", description: "Fri scrimmage. Bruk alt fra de fire første ukene." },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // FASE 2 – Angrepsspill
  // ═══════════════════════════════════════════════════════════
  {
    id: "phase-2",
    phase: 2,
    label: "Fase 2",
    title: "Angrepsspill",
    description: "Snaps, hand-offs, pasningsruter og angrepsspill. Kjerneøvelser fra fase 1 vedlikeholdes mens nye angrepselementer introduseres.",
    weeks: [
      {
        week: 5,
        title: "Snap og kast",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "The Drop (snapping)",
            duration: "10 min",
            videoUrl: V.theDrop,
            drillBankUrl: `${DB}/4_snapps?v=7082`,
            description: "Ny øvelse: Center snap. Spillerne øver på å snappe ballen bakover til QB med riktig teknikk. Roter roller.",
          },
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "Kast og mottak – vedlikeholdsøvelse.",
            progression: "Kombiner med snap: center snapper → QB mottar → kaster til mottaker. Tre-mannskjede.",
          },
          {
            name: "Box Drill",
            duration: "10 min",
            videoUrl: V.boxDrill,
            drillBankUrl: `${DB}/2_smidighet?v=7009`,
            description: "Smidighetsøvelse – vedlikehold.",
            progression: "Øk tempo. Tidtaking – hvem klarer løypen raskest med ball?",
          },
        ],
        walkthrough: { duration: "35 min", description: "Snap-til-kast-sekvensen. Fotarbeid for QB etter snap. Timing mellom snap og rute." },
        scrimmage: { duration: "15 min", description: "Fri scrimmage. Alle lag skal snappe ballen skikkelig." },
      },
      {
        week: 6,
        title: "Hand-off og løpespill",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "The Drop (snapping)",
            duration: "10 min",
            videoUrl: V.theDrop,
            drillBankUrl: `${DB}/4_snapps?v=7082`,
            description: "Center snap – repetisjon fra uke 5.",
            progression: "Raskere tempo. QB tar 3-stegs drop etter snap.",
          },
          {
            name: "The Handoff",
            duration: "10 min",
            videoUrl: V.handoff,
            drillBankUrl: `${DB}/6_lopespillhand_off?v=6985`,
            description: "Ny øvelse: Hand-off mellom QB og running back. Fokus på timing, ballsikring og riktige vinkler inn mot QB.",
          },
          {
            name: "Running Lanes",
            duration: "10 min",
            videoUrl: V.runningLanes,
            drillBankUrl: `${DB}/2_smidighet?v=7045`,
            description: "Løpeøvelse – repetisjon fra uke 4.",
            progression: "Kombiner med hand-off: QB snapper, gir hand-off, RB løper i bestemt bane.",
          },
        ],
        walkthrough: { duration: "25 min", description: "Løpespill: når brukes hand-off vs. pass? Vis 2-3 enkle løpespill lagene kan bruke." },
        scrimmage: { duration: "25 min", description: "Fri scrimmage. Oppfordre lagene til å prøve hand-offs i spillet." },
      },
      {
        week: 7,
        title: "Pasningsruter",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "Rain Makers",
            duration: "10 min",
            videoUrl: V.rainMakers,
            drillBankUrl: `${DB}/5_kast?v=6852`,
            description: "Dype kast – repetisjon fra uke 4.",
            progression: "Mottaker løper en 'go'-rute (rett frem). QB øver på timing – ballen skal lande foran mottaker.",
          },
          {
            name: "The Drop (snapping)",
            duration: "10 min",
            videoUrl: V.theDrop,
            drillBankUrl: `${DB}/4_snapps?v=7082`,
            description: "Center snap – vedlikehold.",
            progression: "Full sekvens: snap → drop → les forsvar → kast. Automatisering.",
          },
          {
            name: "Catching Low-Medium-High",
            duration: "10 min",
            videoUrl: V.catchLMH,
            drillBankUrl: `${DB}/5_kast?v=6962`,
            description: "Mottaksøvelse – repetisjon fra uke 2.",
            progression: "Mottaker løper en kort rute (slant/hitch) før de tar imot. Ikke stående stille lenger.",
          },
          {
            name: "Handoff Relay",
            duration: "10 min",
            videoUrl: V.handoff,
            drillBankUrl: `${DB}/6_lopespillhand_off?v=6983`,
            description: "Ny øvelse: Lagstafett med hand-offs. Raskeste lag vinner. Bygger hand-off-automatikk under press.",
          },
        ],
        walkthrough: { duration: "20 min", description: "Tre grunnruter: slant, hitch og go. Tegn dem opp og la spillerne gå gjennom dem uten ball først." },
        scrimmage: { duration: "20 min", description: "Fri scrimmage." },
      },
      {
        week: 8,
        title: "Fase 2 – oppsummering",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "Snap, Toss, and Tuck",
            duration: "10 min",
            videoUrl: V.handoff,
            drillBankUrl: `${DB}/6_lopespillhand_off?v=6984`,
            description: "Ny øvelse: Komplett sekvens – snap → mottak → toss til RB → RB sikrer ballen og løper. Alle posisjoner øver.",
          },
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "Kast og mottak – vedlikehold.",
            progression: "Med aktiv forsvarer: mottaker må skape separasjon med en rute før de tar imot.",
          },
          {
            name: "The Handoff",
            duration: "10 min",
            videoUrl: V.handoff,
            drillBankUrl: `${DB}/6_lopespillhand_off?v=6985`,
            description: "Hand-off – repetisjon fra uke 6.",
            progression: "Legg til en forsvarsspiller/rusher. QB må lese: hand-off eller kast?",
          },
        ],
        walkthrough: { duration: "10 min", description: "Play-calling: hvert lag lager 3 plays (2 pass, 1 løp) de kan kalle i huddle. Øv på å kalle og gjennomføre." },
        scrimmage: { duration: "40 min", description: "Fri scrimmage. Lagene bruker sine egne plays." },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // FASE 3 – Forsvarsspill
  // ═══════════════════════════════════════════════════════════
  {
    id: "phase-3",
    phase: 3,
    label: "Fase 3",
    title: "Forsvarsspill",
    description: "Fokus på forsvarsteknikk: flaggtrekking under press, mann-mot-mann-dekning, sonedekning og kommunikasjon. Angrepsteknikk vedlikeholdes.",
    weeks: [
      {
        week: 9,
        title: "Mann-mot-mann",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "The Chase (flaggtrekking)",
            duration: "10 min",
            videoUrl: V.gauntlet,
            drillBankUrl: `${DB}/3_%22flag_pulling%22?v=6831`,
            description: "Ny øvelse: Én-mot-én flaggjakt. Forsvarsspiller starter 2 meter bak angriperen og jager. Fokus på vinkel og timing for å trekke flagg i full fart.",
          },
          {
            name: "Happy Trails (forsvar)",
            duration: "10 min",
            videoUrl: V.defense,
            drillBankUrl: `${DB}/8_defense_ovelser?v=7133`,
            description: "Ny øvelse: Forsvarsspillere øver på å følge ('trail') mottakere tett i mann-mot-mann. Speil mottakerens bevegelser uten å se på ballen.",
          },
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "Kast og mottak – vedlikehold av angrepsteknikk.",
            progression: "Full rute: mottaker løper slant/hitch fra forrige fase, kaster og mottaker i kampliknende tempo.",
          },
        ],
        walkthrough: { duration: "35 min", description: "Mann-mot-mann-dekning i praksis: hvem dekker hvem, posisjonering, og hvordan kommunisere tilordning." },
        scrimmage: { duration: "15 min", description: "Fri scrimmage. Fokus på at forsvarsspillerne prøver mann-mot-mann." },
      },
      {
        week: 10,
        title: "Sonedekning",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "The Chase (flaggtrekking)",
            duration: "10 min",
            videoUrl: V.gauntlet,
            drillBankUrl: `${DB}/3_%22flag_pulling%22?v=6831`,
            description: "Flaggjakt – repetisjon fra uke 9.",
            progression: "Angriperen får nå ball og prøver å score. Forsvareren må trekke flagg FØR scoringslinja.",
          },
          {
            name: "Zone Pass Defend",
            duration: "10 min",
            videoUrl: V.defense,
            drillBankUrl: `${DB}/8_defense_ovelser?v=7136`,
            description: "Ny øvelse: Forsvarsspillere øver på sonedekning – hold øyekontakt med QB, les kastretning, og reager. Dekk område, ikke spiller.",
          },
          {
            name: "Box Drill",
            duration: "10 min",
            videoUrl: V.boxDrill,
            drillBankUrl: `${DB}/2_smidighet?v=7009`,
            description: "Smidighetsøvelse – vedlikehold.",
            progression: "Reaksjonsvariant: trener peker retning, spilleren reagerer og skifter. Simulerer lesing av spill.",
          },
        ],
        walkthrough: { duration: "25 min", description: "Sonedekning: del banen i soner. Vis forskjellen på mann-mot-mann og sone. Når brukes hva?" },
        scrimmage: { duration: "25 min", description: "Fri scrimmage. Forsvarene prøver sonedekning." },
      },
      {
        week: 11,
        title: "Press og avbrudd",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "The Break Up (forsvar)",
            duration: "10 min",
            videoUrl: V.defense,
            drillBankUrl: `${DB}/8_defense_ovelser?v=7170`,
            description: "Ny øvelse: Forsvarsspillere øver på å slå ballen ned. Timing og posisjonering for å bryte opp pasninger uten å rive flagg for tidlig.",
          },
          {
            name: "Defensive Duos",
            duration: "10 min",
            videoUrl: V.defense,
            drillBankUrl: `${DB}/8_defense_ovelser?v=7132`,
            description: "Ny øvelse: To forsvarsspillere samarbeider om dekning. Øver på å bytte ansvar og hjelpe hverandre.",
          },
          {
            name: "Happy Trails (forsvar)",
            duration: "10 min",
            videoUrl: V.defense,
            drillBankUrl: `${DB}/8_defense_ovelser?v=7133`,
            description: "Trail-dekning – repetisjon fra uke 9.",
            progression: "Mottakeren løper nå fulle ruter (slant, hitch, go). Forsvareren må lese ruten og reagere.",
          },
        ],
        walkthrough: { duration: "15 min", description: "Rusher-rollen: når og hvordan rushe QB. Telletid (7-sekunder). Vinkler og timing." },
        scrimmage: { duration: "35 min", description: "Fri scrimmage. En spiller per lag prøver rusher-rollen." },
      },
      {
        week: 12,
        title: "Fase 3 – oppsummering",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "The Chase (flaggtrekking)",
            duration: "10 min",
            videoUrl: V.gauntlet,
            drillBankUrl: `${DB}/3_%22flag_pulling%22?v=6831`,
            description: "Flaggjakt – siste progresjon.",
            progression: "Angriperen velger selv retning og har full frihet. Forsvareren må lese og reagere, ikke bare jage.",
          },
          {
            name: "Zone Pass Defend",
            duration: "10 min",
            videoUrl: V.defense,
            drillBankUrl: `${DB}/8_defense_ovelser?v=7136`,
            description: "Sonedekning – repetisjon fra uke 10.",
            progression: "Legg til en ekstra mottaker. Forsvarerne må kommunisere hvem som dekker hvem i sonen.",
          },
          {
            name: "Rain Makers",
            duration: "10 min",
            videoUrl: V.rainMakers,
            drillBankUrl: `${DB}/5_kast?v=6852`,
            description: "Dype kast – vedlikehold av angrepsteknikk.",
            progression: "Med forsvarer: kan QB legge ballen over forsvareren og treffe mottakeren? Les dekningen.",
          },
        ],
        walkthrough: { duration: "10 min", description: "Forsvarsformasjoner: oppsummering av mann, sone, og rush. Hvert lag velger en primær forsvarsform." },
        scrimmage: { duration: "40 min", description: "Fri scrimmage. Forsvarene bruker sine valgte formasjoner." },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // FASE 4 – Helhet og strategi
  // ═══════════════════════════════════════════════════════════
  {
    id: "phase-4",
    phase: 4,
    label: "Fase 4",
    title: "Helhet og strategi",
    description: "Alt settes sammen. Spillsystemer på begge sider av ballen, kampforberedelse og evaluering. Kortere øvelsesdel, lengre spilltid.",
    weeks: [
      {
        week: 13,
        title: "Angrepssystem",
        equipment: ["Kjegler", "Flaggsett", "Baller", "Whiteboard"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "The Drop (snapping)",
            duration: "10 min",
            videoUrl: V.theDrop,
            drillBankUrl: `${DB}/4_snapps?v=7082`,
            description: "Center snap – vedlikehold.",
            progression: "Kampfart. Snap → QB drop → les forsvar → kast/hand-off. Fullstendig pre-snap-rutine.",
          },
          {
            name: "The Handoff + Running Lanes",
            duration: "15 min",
            videoUrl: V.handoff,
            drillBankUrl: `${DB}/6_lopespillhand_off?v=6985`,
            description: "Kombinasjonsøvelse: snap → hand-off → løp i bestemt bane. Eller: snap → play-action (fake hand-off) → kast.",
          },
          {
            name: "Catching Low-Medium-High",
            duration: "10 min",
            videoUrl: V.catchLMH,
            drillBankUrl: `${DB}/5_kast?v=6962`,
            description: "Mottaksøvelse – vedlikehold.",
            progression: "Full rute med forsvarer. Mottaker må skape separasjon, finne åpning, og ta imot under press.",
          },
        ],
        walkthrough: { duration: "25 min", description: "Angrepssystem: hvert lag bygger en playbook med 4-5 plays. Tegn opp, gå gjennom, og øv uten forsvar." },
        scrimmage: { duration: "20 min", description: "Fri scrimmage. Lagene bruker sin playbook." },
      },
      {
        week: 14,
        title: "Forsvarssystem",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "Zone Pass Defend",
            duration: "10 min",
            videoUrl: V.defense,
            drillBankUrl: `${DB}/8_defense_ovelser?v=7136`,
            description: "Sonedekning – repetisjon.",
            progression: "Forsvarerne kommuniserer høyt: 'Jeg har flat!' / 'Dyp er min!' Øv på overganger.",
          },
          {
            name: "The Break Up (forsvar)",
            duration: "10 min",
            videoUrl: V.defense,
            drillBankUrl: `${DB}/8_defense_ovelser?v=7170`,
            description: "Avbrudd av pasninger – repetisjon fra uke 11.",
            progression: "Mot fullt angrepsspill: 3v3 der forsvarerne prøver å stoppe et play fra motstanderens playbook.",
          },
          {
            name: "Partner Pass",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "Kast og mottak – vedlikehold.",
            progression: "Presisjonskast: sett opp mål (ring/kjegle) i ulike høyder. Hvem treffer flest?",
          },
        ],
        walkthrough: { duration: "20 min", description: "Forsvarssystem: hvert lag velger primærdekning (mann/sone) og øver på å sette opp forsvaret raskt mellom plays." },
        scrimmage: { duration: "30 min", description: "Fri scrimmage. Begge lag bruker sine systemer." },
      },
      {
        week: 15,
        title: "Kampforberedelse",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "The Chase (flaggtrekking)",
            duration: "10 min",
            videoUrl: V.gauntlet,
            drillBankUrl: `${DB}/3_%22flag_pulling%22?v=6831`,
            description: "Flaggjakt – vedlikehold av forsvarsteknikk. Full intensitet.",
          },
          {
            name: "Cross the River (flaggtrekking)",
            duration: "10 min",
            videoUrl: V.gauntlet,
            drillBankUrl: `${DB}/3_%22flag_pulling%22?v=6383`,
            description: "Ny øvelse: Flere angripere prøver å krysse et område samtidig. Forsvarerne må prioritere og kommunisere. Kampliknende kaos.",
          },
          {
            name: "Snap, Toss, and Tuck",
            duration: "10 min",
            videoUrl: V.handoff,
            drillBankUrl: `${DB}/6_lopespillhand_off?v=6984`,
            description: "Full angrepsssekvens – vedlikehold.",
            progression: "Kampfart med forsvar. Gjennomkjør plays fra playbooken mot motstand.",
          },
        ],
        walkthrough: { duration: "10 min", description: "Kampformat: gjennomgang av turneringsregler, tidsstyring, og strategi i sluttfasen av kamper." },
        scrimmage: { duration: "40 min", description: "Scrimmage med full regelhåndhevelse og tidtaking." },
      },
      {
        week: 16,
        title: "Sesongavslutning",
        equipment: ["Kjegler", "Flaggsett", "Baller"],
        totalDuration: "90 min",
        warmup: { duration: "10 min", description: WARMUP_TEXT },
        drills: [
          {
            name: "Partner Pass – avstandstest",
            duration: "10 min",
            videoUrl: V.partnerPass,
            drillBankUrl: `${DB}/5_kast?v=6917`,
            description: "Lengste-kast-konkurranse parvis. Start på 10 meter, øk med 2 meter for hver vellykket runde. Hvem holder lengst?",
          },
          {
            name: "Tic Tac Toe (kondisjon)",
            duration: "10 min",
            videoUrl: V.boxDrill,
            drillBankUrl: `${DB}/7_utholdenhet?v=7101`,
            description: "Ny øvelse: Morsom lagkonkurranse – sprint-stafett der lagene prøver å vinne tre-på-rad med kjegler. Kondisjon forkledd som lek.",
          },
          {
            name: "Flag Attack (flaggtrekking)",
            duration: "10 min",
            videoUrl: V.gauntlet,
            drillBankUrl: `${DB}/3_%22flag_pulling%22?v=6046`,
            description: "Ny øvelse: Intens kaosøvelse – alle mot alle med flagg. Siste person med flagg igjen vinner. Energisk avslutning.",
          },
        ],
        walkthrough: { duration: "10 min", description: "Sesongoppsummering: hva har vi lært? Evaluering og tilbakemelding. Hva vil vi jobbe med neste sesong?" },
        scrimmage: { duration: "40 min", description: "Avslutningskamper. Full innsats, feiring etterpå!" },
      },
    ],
  },
];
