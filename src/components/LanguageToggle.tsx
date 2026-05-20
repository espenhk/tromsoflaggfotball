import { useLang } from "@/i18n/LanguageProvider";

/**
 * Compact NO|EN pill toggle. Clicking anywhere on the pill swaps to the other language.
 * Used both in the desktop sticky nav and inside the mobile glass menu.
 */
const LanguageToggle = ({ className = "", showLabel = false }: { className?: string; showLabel?: boolean }) => {
  const { lang, setLang } = useLang();

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {showLabel && (
        <span className="text-[10px] font-heading font-bold text-muted-foreground uppercase tracking-wider">
          {lang.toUpperCase()}
        </span>
      )}
      <button
        type="button"
        onClick={() => setLang(lang === "no" ? "en" : "no")}
        className="inline-flex items-center rounded-full border border-white/15 bg-background/40 backdrop-blur p-0.5 text-[10px] font-heading font-bold cursor-pointer"
        role="switch"
        aria-checked={lang === "en"}
        aria-label="Language"
      >
        <span
          className={`px-2 py-0.5 rounded-full transition-colors ${
            lang === "no" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          NO
        </span>
        <span
          className={`px-2 py-0.5 rounded-full transition-colors ${
            lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          EN
        </span>
      </button>
    </div>
  );
};

export default LanguageToggle;