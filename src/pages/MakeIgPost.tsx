import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Fetch the globally-configured site theme directly from the backend so the
// editor iframe loads with the correct palette on first paint. Relying on the
// ThemeProvider's cached `selectedTheme` meant admins hitting the page fresh
// (or from a browser where localStorage still said "default") saw the old
// palette until the provider synced.
const MakeIgPost = () => {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("site_settings")
      .select("theme")
      .eq("id", "global")
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        setTheme((data?.theme as string | undefined) ?? "default");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (theme === null) {
    return <div style={{ position: "fixed", inset: 0, background: "#0b0f14" }} />;
  }
  const src = `/make-ig-post/editor.html${theme === "tuil" ? "?theme=tuil" : ""}`;
  return (
    <iframe
      key={theme}
      src={src}
      title="Instagram Frame Editor"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
};

export default MakeIgPost;