import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  LibraryImage,
  addToImageLibrary,
  loadImageLibrary,
  readFileAsDataUrl,
  removeManyFromImageLibrary,
  renameImageInLibrary,
} from "@/lib/imageLibrary";

const AdminLibrary = () => {
  const [items, setItems] = useState<LibraryImage[]>(() => loadImageLibrary());
  const [selected, setSelected] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    setItems(loadImageLibrary());
    setSelected([]);
  };

  const upload = async (files: FileList | File[] | null) => {
    for (const f of Array.from(files ?? [])) {
      if (!f.type.startsWith("image/")) continue;
      const dataUrl = await readFileAsDataUrl(f);
      addToImageLibrary(f.name.replace(/\.[^.]+$/, ""), dataUrl);
    }
    refresh();
  };

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const deleteSelected = () => {
    if (!selected.length) return;
    if (!confirm(`Slette ${selected.length} bilde(r) fra biblioteket?`)) return;
    removeManyFromImageLibrary(selected);
    refresh();
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary">
          ← Admin
        </Link>
        <h1 className="font-display text-4xl md:text-5xl mt-3 mb-2">Bildebibliotek</h1>
        <p className="text-muted-foreground mb-8">
          Bilder her kan brukes i Instagram-editoren og på kampsidene. Lagres lokalt i denne nettleseren.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void upload(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"
          }`}
        >
          <p className="font-medium">Dra og slipp bilder her</p>
          <p className="text-sm text-muted-foreground mt-1">eller trykk for å velge filer</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void upload(e.target.files)}
          />
        </div>

        <div className="flex items-center gap-3 mt-6 mb-4">
          <span className="text-sm text-muted-foreground flex-1">
            {items.length} bilde{items.length === 1 ? "" : "r"}
            {selected.length > 0 && ` · ${selected.length} valgt`}
          </span>
          {selected.length > 0 && (
            <>
              <button
                onClick={() => setSelected([])}
                className="text-sm px-3 py-1.5 rounded border border-border hover:bg-muted"
              >
                Nullstill valg
              </button>
              <button
                onClick={deleteSelected}
                className="text-sm px-3 py-1.5 rounded bg-destructive text-destructive-foreground font-medium hover:opacity-90"
              >
                Slett valgte
              </button>
            </>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Biblioteket er tomt.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((it) => {
              const on = selected.includes(it.id);
              return (
                <div key={it.id} className="flex flex-col gap-1">
                  <button
                    onClick={() => toggle(it.id)}
                    className={`w-full aspect-square rounded-md border bg-muted bg-contain bg-center bg-no-repeat transition ${
                      on
                        ? "border-primary ring-2 ring-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
                        : "border-border hover:border-primary/60"
                    }`}
                    style={{ backgroundImage: `url(${it.dataUrl})` }}
                    title={it.name}
                    aria-pressed={on}
                  />
                  <input
                    value={it.name}
                    onChange={(e) => {
                      renameImageInLibrary(it.id, e.target.value);
                      setItems(loadImageLibrary());
                    }}
                    className="w-full rounded bg-background border border-border px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminLibrary;
