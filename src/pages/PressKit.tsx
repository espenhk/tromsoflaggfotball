import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageProvider";
import BrandLogo from "@/components/BrandLogo";
import tuilLogo from "@/assets/tuil-logo.svg";

const PressKit = () => {
  const { lang } = useLang();

  const facts = lang === "no"
    ? [
        ["Klubb", "Tromsø Flaggfotball (under TUIL / Amerikanske Idretter)"],
        ["Stiftet", "2024"],
        ["Hjemmebane", "Tromsdalen kunstgress"],
        ["Divisjon", "Norsk Flaggfotball, 5v5"],
        ["Farger", "Fjordturkis · nattblå"],
        ["Kontakt", "presse@tromsoflaggfotball.no"],
      ]
    : [
        ["Club", "Tromsø Flag Football (part of TUIL / American Sports)"],
        ["Founded", "2024"],
        ["Home venue", "Tromsdalen artificial turf"],
        ["League", "Norwegian Flag Football, 5v5"],
        ["Colours", "Fjord turquoise · night blue"],
        ["Contact", "press@tromsoflaggfotball.no"],
      ];

  const palette: { name: string; hex: string; token: string }[] = [
    { name: "Fjord turquoise", hex: "#54c59e", token: "--primary" },
    { name: "Night blue", hex: "#001a14", token: "--background" },
    { name: "Ivory", hex: "#f5f0e6", token: "--foreground" },
    { name: "Rose", hex: "#fb7185", token: "--accent" },
  ];

  const T = {
    heading: lang === "no" ? "Pressekit" : "Press kit",
    intro: lang === "no"
      ? "Alt du trenger for å skrive om oss: fakta, logoer, farger og bilder. Bruk fritt for redaksjonelt bruk."
      : "Everything you need to write about us: facts, logos, colours and photos. Free for editorial use.",
    about: lang === "no" ? "Om klubben" : "About the club",
    aboutBody: lang === "no"
      ? "Tromsø Flaggfotball er verdens nordligste flaggfotballklubb. Vi trener åpent, uten kontraktshysteri, med lånt utstyr til alle som møter opp. Målet er en aktiv, inkluderende idrett for både barn og voksne — hele året, uansett vær."
      : "Tromsø Flag Football is the world's northernmost flag football club. We train openly, without contract fuss, with loaner gear for anyone who shows up. The goal is an active, inclusive sport for children and adults — all year, in any weather.",
    facts: lang === "no" ? "Nøkkelfakta" : "Key facts",
    logos: lang === "no" ? "Logoer" : "Logos",
    colors: lang === "no" ? "Farger" : "Colours",
    typography: lang === "no" ? "Typografi" : "Typography",
    typoBody: lang === "no"
      ? "Overskrifter: Syne (variable, 700-800). Brødtekst: Outfit (400-600)."
      : "Headings: Syne (variable, 700-800). Body: Outfit (400-600).",
    contact: lang === "no" ? "Kontakt" : "Contact",
    contactBody: lang === "no"
      ? "For intervjuer, bilder eller andre henvendelser:"
      : "For interviews, photos or other press enquiries:",
    contactEmail: lang === "no" ? "presse@tromsoflaggfotball.no" : "press@tromsoflaggfotball.no",
    back: lang === "no" ? "Tilbake" : "Back",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← {T.back}</Link>
        <h1 className="font-display text-5xl md:text-6xl mt-3 mb-3">{T.heading}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-12">{T.intro}</p>

        <Section title={T.about}>
          <p className="text-foreground leading-relaxed max-w-2xl">{T.aboutBody}</p>
        </Section>

        <Section title={T.facts}>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl">
            {facts.map(([k, v]) => (
              <div key={k} className="flex flex-col border-b border-border py-2">
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">{k}</dt>
                <dd className="font-heading text-base mt-1">{v}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title={T.logos}>
          <div className="grid sm:grid-cols-2 gap-6">
            <LogoCard
              label="Tromsø Flaggfotball · SVG"
              node={<BrandLogo variant="mark" alt="Tromsø Flaggfotball" className="h-24 w-auto" />}
              href="/make-ig-post/examples-assets/ig-ex-logo-a.png"
              download="tromso-flaggfotball-logo.png"
            />
            <LogoCard
              label="TUIL · SVG"
              node={<img src={tuilLogo} alt="TUIL" className="h-24 w-auto" />}
              href={tuilLogo}
              download="tuil-logo.svg"
            />
          </div>
        </Section>

        <Section title={T.colors}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
            {palette.map((c) => (
              <div key={c.hex} className="rounded-lg overflow-hidden border border-border">
                <div className="h-24" style={{ background: c.hex }} />
                <div className="p-3">
                  <div className="font-heading font-semibold text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={T.typography}>
          <p className="text-muted-foreground max-w-2xl">{T.typoBody}</p>
          <div className="mt-4 rounded-lg border border-border bg-card/50 p-6">
            <div className="font-display text-4xl mb-2">Syne — Headings</div>
            <div className="font-body text-base">Outfit — the quick brown fox jumps over the lazy dog.</div>
          </div>
        </Section>

        <Section title={T.contact}>
          <p className="text-muted-foreground mb-2">{T.contactBody}</p>
          <a
            href={`mailto:${T.contactEmail}`}
            className="inline-block font-heading text-lg text-primary hover:underline"
          >
            {T.contactEmail}
          </a>
        </Section>
      </div>
    </main>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h2 className="font-display text-2xl mb-4">{title}</h2>
    {children}
  </section>
);

const LogoCard = ({
  label, node, href, download,
}: {
  label: string;
  node: React.ReactNode;
  href: string;
  download: string;
}) => (
  <div className="rounded-lg border border-border bg-card/50 p-6 flex flex-col items-center gap-4">
    <div className="min-h-[100px] flex items-center justify-center">{node}</div>
    <div className="text-xs uppercase tracking-widest text-muted-foreground text-center">{label}</div>
    <a
      href={href}
      download={download}
      className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90"
    >
      Download
    </a>
  </div>
);

export default PressKit;