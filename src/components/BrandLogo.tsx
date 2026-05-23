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
  const { theme } = useTheme();

  if (theme === "tuil") {
    if (variant === "mark") {
      // Red source PNG recolored to white via CSS filter so it stands out on blue.
      return (
        <img
          src={logoTuilMark}
          alt={alt}
          className={cn("object-contain", className)}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      );
    }
    return (
      <img src={logoTuil} alt={alt} className={cn("object-contain", className)} />
    );
  }

  return <img src={logoDefault} alt={alt} className={className} />;
};

export default BrandLogo;