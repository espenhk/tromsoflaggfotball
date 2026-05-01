// Flat-key dictionaries for the whole site.
// Keys are namespaced by section/page (nav.*, hero.*, om.*, faq.*, etc.).
// When adding a new visible string, add it here in BOTH languages.

export type Lang = "no" | "en";

const no = {
  // ── Nav ───────────────────────────────────────────────
  "nav.om": "Om sporten",
  "nav.treninger": "Treninger",
  "nav.spillet": "Dette er flaggfotball",
  "nav.coachene": "Coachene",
  "nav.komIGang": "Kom i gang",
  "nav.video": "Video",
  "nav.faq": "FAQ",
  "nav.menu": "Meny",
  "nav.languageLabel": "Språk",

  // ── Hero ──────────────────────────────────────────────
  "hero.title.line1": "TROMSØ",
  "hero.title.line2": "FLAGGFOTBALL",
  "hero.tagline": "Arktisk flaggfotball · 69°N",
  "hero.logoAlt": "Tromsø Flaggfotball logo",

  // ── Om sporten ────────────────────────────────────────
  "om.h": "Hva er flaggfotball?",
  "om.p1.pre": "Flaggfotball er en kontaktfri variant av amerikansk fotball. I stedet for å tackle drar du av et flagg som henger i beltet til motstanderen. Sporten er rask, taktisk og inkluderende — og blir olympisk idrett i LA 2028.",
  "om.p2.pre": "Det spilles ",
  "om.p2.strong": "5 mot 5",
  "om.p2.post": " på en bane som er omtrent 70 × 30 meter. Hvert lag har fire forsøk på å krysse midtlinjen, og deretter fire nye forsøk for å score touchdown.",

  // ── Åpent for alle ────────────────────────────────────
  "open.h": "Åpent for alle",
  "open.p1.pre": "I Norge spilles flaggfotball ofte ",
  "open.p1.strong": "mixed",
  "open.p1.post": " — med spillere av alle kjønn på samme lag. Fart, teknikk og spilleforståelse betyr mer enn fysisk styrke.",
  "open.p2": "I Tromsø trener vi alltid sammen — og det er nettopp det som gjør det gøy. Ingen erfaring nødvendig, bare møt opp.",

  // ── Treninger ─────────────────────────────────────────
  "training.h": "Treninger",
  "training.day": "Dag",
  "training.dayValue": "Mandager",
  "training.time": "Tid",
  "training.timeValue": "20:30 – 22:00",
  "training.place": "Sted",
  "training.placeValue": "Mellomvegen 110",

  // ── Game / Spillet ────────────────────────────────────
  "game.h": "Dette er flaggfotball",
  "game.sub": "Utforsk formasjoner, spilltyper og forsvarstaktikker.",
  "game.offense": "Angrep",
  "game.defense": "Forsvar",
  "game.readMoreAll": "Les mer om alle posisjoner →",

  // ── Position cards (short, on Index) ──────────────────
  "pos.qb.tagline": "Lagets playmaker og leder",
  "pos.qb.role": "Styrer angrepet, leser forsvaret og kaster ballen til mottakerne. Handler om presise kast og rask beslutningstaking.",
  "pos.qb.traits": "God oversikt, presise kast, rask beslutningstaking.",
  "pos.rb.tagline": "Eksplosiv løper med ballen",
  "pos.rb.role": "Tar imot ballen fra QB og løper gjennom forsvaret. Brukes i løpespill og korte pasninger.",
  "pos.rb.traits": "Eksplosiv fart, god balanse, smidighet.",
  "pos.c.tagline": "Starter hvert spill",
  "pos.c.role": "Snapper ballen til QB og går deretter ut som mottaker eller blokkerer rusheren. Limet i laget.",
  "pos.c.traits": "Pålitelig, god kommunikasjon, allsidig.",
  "pos.wr.tagline": "Rask mottaker som fanger ballen",
  "pos.wr.role": "Løper planlagte ruter for å bli fri fra forsvareren og ta imot pasninger fra QB.",
  "pos.wr.traits": "Hurtighet, gode hender, raske vendinger.",
  "pos.r.tagline": "Jager quarterbacken",
  "pos.r.role": "Forsvarets mest aggressive spiller. Starter 7 yards fra ballen og presser QB til å kaste for tidlig.",
  "pos.r.traits": "Eksplosiv fart, timing, aggressivitet.",
  "pos.db.tagline": "Dekker mottakerne tett",
  "pos.db.role": "Speiler motstanderens bevegelser og prøver å hindre pasninger. Ofte i en-mot-en-dueller.",
  "pos.db.traits": "Rask reaksjon, god fotarbeid, mental styrke.",
  "pos.s.tagline": "Siste skanse bakfra",
  "pos.s.role": "Forsvarets siste linje med best oversikt. Leser spillet og sikrer mot lange pasninger.",
  "pos.s.traits": "God spilleforståelse, oversikt, allsidighet.",
  "pos.card.fits": "Passer for:",
  "pos.card.readMorePrefix": "Les mer om",

  // ── Coachene ──────────────────────────────────────────
  "coaches.h": "Coachene",
  "coaches.headTitle": "Head Coach",
  "coaches.assistantTitle": "Assistentcoach",
  "coaches.head.bio": "Espen har fire sesonger som spiller i Vålerenga Trolls (amerikansk fotball) bak seg, der han spilte quarterback, wide receiver og linebacker. Etter spillerkarrieren gikk han over til trenerbenken — tre år som coach for seniorer, U13 og damelag, med spesialfelt som QB-coach. Tok NM-bronse i flaggfotball i 2025.",
  "coaches.assistant.bio": "Martin er en av de sentrale figurene fra Tromsø Trailblazers og har spilt flaggfotball i 3–4 år — på alle posisjoner. Til daglig jobber han som lærer, noe som gjør ham til en naturlig pedagog på banen. Flink til å bryte ned spillet og gjøre det forståelig for alle, uansett nivå.",

  // ── Kom i gang ────────────────────────────────────────
  "links.h": "Kom i gang",
  "links.fb.title": "Facebook",
  "links.fb.desc": "Lik siden vår for aktuell info om treninger.",
  "links.ig.title": "Instagram",
  "links.ig.desc": "Bilder og videoer fra trening og kamper.",
  "links.flag.title": "Flaggfotball.no",
  "links.flag.desc": "Lær mer om sporten, regler og turneringer i Norge.",
  "links.member.title": "Bli medlem",
  "links.member.desc": "Meld deg inn i Amerikanske Idretters klubb via Spond.",
  "links.license.title": "Lisens & forsikring",
  "links.license.desc": "Forsikring for deltakere i flaggfotball via Min Idrett.",

  // ── Video ─────────────────────────────────────────────
  "video.h": "Se flaggfotball i aksjon",
  "video.sub": "Fanatics Flag Football Classic — Wildcats FFC vs. Team USA",

  // ── FAQ ───────────────────────────────────────────────
  "faq.h": "Ofte stilte spørsmål",
  "faq.q1": "Hvem kan være med?",
  "faq.a1": "Alle fra 16 år og oppover er velkommen! Ingen erfaring nødvendig — vi tilpasser treningene slik at alle kan delta og utvikle seg.",
  "faq.q2": "Trenger jeg erfaring?",
  "faq.a2": "Nei! Vi tar imot alle, fra nybegynnere til de med erfaring. Treningene er tilpasset slik at du lærer underveis.",
  "faq.q3": "Hva koster det?",
  "faq.a3": "Trening er helt gratis! Du trenger medlemskap i Amerikanske Idretters klubb (ca 80 kr) og lisens/forsikring via Min Idrett (ca 100 kr).",
  "faq.q4": "Hva må jeg ta med?",
  "faq.a4": "Sportklær og joggesko. Alt annet utstyr har vi. Ta gjerne med en vannflaske.",
  "faq.q5": "Hvor mange på laget?",
  "faq.a5": "Flaggfotball spilles 5 mot 5 på banen. Vi deler inn i lag på trening.",

  // ── Footer ────────────────────────────────────────────
  "footer.brand": "Tromsø Flaggfotball",

  // ── FieldDiagram ──────────────────────────────────────
  "fd.offense": "Angrep",
  "fd.defense": "Forsvar",
  "fd.endzone": "Endesone",
  "fd.tapHint": "Trykk på en spiller for beskrivelse",
  "fd.standard": "Standard",
  "fd.readMore": "Les mer",

  "fd.tab.formasjon": "Formasjon",
  "fd.tab.kastespill": "Kastespill",
  "fd.tab.lopespill": "Løpespill",
  "fd.tab.soneforsvar": "Soneforsvar",
  "fd.tab.mannmotmann": "Man-man",

  "fd.full.QB": "QB – Quarterback",
  "fd.full.C": "C – Center",
  "fd.full.WR": "WR – Wide Receiver",
  "fd.full.RB": "RB – Running Back",
  "fd.full.R": "R – Rusher",
  "fd.full.DB": "DB – Defensive Back",
  "fd.full.S": "S – Safety",

  "fd.desc.QB": "Lagets playmaker og leder på banen. Kaster ballen til medspillere og styrer spillet.",
  "fd.desc.C": "Starter hvert spill ved å snappe ballen til QB. Går deretter ut som mottaker eller blokkerer rusheren.",
  "fd.desc.WR": "Løper ruter og fanger pasninger fra QB. Målet er å bli fri fra forsvareren og ta imot ballen.",
  "fd.desc.RB": "Tar imot ballen fra QB og løper med den. Kan også brukes som mottaker på korte pasninger.",
  "fd.desc.R": "Starter 7 yards fra ballen med hånden i året. Kan rushe mot QB så fort de klarer etter snap. Laget kan ha 0–2 rushere per spill.",
  "fd.desc.DB": "Dekker motstanderens mottakere tett. Hindrer pasninger og drar flagget til ballbæreren.",
  "fd.desc.S": "Siste skanse i forsvaret. Leser spillet bakfra, hjelper til med dekning og sikrer mot lange pasninger.",

  // ── Posisjoner page chrome ────────────────────────────
  "posPage.headerTitle": "Posisjoner i flaggfotball",
  "posPage.h2": "Posisjoner i flaggfotball",
  "posPage.intro1": "I flaggfotball spilles det 5 mot 5, og posisjonene er i hovedsak de samme som i tackle-fotball, men uten linjemenn. Hver posisjon har en unik rolle, og hvert spill er en maskin der alle må gjøre sin del. Trykk på en spiller på banen — eller en posisjon i listen — for å lese mer.",
  "posPage.intro2": "Alle posisjoner i flaggfotball har fordeler – og det beste er at spillere ikke trenger en bestemt kroppsbygning for å lykkes.",
  "posPage.intro3": "Flaggfotball er utrolig inkluderende, og mange spillere med ulik utvikling finner en posisjon der de kan være konkurransedyktige. I flaggfotball spiller hver spiller både angrep og forsvar, noe som betyr at allsidige spillere som behersker flere ferdigheter har størst suksess.",
  "posPage.offense": "Angrep",
  "posPage.defense": "Forsvar",
  "posPage.back": "Tilbake til hovedsiden",
  "posPage.skillsLabel": "Ferdigheter & egenskaper",
  "posPage.whoFitsPrefix": "Hvem passer som",
  "posPage.nflLabel": "NFL-forbilder:",

  // ── HowIDidIt page chrome (steps stay NO-only for length) ─
  "hid.headerTitle": "Hvordan denne siden ble laget",
  "hid.h": "Bygget med GPT-5.2 + Lovable",
  "hid.p1.pre": "Denne nettsiden startet som en enkel Canva-side. Den visuelle identiteten — farger, fonter, og designretning — ble utviklet gjennom samtaler med ",
  "hid.p1.strong": "GPT-5.2",
  "hid.p1.mid": ". Deretter ble alt bygget ut til en interaktiv nettside med ",
  "hid.p1.linkText": "Lovable",
  "hid.p1.post": ".",
  "hid.p2": "Ingen manuell koding. Ingen Figma. Bare naturlig språk, to AI-er, og en visjon om å gjøre flaggfotball tilgjengelig. Her er prosessen, steg for steg.",
  "hid.outro.title": "Alt gjort via samtale",
  "hid.outro.body": "Hele denne nettsiden — fra første linje til siste hover-effekt — ble bygget ved å chatte med Lovable. Ingen VS Code. Ingen Figma. Bare naturlig språk og en AI som skjønner hva du mener.",
  "hid.outro.cta": "Prøv Lovable selv →",

  // ── TrainingPlans page chrome ─────────────────────────
  "tp.back": "Tilbake",
  "tp.h": "Treningsplaner",
  "tp.sub": "Quick3-baserte treningsplaner for alle aldersgrupper. Velg aldersgruppe for å se ukeplaner med øvelser og videoer.",
  "tp.age.8-10.label": "8–10 år",
  "tp.age.8-10.desc": "45 min • 1 øvelse + Quick3",
  "tp.age.11-13.label": "11–13 år",
  "tp.age.11-13.desc": "60 min • 2 øvelser + Quick3",
  "tp.age.14-16.label": "14–16 år",
  "tp.age.14-16.desc": "90 min • 2 øvelser + Quick3",
  "tp.age.voksne.label": "Voksne",
  "tp.age.voksne.desc": "90 min • 3-4 øvelser + scrimmage",
  "tp.warmup": "Oppvarming",
  "tp.walkthroughYouth": "Lagdeling / gjennomgang",
  "tp.scrimmageYouth": "Quick3 kamper",
  "tp.walkthroughAdult": "Walkthrough",
  "tp.scrimmageAdult": "Scrimmage",
  "tp.progressionPill": "● Progresjon",
  "tp.progressionLabel": "📈 Progresjon:",
  "tp.unsupportedVideo": "Nettleseren din støtter ikke video.",
  "tp.drillBank": "Se i øvelsesbanken",
  "tp.weeksSuffix": "uker • Klikk på en uke for å se øvelsene",
  "tp.weeksSuffixYouth": "uker •",
  "tp.perSession": "per økt",
  "tp.phasePrefix": "Fase",
  "tp.footerVideosFrom": "Øvelsesvideoer fra",
  "tp.footerInspiredBy": "Inspirert av",
  "tp.footerExerciseBank": "Øvelsesbanken",

  // ── 404 ───────────────────────────────────────────────
  "nf.h": "404",
  "nf.p": "Oops! Siden ble ikke funnet",
  "nf.cta": "Tilbake til forsiden",
} as const;

