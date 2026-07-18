import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import FieldDiagram from "@/components/FieldDiagram";
import BrandLogo from "@/components/BrandLogo";
import { useTheme } from "@/theme/ThemeProvider";
import { useT } from "@/i18n/LanguageProvider";
import {
  ContentBlocksProvider,
  AfterSection,
  MdBlock,
  useSlot,
} from "@/hooks/useContentBlocks";

const PosisjonerInner = () => {
  const { hash } = useLocation();
  const { theme } = useTheme();
  const t = useT();
  // Fullscreen diagram view shown when user lands on /posisjoner without a target hash
  const [showFullscreen, setShowFullscreen] = useState<boolean>(!hash);

  const openAndScroll = (id: string) => {
    setShowFullscreen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  useEffect(() => {
    if (hash) {
      setShowFullscreen(false);
      openAndScroll(hash.slice(1));
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b border-white/20"
        style={{ backgroundColor: "hsl(3 79% 49%)" }}
      >
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-3 py-3">
          <Link
            to="/#spillet"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <BrandLogo variant="mark" whiteMark alt="Logo" className="h-6 w-auto" />
          </Link>
          <h1 className="font-heading font-medium text-white text-sm">{t("posPage.headerTitle")}</h1>
        </div>
      </nav>

      {/* Fullscreen edge-to-edge field — shown when no specific position requested */}
      {showFullscreen && (
        <section className="relative w-full">
          <FieldDiagram
            onPositionNavigate={openAndScroll}
            navigateMode="direct"
            fullscreen
            variant="simple"
            stickyTopOffset={48}
          />
        </section>
      )}

      <main id="posisjoner-liste" className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="space-y-6">
          <div className="space-y-3">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{t("posPage.h2")}</h2>
            <IntroSlot
              fallbackParas={[t("posPage.intro1"), t("posPage.intro2"), t("posPage.intro3")]}
            />
          </div>
        </section>

        {/* All flexible CMS sections: inline field diagram, offense/defense lists, and anything else */}
        <AfterSection page="posisjoner" after="intro" />

        <div className="pt-2 pb-8">
          <Link
            to="/#spillet"
            className={`text-sm hover:underline font-body inline-flex items-center gap-1 ${theme === "tuil" ? "text-rose-300" : "text-primary"}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("posPage.back")}
          </Link>
        </div>
      </main>
    </div>
  );
};

const IntroSlot = ({ fallbackParas }: { fallbackParas: string[] }) => {
  const slot = useSlot("intro");
  if (slot) return <MdBlock md={slot.body} />;
  return (
    <>
      {fallbackParas.map((p, i) => (
        <p key={i} className="text-muted-foreground font-body leading-relaxed max-w-2xl">{p}</p>
      ))}
    </>
  );
};

const Posisjoner = () => (
  <ContentBlocksProvider page="posisjoner">
    <PosisjonerInner />
  </ContentBlocksProvider>
);

export default Posisjoner;