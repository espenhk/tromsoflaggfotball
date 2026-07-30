import { useLang, useT } from "@/i18n/LanguageProvider";

/** Inline SVG flags — emoji flags don't render on Windows/most desktop browsers. */
const FlagNO = () => (
  <svg viewBox="0 0 22 16" className="w-5 h-[0.9rem] rounded-[2px] block" aria-hidden>
    <rect width="22" height="16" fill="#BA0C2F" />
    <path d="M0 6h22M8 0v16" stroke="#fff" strokeWidth="4" />
    <path d="M0 6h22M8 0v16" stroke="#00205B" strokeWidth="2" />
  </svg>
);

const FlagGB = () => (
  <svg viewBox="0 0 60 30" className="w-5 h-[0.9rem] rounded-[2px] block" aria-hidden>
    <clipPath id="lt-gb-clip">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <rect width="60" height="30" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#lt-gb-clip)" stroke="#C8102E" strokeWidth="4" />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

/**
 * Compact flag pill toggle. Clicking anywhere on the pill swaps language.
 * Flags rather than NO/EN so a non-Norwegian visitor recognises it instantly.
 */
const LanguageToggle = ({ className = "" }: { className?: string }) => {
  const { lang, setLang } = useLang();
  const t = useT();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "no" ? "en" : "no")}
      className={`inline-flex items-center rounded-full border border-white/15 bg-background/40 backdrop-blur p-0.5 text-base leading-none cursor-pointer ${className}`}
      role="switch"
      aria-checked={lang === "en"}
      aria-label={t("nav.languageLabel")}
    >
      <span
        title="Norsk"
        className={`px-2 py-1 rounded-full transition-all ${
          lang === "no" ? "bg-primary" : "opacity-50 grayscale"
        }`}
      >
        <FlagNO />
        <span className="sr-only">Norsk</span>
      </span>
      <span
        title="English"
        className={`px-2 py-1 rounded-full transition-all ${
          lang === "en" ? "bg-primary" : "opacity-50 grayscale"
        }`}
      >
        <FlagGB />
        <span className="sr-only">English</span>
      </span>
    </button>
  );
};

export default LanguageToggle;