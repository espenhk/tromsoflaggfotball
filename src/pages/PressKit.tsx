import { Link } from "react-router-dom";
import { useLang } from "@/i18n/LanguageProvider";
import BrandLogo from "@/components/BrandLogo";
import tuilLogo from "@/assets/tuil-logo.svg";

const PressKit = () => {
  const { lang } = useLang();

  const facts = lang === "no"
    ? [
        ["Klubb", "Tromsø Flaggfotball (under TUIL / Amerikanske Idretter)"],
        ["Divisjon", "Norsk Flaggfotball, 5v5"],
      ]
    : [
        ["Club", "Tromsø Flag Football (part of TUIL / American Sports)"],
        ["League", "Norwegian Flag Football, 5v5"],
      ];

  const palette: { name: string; token: string; bg: string; fg: string }[] = [
    { name: lang === "no" ? "Bakgrunn" : "Background", token: "--background", bg: "hsl(var(--background))", fg: "hsl(var(--foreground))" },
    { name: lang === "no" ? "Forgrunn" : "Foreground", token: "--foreground", bg: "hsl(var(--foreground))", fg: "hsl(var(--background))" },
    { name: lang === "no" ? "Primær" : "Primary",    token: "--primary",    bg: "hsl(var(--primary))",    fg: "hsl(var(--primary-foreground))" },
    { name: lang === "no" ? "Aksent" : "Accent",     token: "--accent",     bg: "hsl(var(--accent))",     fg: "hsl(var(--accent-foreground))" },
  ];

  const T = {
    heading: lang === "no" ? "Pressekit" : "Press kit",
    intro: lang === "no"
      ? "Fakta, logoer og fargeprofil for redaksjonelt bruk."
      : "Facts, logos and colour profile for editorial use.",
    about: lang === "no" ? "Om klubben" : "About the club",
    aboutBody: lang === "no"
      ? "Tromsø Flaggfotball er en åpen flaggfotballgruppe under TUIL / Amerikanske Idretter. Alle er velkomne på trening."
      : "Tromsø Flag Football is an open flag football group under TUIL / American Sports. Everyone is welcome at training.",
    facts: lang === "no" ? "Nøkkelfakta" : "Key facts",
    logos: lang === "no" ? "Logoer" : "Logos",
    colors: lang === "no" ? "Farger" : "Colours",
    typography: lang === "no" ? "Typografi" : "Typography",
    typoBody: lang === "no"
      ? "Sidens typografi følger aktivt tema via CSS-variabler (--font-heading / --font-body)."
      : "Site typography follows the active theme via CSS variables (--font-heading / --font-body).",
    contact: lang === "no" ? "Kontakt" : "Contact",
    contactBody: lang === "no"
      ? "For intervjuer eller henvendelser, se trenerne på forsiden."
      : "For interviews or enquiries, see the coaches section on the front page.",
    contactCta: lang === "no" ? "Til trenerne →" : "To the coaches →",
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
              <div key={c.token} className="rounded-lg overflow-hidden border border-border">
                <div className="h-24 flex items-center justify-center" style={{ background: c.bg, color: c.fg }}>
                  <span className="font-heading text-xs uppercase tracking-widest">Aa</span>
                </div>
                <div className="p-3 bg-card/50">
                  <div className="font-heading font-semibold text-sm text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{c.token}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={T.typography}>
          <p className="text-muted-foreground max-w-2xl">{T.typoBody}</p>
          <div className="mt-4 rounded-lg border border-border bg-card/50 p-6">
            <div className="font-heading text-4xl mb-2 text-foreground">
              {lang === "no" ? "Overskrift" : "Heading"}
            </div>
            <div className="font-body text-base text-foreground">
              {lang === "no"
                ? "Brødtekst — den kvikke brune reven hopper over den late hunden."
                : "Body text — the quick brown fox jumps over the lazy dog."}
            </div>
          </div>
        </Section>

        <Section title={T.contact}>
          <p className="text-muted-foreground mb-2 max-w-2xl">{T.contactBody}</p>
          <Link
            to="/#coachene"
            className="inline-block font-heading text-lg text-primary hover:underline"
          >
            {T.contactCta}
          </Link>
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