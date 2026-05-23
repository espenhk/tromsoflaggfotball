import { useTheme } from "@/theme/ThemeProvider";

const MakeIgPost = () => {
  const { theme } = useTheme();
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