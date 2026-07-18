import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useT } from "@/i18n/LanguageProvider";
import type { TranslationKey } from "@/i18n/dictionaries";
import { useTheme } from "@/theme/ThemeProvider";
import { positionSlugMap } from "@/data/positions";

export type PositionCardProps = {
  name: string;
  abbr: string;
  taglineKey: TranslationKey;
  icon: React.ReactNode;
  glowBg?: string;
  roleKey: TranslationKey;
  traitsKey: TranslationKey;
  nflExamples?: string;
  variant?: "offense" | "defense";
  supColor?: string;
};

/** Compact expandable position card used on the front page. */
const PositionCard = ({
  name,
  abbr,
  taglineKey,
  icon,
  glowBg,
  roleKey,
  traitsKey,
  nflExamples,
  variant = "offense",
  supColor,
}: PositionCardProps) => {
  const t = useT();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const isOffense = variant === "offense";
  const accentColor = isOffense ? "text-sky-400" : "text-rose-400";
  const resolvedSupColor = supColor || accentColor;
  const resolvedGlow = glowBg || (isOffense ? "bg-sky-400/10" : "bg-rose-400/10");

  return (
    <article className="group relative md:border-0 border-t border-white/5 first:border-t-0">
      <div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${resolvedGlow} hidden md:block`}
        style={{ filter: "blur(12px)" }}
      />
      <div
        className={`absolute inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${resolvedGlow} hidden md:block`}
      />
      <button
        onClick={() => setOpen(!open)}
        className="relative w-full text-left px-3 py-2 md:py-1.5"
      >
        <div className="relative flex items-center gap-2">
          <div className={accentColor}>{icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-medium text-foreground text-sm">
              {name}
              {abbr && (
                <sup className={`ml-0.5 transition-all duration-300 text-[0.7em] align-super ${resolvedSupColor} ${open ? "opacity-0" : "opacity-50"}`}>
                  {abbr}
                </sup>
              )}
            </h3>
            <p className={`text-xs text-muted-foreground font-body mt-0.5 transition-all duration-300 overflow-hidden hidden md:block ${open ? "md:max-h-0 md:opacity-0 md:mt-0" : "md:max-h-10 md:opacity-100"}`}>{t(taglineKey)}</p>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div className={`relative grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${open ? "mt-1 md:mt-2 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-1.5 pl-10 md:pl-7 pb-2 md:pb-1.5 pr-3">
            <p className="text-xs text-muted-foreground font-body leading-relaxed italic md:hidden">{t(taglineKey)}</p>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">{t(roleKey)}</p>
            <p className={`text-xs font-body ${accentColor}`}>
              <span className="text-muted-foreground">{t("pos.card.fits")}</span> {t(traitsKey)}
            </p>
            {nflExamples && (
              <p className="text-xs font-body text-muted-foreground">
                <span className="text-foreground font-semibold">NFL:</span> {nflExamples}
              </p>
            )}
            <Link
              to={`/posisjoner#${positionSlugMap[name] || name.toLowerCase()}`}
              className={`inline-flex items-center gap-1 text-xs font-body hover:underline mt-1 ${theme === "tuil" ? "text-rose-300" : "text-primary"}`}
            >
              {t("pos.card.readMorePrefix")} {name.toLowerCase()} →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PositionCard;