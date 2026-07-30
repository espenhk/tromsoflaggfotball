import { useLang, useT } from "@/i18n/LanguageProvider";

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
        <span aria-hidden>🇳🇴</span>
        <span className="sr-only">Norsk</span>
      </span>
      <span
        title="English"
        className={`px-2 py-1 rounded-full transition-all ${
          lang === "en" ? "bg-primary" : "opacity-50 grayscale"
        }`}
      >
        <span aria-hidden>🇬🇧</span>
        <span className="sr-only">English</span>
      </span>
    </button>
  );
};

export default LanguageToggle;