export type TranslationKey = keyof typeof no;

const en: Record<TranslationKey, string> = {
  // Nav
  "nav.om": "About the sport",
  "nav.treninger": "Practices",
  "nav.spillet": "How the game works",
  "nav.coachene": "Coaches",
  "nav.komIGang": "Get started",
  "nav.video": "Video",
  "nav.faq": "FAQ",
  "nav.menu": "Menu",
  "nav.languageLabel": "Language",

  // Hero
  "hero.title.line1": "TROMSØ",
  "hero.title.line2": "FLAG FOOTBALL",
  "hero.tagline": "Arctic flag football · 69°N",
  "hero.logoAlt": "Tromsø Flag Football logo",

  // Om
  "om.h": "What is flag football?",
  "om.p1.pre": "Flag football is a contact-free variant of American football. Instead of tackling, you pull a flag from a belt around the opponent's waist. The sport is fast, tactical and inclusive — and it becomes an Olympic sport at LA 2028.",
  "om.p2.pre": "It's played ",
  "om.p2.strong": "5 vs 5",
  "om.p2.post": " on a field roughly 70 × 30 metres. Each team has four downs to cross midfield, and then four more downs to score a touchdown.",

  // Open
  "open.h": "Open to everyone",
  "open.p1.pre": "In Norway, flag football is usually played ",
  "open.p1.strong": "mixed",
  "open.p1.post": " — with players of all genders on the same team. Speed, technique and game sense matter more than physical strength.",
  "open.p2": "In Tromsø we always train together — and that's exactly what makes it fun. No experience needed, just show up.",

  // Training section
  "training.h": "Practices",
  "training.day": "Day",
  "training.dayValue": "Mondays",
  "training.time": "Time",
  "training.timeValue": "20:30 – 22:00",
  "training.place": "Location",
  "training.placeValue": "Mellomvegen 110",

  // Game
  "game.h": "How the game works",
  "game.sub": "Explore formations, play types and defensive tactics.",
  "game.offense": "Offense",
  "game.defense": "Defense",
  "game.readMoreAll": "Read more about all positions →",

  // Positions (short)
  "pos.qb.tagline": "The team's playmaker and leader",
  "pos.qb.role": "Runs the offense, reads the defense and throws the ball to the receivers. It's all about accurate passes and quick decisions.",
  "pos.qb.traits": "Field vision, accurate passes, fast decision-making.",
  "pos.rb.tagline": "Explosive ball carrier",
  "pos.rb.role": "Takes the ball from the QB and runs through the defense. Used for run plays and short passes.",
  "pos.rb.traits": "Explosive speed, balance, agility.",
  "pos.c.tagline": "Starts every play",
  "pos.c.role": "Snaps the ball to the QB and then runs out as a receiver or blocks the rusher. The glue of the team.",
  "pos.c.traits": "Reliable, communicates well, versatile.",
  "pos.wr.tagline": "Quick receiver who catches the ball",
  "pos.wr.role": "Runs designed routes to get free from the defender and catch passes from the QB.",
  "pos.wr.traits": "Speed, good hands, sharp cuts.",
  "pos.r.tagline": "Hunts the quarterback",
  "pos.r.role": "The defense's most aggressive player. Starts 7 yards from the ball and pressures the QB into throwing too early.",
  "pos.r.traits": "Explosive speed, timing, aggression.",
  "pos.db.tagline": "Sticks tight to the receivers",
  "pos.db.role": "Mirrors the opponent's movement and tries to prevent passes. Often in one-on-one duels.",
  "pos.db.traits": "Quick reactions, good footwork, mental toughness.",
  "pos.s.tagline": "Last line of defense",
  "pos.s.role": "The defense's last line with the best overview. Reads the play and protects against deep passes.",
  "pos.s.traits": "Game sense, field vision, versatility.",
  "pos.card.fits": "Suits:",
  "pos.card.readMorePrefix": "Read more about",

  // Coaches
  "coaches.h": "The coaches",
  "coaches.headTitle": "Head Coach",
  "coaches.assistantTitle": "Assistant coach",
  "coaches.head.bio": "Espen has four seasons as a player with Vålerenga Trolls (American football), where he played quarterback, wide receiver and linebacker. After his playing career he moved to the bench — three years coaching seniors, U13 and a women's team, specialising as QB coach. Won bronze at the Norwegian flag football championship in 2025.",
  "coaches.assistant.bio": "Martin is one of the central figures from Tromsø Trailblazers and has played flag football for 3–4 years — at every position. He works as a teacher in his day job, which makes him a natural educator on the field. Great at breaking the game down so anyone can understand it, regardless of level.",

  // Links
  "links.h": "Get started",
  "links.fb.title": "Facebook",
  "links.fb.desc": "Like our page for up-to-date practice info.",
  "links.ig.title": "Instagram",
  "links.ig.desc": "Photos and videos from practice and games.",
  "links.flag.title": "Flaggfotball.no",
  "links.flag.desc": "Learn more about the sport, rules and tournaments in Norway.",
  "links.member.title": "Become a member",
  "links.member.desc": "Sign up for Amerikanske Idretters club via Spond.",
  "links.license.title": "Licence & insurance",
  "links.license.desc": "Insurance for flag football participants via Min Idrett.",

  // Video
  "video.h": "See flag football in action",
  "video.sub": "Fanatics Flag Football Classic — Wildcats FFC vs. Team USA",

  // FAQ
  "faq.h": "Frequently asked questions",
  "faq.q1": "Who can join?",
  "faq.a1": "Everyone from 16 and up is welcome! No experience needed — we adapt practices so everyone can join in and develop.",
  "faq.q2": "Do I need experience?",
  "faq.a2": "No! We welcome everyone, from beginners to experienced players. Practices are designed so you learn as you go.",
  "faq.q3": "What does it cost?",
  "faq.a3": "Practice is completely free! You need a membership in Amerikanske Idretters club (about 80 NOK) and a licence/insurance via Min Idrett (about 100 NOK).",
  "faq.q4": "What should I bring?",
  "faq.a4": "Sports clothes and running shoes. We have all the other gear. Bring a water bottle if you can.",
  "faq.q5": "How many on a team?",
  "faq.a5": "Flag football is played 5 vs 5 on the field. We split into teams at practice.",

  // Footer
  "footer.brand": "Tromsø Flag Football",

  // FieldDiagram
  "fd.offense": "Offense",
  "fd.defense": "Defense",
  "fd.endzone": "End zone",
  "fd.tapHint": "Tap a player for a description",
  "fd.standard": "Default",
  "fd.readMore": "Read more",

  "fd.tab.formasjon": "Formation",
  "fd.tab.kastespill": "Pass plays",
  "fd.tab.lopespill": "Run plays",
  "fd.tab.soneforsvar": "Zone",
  "fd.tab.mannmotmann": "Man-man",

  "fd.full.QB": "QB – Quarterback",
  "fd.full.C": "C – Center",
  "fd.full.WR": "WR – Wide Receiver",
  "fd.full.RB": "RB – Running Back",
  "fd.full.R": "R – Rusher",
  "fd.full.DB": "DB – Defensive Back",
  "fd.full.S": "S – Safety",

  "fd.desc.QB": "The team's playmaker and leader on the field. Throws the ball to teammates and runs the play.",
  "fd.desc.C": "Starts every play by snapping the ball to the QB. Then runs out as a receiver or blocks the rusher.",
  "fd.desc.WR": "Runs routes and catches passes from the QB. The goal is to get free from the defender and catch the ball.",
  "fd.desc.RB": "Takes the ball from the QB and runs with it. Can also be used as a receiver on short passes.",
  "fd.desc.R": "Starts 7 yards from the ball with a hand on the ground. Can rush the QB as soon as they can after the snap. A team can have 0–2 rushers per play.",
  "fd.desc.DB": "Covers the opposing receivers closely. Prevents passes and pulls the flag from the ball carrier.",
  "fd.desc.S": "The last line of defense. Reads the play from behind, helps with coverage and protects against deep passes.",

  // Positions page
  "posPage.headerTitle": "Positions in flag football",
  "posPage.h2": "Positions in flag football",
  "posPage.intro1": "Flag football is played 5 vs 5, and the positions are largely the same as in tackle football, but without linemen. Each position has a unique role, and every play is a machine where everyone has to do their part. Tap a player on the field — or a position in the list — to read more.",
  "posPage.intro2": "Every position in flag football has its strengths — and the best part is that players don't need a particular body type to succeed.",
  "posPage.intro3": "Flag football is incredibly inclusive, and players with very different builds find a position where they can be competitive. In flag football every player plays both offense and defense, which means versatile players who master several skills succeed the most.",
  "posPage.offense": "Offense",
  "posPage.defense": "Defense",
  "posPage.back": "Back to the home page",
  "posPage.skillsLabel": "Skills & traits",
  "posPage.whoFitsPrefix": "Who fits as a",
  "posPage.nflLabel": "NFL role models:",

  // HowIDidIt
  "hid.headerTitle": "How this site was built",
  "hid.h": "Built with GPT-5.2 + Lovable",
  "hid.p1.pre": "This website started as a simple Canva page. The visual identity — colors, fonts and design direction — was developed through conversations with ",
  "hid.p1.strong": "GPT-5.2",
  "hid.p1.mid": ". Then it was all built out into an interactive site with ",
  "hid.p1.linkText": "Lovable",
  "hid.p1.post": ".",
  "hid.p2": "No manual coding. No Figma. Just natural language, two AIs, and a vision to make flag football accessible. Here is the process, step by step.",
  "hid.outro.title": "All done through conversation",
  "hid.outro.body": "This entire website — from the first line to the last hover effect — was built by chatting with Lovable. No VS Code. No Figma. Just natural language and an AI that gets what you mean.",
  "hid.outro.cta": "Try Lovable yourself →",

  // TrainingPlans
  "tp.back": "Back",
  "tp.h": "Training plans",
  "tp.sub": "Quick3-based training plans for every age group. Pick an age group to see weekly plans with drills and videos.",
  "tp.age.8-10.label": "8–10 yrs",
  "tp.age.8-10.desc": "45 min • 1 drill + Quick3",
  "tp.age.11-13.label": "11–13 yrs",
  "tp.age.11-13.desc": "60 min • 2 drills + Quick3",
  "tp.age.14-16.label": "14–16 yrs",
  "tp.age.14-16.desc": "90 min • 2 drills + Quick3",
  "tp.age.voksne.label": "Adults",
  "tp.age.voksne.desc": "90 min • 3-4 drills + scrimmage",
  "tp.warmup": "Warm-up",
  "tp.walkthroughYouth": "Team split / walkthrough",
  "tp.scrimmageYouth": "Quick3 games",
  "tp.walkthroughAdult": "Walkthrough",
  "tp.scrimmageAdult": "Scrimmage",
  "tp.progressionPill": "● Progression",
  "tp.progressionLabel": "📈 Progression:",
  "tp.unsupportedVideo": "Your browser does not support video.",
  "tp.drillBank": "View in the drill bank",
  "tp.weeksSuffix": "weeks • Click a week to see the drills",
  "tp.weeksSuffixYouth": "weeks •",
  "tp.perSession": "per session",
  "tp.phasePrefix": "Phase",
  "tp.footerVideosFrom": "Drill videos from",
  "tp.footerInspiredBy": "Inspired by",
  "tp.footerExerciseBank": "The drill bank",

  // 404
  "nf.h": "404",
  "nf.p": "Oops! Page not found",
  "nf.cta": "Return to home",
};

export const dictionaries: Record<Lang, Record<TranslationKey, string>> = { no, en };