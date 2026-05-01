import { useLang } from "@/i18n/LanguageProvider";

/**
 * Compact NO|EN pill. Click cycles between Norwegian and English.
 * Used both in the desktop sticky nav and inside the mobile glass menu.
 */
const LanguageToggle = ({ className = "" }: { className?: string }) => {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`inline-flex items-center rounded-full border border-white/15 bg-background/40 backdrop-blur p-0.5 text-[10px] font-heading font-bold ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLang("no")}
        aria-pressed={lang === "no"}
        className={`px-2 py-0.5 rounded-full transition-colors ${
          lang === "no" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        NO
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-2 py-0.5 rounded-full transition-colors ${
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;