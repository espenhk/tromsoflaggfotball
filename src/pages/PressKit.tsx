import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageProvider";
import BrandLogo from "@/components/BrandLogo";
import tuilLogo from "@/assets/tuil-logo.svg";

// Convert an HSL string like "195 100% 4%" to #rrggbb.
function hslVarToHex(hsl: string): string {
  const m = hsl.trim().match(/^(-?[\d.]+)\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);
  if (!m) return "#000000";
  const h = parseFloat(m[1]) / 360;
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (n: number) =>
    Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function firstFamily(stack: string): string {
  const first = stack.split(",")[0]?.trim() ?? "";
  return first.replace(/^['"]|['"]$/g, "");
}

const PressKit = () => {
  const { lang } = useLang();
  const [tokens, setTokens] = useState({
    background: "",
    foreground: "",
    primary: "",
    accent: "",
    heading: "",
    body: "",
  });

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setTokens({
      background: cs.getPropertyValue("--background"),
      foreground: cs.getPropertyValue("--foreground"),
      primary: cs.getPropertyValue("--primary"),
      accent: cs.getPropertyValue("--accent"),
      heading: cs.getPropertyValue("--font-heading"),
      body: cs.getPropertyValue("--font-body"),
    });
  }, []);

  const facts = lang === "no"
    ? [
        ["Klubb", "Tromsø Flaggfotball (under TUIL / Amerikanske Idretter)"],
        ["Divisjon", "Norsk Flaggfotball, 5v5"],
      ]
    : [
        ["Club", "Tromsø Flag Football (part of TUIL / American Sports)"],
        ["League", "Norwegian Flag Football, 5v5"],
      ];

  const palette: { name: string; hex: string; bg: string; fg: string }[] = [
    { name: lang === "no" ? "Bakgrunn" : "Background", hex: hslVarToHex(tokens.background), bg: "hsl(var(--background))", fg: "hsl(var(--foreground))" },
    { name: lang === "no" ? "Forgrunn" : "Foreground", hex: hslVarToHex(tokens.foreground), bg: "hsl(var(--foreground))", fg: "hsl(var(--background))" },
    { name: lang === "no" ? "Primær" : "Primary",     hex: hslVarToHex(tokens.primary),    bg: "hsl(var(--primary))",    fg: "hsl(var(--primary-foreground))" },
    { name: lang === "no" ? "Aksent" : "Accent",      hex: hslVarToHex(tokens.accent),     bg: "hsl(var(--accent))",     fg: "hsl(var(--accent-foreground))" },
  ];

  const headingFont = firstFamily(tokens.heading);
  const bodyFont = firstFamily(tokens.body);

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
              <div key={c.name} className="rounded-lg overflow-hidden border border-border">
                <div className="h-24 flex items-center justify-center" style={{ background: c.bg, color: c.fg }}>
                  <span className="font-heading text-xs uppercase tracking-widest">Aa</span>
                </div>
                <div className="p-3 bg-card/50">
                  <div className="font-heading font-semibold text-sm text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{c.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={T.typography}>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {lang === "no" ? "Overskrifter" : "Headings"} · {headingFont}
              </div>
              <div className="font-heading text-4xl text-foreground">
                {lang === "no" ? "Overskrift" : "Heading"}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {lang === "no" ? "Brødtekst" : "Body"} · {bodyFont}
              </div>
              <div className="font-body text-base text-foreground">
                {lang === "no"
                  ? "Den kvikke brune reven hopper over den late hunden."
                  : "The quick brown fox jumps over the lazy dog."}
              </div>
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