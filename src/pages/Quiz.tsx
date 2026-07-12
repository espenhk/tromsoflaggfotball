import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ContentBlocksProvider,
  SectionAnchor,
  MdBlock,
  useSlot,
} from "@/hooks/useContentBlocks";
import { useLang } from "@/i18n/LanguageProvider";
import { offensePositions, defensePositions, positionSlugMap } from "@/data/positions";

type PosKey = "QB" | "RB" | "C" | "WR" | "R" | "DB" | "S";

type QA = {
  q_no: string;
  q_en: string;
  answers: { a_no: string; a_en: string; weights: Partial<Record<PosKey, number>> }[];
};

const QUESTIONS: QA[] = [
  {
    q_no: "Hvordan har du det når laget ser på deg for å ta avgjørelsen?",
    q_en: "How do you feel when the whole team looks to you to make the call?",
    answers: [
      { a_no: "Elsker det — jeg vil ha kontrollen.", a_en: "Love it — I want the control.", weights: { QB: 3, S: 1 } },
      { a_no: "Greit, så lenge jeg har en plan.", a_en: "Fine, as long as I have a plan.", weights: { S: 3, C: 1 } },
      { a_no: "Heller la noen andre snakke — jeg utfører.", a_en: "Prefer someone else talks — I just do.", weights: { RB: 2, WR: 2, R: 2, DB: 1 } },
    ],
  },
  {
    q_no: "Hva er sannest om deg fysisk?",
    q_en: "What's most true about you physically?",
    answers: [
      { a_no: "Rask og eksplosiv over korte avstander.", a_en: "Fast and explosive over short distances.", weights: { RB: 3, R: 2, DB: 1 } },
      { a_no: "Lang, smidig, gode hender.", a_en: "Tall, agile, good hands.", weights: { WR: 3, S: 1 } },
      { a_no: "Sterk og stødig — jeg trives i tett kontakt.", a_en: "Strong and steady — I like tight contact.", weights: { C: 3, R: 2 } },
      { a_no: "Utholdenhet og oversikt fremfor toppfart.", a_en: "Endurance and vision more than top speed.", weights: { QB: 2, S: 3 } },
    ],
  },
  {
    q_no: "Hva synes du er kulest på TV?",
    q_en: "Which looks coolest on TV?",
    answers: [
      { a_no: "En perfekt langpasning helt ned til endsonen.", a_en: "A perfect deep pass into the end zone.", weights: { QB: 3, WR: 2 } },
      { a_no: "En running back som spinner unna tre tacklere.", a_en: "A running back spinning past three defenders.", weights: { RB: 3 } },
      { a_no: "En pass-rush som gir sekk.", a_en: "A pass-rush getting the sack.", weights: { R: 3 } },
      { a_no: "En interception, snudd om til touchdown.", a_en: "An interception returned for a touchdown.", weights: { DB: 3, S: 2 } },
    ],
  },
  {
    q_no: "Hva slags spiller savner laget mest når du ikke er der?",
    q_en: "What does the team miss most when you're not there?",
    answers: [
      { a_no: "Kommunikasjonen og roen min.", a_en: "My communication and calm.", weights: { QB: 2, C: 2, S: 3 } },
      { a_no: "Farten og energien min.", a_en: "My speed and energy.", weights: { RB: 2, WR: 2, R: 2 } },
      { a_no: "Fysikken og tåleevnen min.", a_en: "My physicality and toughness.", weights: { C: 3, R: 2 } },
      { a_no: "Lesningen av spillet — jeg er alltid rett sted.", a_en: "Reading the game — I'm always in the right spot.", weights: { S: 3, DB: 2, QB: 1 } },
    ],
  },
  {
    q_no: "Foretrekker du å…",
    q_en: "Do you prefer to…",
    answers: [
      { a_no: "…score.", a_en: "…score.", weights: { QB: 1, RB: 3, WR: 3 } },
      { a_no: "…stoppe motstanderen fra å score.", a_en: "…stop the other team from scoring.", weights: { R: 3, DB: 3, S: 2 } },
      { a_no: "…være limet som får laget til å fungere.", a_en: "…be the glue that makes the team work.", weights: { C: 3, S: 1, QB: 1 } },
    ],
  },
  {
    q_no: "Når planen ryker midt i spillet, hva gjør du?",
    q_en: "When the plan falls apart mid-play, what do you do?",
    answers: [
      { a_no: "Improviserer — finner en ny åpning.", a_en: "Improvise — find a new opening.", weights: { QB: 3, RB: 2, WR: 1 } },
      { a_no: "Går rett fremover og skaper kaos.", a_en: "Go straight ahead and create chaos.", weights: { R: 3, RB: 1 } },
      { a_no: "Faller tilbake og dekker ferdig.", a_en: "Drop back and finish the coverage.", weights: { DB: 3, S: 3 } },
      { a_no: "Holder posisjon og beskytter.", a_en: "Hold position and protect.", weights: { C: 3 } },
    ],
  },
];

