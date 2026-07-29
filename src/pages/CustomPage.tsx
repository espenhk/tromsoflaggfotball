import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/i18n/LanguageProvider";
import { customPageId } from "@/cms/manifest";
import { ContentBlocksProvider, AllSections } from "@/hooks/useContentBlocks";
import NotFound from "./NotFound";

type PageRow = { slug: string; title_no: string; title_en: string | null; visible: boolean };

const CustomPage = () => {
  const { slug = "" } = useParams();
  const { lang } = useLang();
  const [row, setRow] = useState<PageRow | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    (async () => {
      const { data } = await supabase
        .from("cms_pages")
        .select("slug,title_no,title_en,visible")
        .eq("slug", slug)
        .eq("visible", true)
        .maybeSingle();
      if (!cancelled) {
        setRow((data as PageRow | null) ?? null);
        setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (row) document.title = lang === "en" ? (row.title_en || row.title_no) : row.title_no;
  }, [row, lang]);

  if (loaded && !row) return <NotFound />;

  const title = row ? (lang === "en" ? (row.title_en || row.title_no) : row.title_no) : "";

  return (
    <ContentBlocksProvider page={customPageId(slug)}>
      <div className="min-h-screen bg-background">
        <nav
          className="sticky top-0 z-50 backdrop-blur-md border-b border-white/20"
          style={{ backgroundColor: "hsl(3 79% 49%)" }}
        >
          <div className="max-w-4xl mx-auto px-6 flex items-center gap-3 py-3">
            <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <BrandLogo variant="mark" whiteMark alt="Logo" className="h-6 w-auto" />
            </Link>
            <h1 className="font-heading font-medium text-white text-sm uppercase tracking-wide">{title}</h1>
          </div>
        </nav>

        <main className="zebra">
          <AllSections />
        </main>
      </div>
    </ContentBlocksProvider>
  );
};

export default CustomPage;