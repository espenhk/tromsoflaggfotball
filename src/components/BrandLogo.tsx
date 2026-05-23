import logoDefault from "@/assets/logo.png";
import logoTuil from "@/assets/tuil-logo.png";
import { useTheme } from "@/theme/ThemeProvider";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  alt?: string;
};

/**
 * Brand mark that swaps with the active theme.
 * In TUIL mode the logo is placed on a white rounded plate to keep
 * the dark T·U·I·L wordmark readable against the royal-blue background.
 */
const BrandLogo = ({ className, alt = "Logo" }: Props) => {
  const { theme } = useTheme();

  if (theme === "tuil") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center bg-white rounded-md p-[2px] shadow-sm",
          className,
        )}
      >
        <img src={logoTuil} alt={alt} className="w-full h-full object-contain" />
      </span>
    );
  }

  return <img src={logoDefault} alt={alt} className={className} />;
};

export default BrandLogo;