const abbrToPosition = (abbr: PosKey) => {
  const all = [...offensePositions, ...defensePositions];
  return all.find((p) => p.abbr === abbr);
};

const QuizInner = () => {
  const { lang } = useLang();
  const [answers, setAnswers] = useState<number[]>([]);

  const total = QUESTIONS.length;
  const idx = answers.length;
  const done = idx >= total;

  const result = useMemo(() => {
    if (!done) return null;
    const score: Record<PosKey, number> = { QB: 0, RB: 0, C: 0, WR: 0, R: 0, DB: 0, S: 0 };
    answers.forEach((ai, qi) => {
      const w = QUESTIONS[qi].answers[ai]?.weights ?? {};
      (Object.keys(w) as PosKey[]).forEach((k) => { score[k] += w[k] ?? 0; });
    });
    const sorted = (Object.entries(score) as [PosKey, number][])
      .sort((a, b) => b[1] - a[1]);
    const top = sorted[0][1];
    const winners = sorted.filter(([, s]) => s === top).map(([k]) => k);
    return { winners, sorted };
  }, [done, answers]);

  const reset = () => setAnswers([]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← {lang === "no" ? "Tilbake" : "Back"}</Link>
        <h1 className="font-display text-4xl md:text-5xl mt-3 mb-2">
          {lang === "no" ? "Hvilken posisjon er du?" : "Which position are you?"}
        </h1>
        <QuizIntro fallback={
          lang === "no"
            ? "Seks spørsmål. Svarene peker mot posisjonen som passer deg best."
            : "Six questions. Your answers point to the position that fits you best."
        } />

        {!done && (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <div className="flex items-center gap-1 mb-6">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < idx ? "bg-primary" : i === idx ? "bg-primary/50" : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {(lang === "no" ? "Spørsmål " : "Question ")}{idx + 1} / {total}
            </div>
            <h2 className="font-heading text-xl md:text-2xl mb-6">
              {lang === "no" ? QUESTIONS[idx].q_no : QUESTIONS[idx].q_en}
            </h2>
            <div className="flex flex-col gap-3">
              {QUESTIONS[idx].answers.map((a, ai) => (
                <button
                  key={ai}
                  onClick={() => setAnswers([...answers, ai])}
                  className="text-left px-4 py-3 rounded-md border border-border bg-background hover:border-primary hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)] transition"
                >
                  {lang === "no" ? a.a_no : a.a_en}
                </button>
              ))}
            </div>
          </div>
        )}

        {done && result && (
          <div className="rounded-lg border border-border bg-card/50 p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              {lang === "no" ? "Din posisjon" : "Your position"}
            </div>
            <div className="flex flex-wrap gap-3 mb-6">
              {result.winners.map((abbr) => {
                const p = abbrToPosition(abbr);
                if (!p) return null;
                const slug = positionSlugMap[p.name];
                return (
                  <Link
                    key={abbr}
                    to={`/posisjoner#${slug}`}
                    className="flex-1 min-w-[180px] rounded-md border border-primary/50 bg-primary/5 p-5 hover:shadow-[0_0_12px_hsl(var(--primary)/0.5)] transition"
                  >
                    <div className="font-display text-3xl">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{p.abbr}</div>
                    <div className="text-sm mt-3 text-primary">
                      {lang === "no" ? "Les mer →" : "Read more →"}
                    </div>
                  </Link>
                );
              })}
            </div>
            <details className="mb-6 text-sm text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                {lang === "no" ? "Se alle poeng" : "See full scores"}
              </summary>
              <ul className="mt-3 space-y-1">
                {result.sorted.map(([k, s]) => (
                  <li key={k} className="flex justify-between border-b border-border/50 py-1">
                    <span>{abbrToPosition(k)?.name ?? k}</span>
                    <span className="font-mono">{s}</span>
                  </li>
                ))}
              </ul>
            </details>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-md border border-border hover:bg-muted text-sm"
            >
              {lang === "no" ? "Ta quizen på nytt" : "Retake the quiz"}
            </button>
          </div>
        )}
      </div>
      <SectionAnchor anchor="end" striped />
    </main>
  );
};

const QuizIntro = ({ fallback }: { fallback: string }) => {
  const slot = useSlot("intro");
  if (slot) return <MdBlock md={slot.body} className="mb-8" />;
  return <p className="text-muted-foreground mb-8">{fallback}</p>;
};

const Quiz = () => (
  <ContentBlocksProvider page="quiz">
    <QuizInner />
  </ContentBlocksProvider>
);

export default Quiz;