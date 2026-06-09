import logoDefault from "@/assets/logo.png";
import logoTuil from "@/assets/tuil-logo.svg";
import logoTuilMark from "@/assets/tuil-wordmark.png";
import { useTheme } from "@/theme/ThemeProvider";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  alt?: string;
  /** "mark" uses the compact T·U·I·L wordmark (white) for small/menu contexts. */
  variant?: "default" | "mark";
};

const BrandLogo = ({ className, alt = "Logo", variant = "default" }: Props) => {
  const { theme, selectedTheme, revealMode, revealActive, revealStage } = useTheme();

  // During the staged reveal the logos behave differently than the static theme.
  const inReveal = revealActive && revealMode && selectedTheme === "tuil";
  // Hero (default-variant) logo: the original logo should remain visible until
  // the blue panel physically covers it. Once the theme has swapped underneath,
  // keep the replacement hidden until the stage 3 pop-in.
  const heroHidden = inReveal && theme === "tuil" && variant === "default" && revealStage >= 2 && revealStage < 3;
  const heroPop = inReveal && variant === "default" && revealStage >= 3;
  // Header / footer (mark-variant) logos: stay visible through stage 1 (the red
  // header sweep), then hidden under the blue dissolve until stage 4 fades them back in.
  const markHidden = inReveal && variant === "mark" && revealStage >= 2 && revealStage < 4;
  const markFadeIn = inReveal && variant === "mark" && revealStage === 4;

  if (theme === "tuil") {
    if (variant === "mark") {
      // Red source PNG recolored to white via CSS filter so it stands out on blue.
      return (
        <img
          key="tuil-mark"
          src={logoTuilMark}
          alt={alt}
          className={cn(
            "object-contain brand-logo-fade",
            markHidden && "reveal-logo-hidden",
            markFadeIn && "reveal-fade-in",
            className,
          )}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      );
    }
    if (heroPop) {
      return (
        <span className={cn("relative inline-flex items-center justify-center reveal-logo-pop-wrap", className)}>
          <span className="reveal-logo-ring" aria-hidden />
          <span className="reveal-logo-ring reveal-logo-ring-2" aria-hidden />
          <img src={logoTuil} alt={alt} className="object-contain reveal-logo-pop w-full h-full" />
        </span>
      );
    }
    return (
      <img
        key="tuil"
        src={logoTuil}
        alt={alt}
        className={cn(
          "object-contain brand-logo-fade",
          heroHidden && "reveal-logo-hidden",
          className,
        )}
      />
    );
  }

  return (
    <img
      key="default"
      src={logoDefault}
      alt={alt}
      className={cn(
        "brand-logo-fade",
        heroHidden && "reveal-logo-hidden",
        markHidden && "reveal-logo-hidden",
        className,
      )}
    />
  );
};

export default BrandLogo;