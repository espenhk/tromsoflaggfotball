import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import SocialFeedCarousel, { mockPosts } from "@/components/SocialFeedCarousel";

const SosialtMock = () => {
  // Variants for visual comparison
  const igOnly = mockPosts.filter((p) => p.source === "ig");
  const fbOnly = mockPosts.filter((p) => p.source === "fb");

  return (
    <div className="min-h-screen bg-background">
      {/* Header — mirrors Posisjoner page */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md border-b border-white/20"
        style={{ backgroundColor: "hsl(3 79% 49%)" }}
      >
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-3 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <BrandLogo variant="mark" whiteMark alt="Logo" className="h-6 w-auto" />
          </Link>
          <h1 className="font-heading font-medium text-white text-sm">
            Sosiale medier — mockup
          </h1>
        </div>
      </nav>

      {/* Intro */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Carousel-mockup
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Forhåndsvisning av hvordan en kombinert Instagram + Facebook-feed
            kan se ut på forsiden. All data er mock — ekte poster kobles på
            etter at Meta-tokenet er på plass.
          </p>
        </div>
      </section>

      {/* Combined feed (interleaved by date) */}
      <SocialFeedCarousel
        title="Kombinert feed (IG + FB)"
        subtitle="Begge plattformer interleavet etter dato — slik vi vil ha det på forsiden"
      />

      {/* IG-only */}
      <SocialFeedCarousel
        posts={igOnly}
        title="Variant: kun Instagram"
        subtitle="Enklere oppsett, ett API"
      />

      {/* FB-only */}
      <SocialFeedCarousel
        posts={fbOnly}
        title="Variant: kun Facebook"
        subtitle="Til sammenligning"
      />

      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          Mockup-side — ikke lenket fra navigasjonen.
        </div>
      </footer>
    </div>
  );
};

export default SosialtMock;