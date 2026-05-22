import AdminGate from "@/components/AdminGate";

const MakeIgPost = () => {
  return (
    <AdminGate title="Instagram Frame Editor">
      {() => (
        <iframe
          src="/make-ig-post/editor.html"
          title="Instagram Frame Editor"
          style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: 0 }}
        />
      )}
    </AdminGate>
  );
};

export default MakeIgPost;