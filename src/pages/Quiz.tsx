import { Link } from "react-router-dom";
import { ContentBlocksProvider, useContentBlocks } from "@/hooks/useContentBlocks";
import { useLang } from "@/i18n/LanguageProvider";
import { getVariant } from "@/cms/variants";

const QuizInner = () => {
  const { lang } = useLang();
  const { blocks, loaded } = useContentBlocks();
  const sections = blocks
    .filter((b) => b.kind === "section")
    .sort((a, b) => a.sort_order - b.sort_order);
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 pt-16 pb-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
          ← {lang === "no" ? "Tilbake" : "Back"}
        </Link>
      </div>
      {loaded && sections.map((s) => {
        const V = getVariant(s.variant);
        return <V.render key={s.id} {...s} />;
      })}
    </main>
  );
};

const Quiz = () => (
  <ContentBlocksProvider page="quiz">
    <QuizInner />
  </ContentBlocksProvider>
);

export default Quiz;