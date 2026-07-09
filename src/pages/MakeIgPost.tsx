import { useTheme } from "@/theme/ThemeProvider";

const MakeIgPost = () => {
  // Use `selectedTheme` (admin choice, synced from backend) rather than the
  // effective `theme` — the effective one lags behind on first paint while
  // the reveal animation resolves, which meant the editor sometimes loaded
  // with the default palette even when TUIL was selected.
  const { selectedTheme } = useTheme();
  const src = `/make-ig-post/editor.html${selectedTheme === "tuil" ? "?theme=tuil" : ""}`;
  return (
    <iframe
      key={selectedTheme}
      src={src}
      title="Instagram Frame Editor"
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
    />
  );
};

export default MakeIgPost;