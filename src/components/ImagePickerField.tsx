import { useRef, useState } from "react";
import {
  LibraryImage,
  addToImageLibrary,
  loadImageLibrary,
  readFileAsDataUrl,
  removeFromImageLibrary,
} from "@/lib/imageLibrary";

const LibraryModal = ({
  onPick,
  onClose,
}: {
  onPick: (dataUrl: string) => void;
  onClose: () => void;
}) => {
  const [items, setItems] = useState<LibraryImage[]>(() => loadImageLibrary());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | null) => {
    for (const f of Array.from(files ?? [])) {
      const dataUrl = await readFileAsDataUrl(f);
      addToImageLibrary(f.name.replace(/\.[^.]+$/, ""), dataUrl);
    }
    setItems(loadImageLibrary());
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-background border border-border rounded-lg p-5 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <h4 className="font-display text-lg flex-1">Bildebibliotek</h4>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-sm px-3 py-1.5 rounded border border-border hover:bg-muted"
          >
            Last opp
          </button>
          <button onClick={onClose} className="text-sm px-3 py-1.5 rounded border border-border hover:bg-muted">
            Lukk
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => upload(e.target.files)}
          />
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Biblioteket er tomt. Last opp et bilde her eller lagre et fra IG-editoren.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {items.map((it) => {
                const on = selectedId === it.id;
                return (
                  <div key={it.id} className="relative group">
                    <button
                      onClick={() => setSelectedId(on ? null : it.id)}
                      onDoubleClick={() => { onPick(it.dataUrl); onClose(); }}
                      aria-pressed={on}
                      className={`w-full aspect-square rounded border bg-muted bg-contain bg-center bg-no-repeat transition ${
                        on
                          ? "border-primary ring-2 ring-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
                          : "border-border hover:border-primary/60"
                      }`}
                      style={{ backgroundImage: `url(${it.dataUrl})` }}
                      title={it.name}
                    />
                    <span className="block mt-1 text-[10px] text-muted-foreground truncate">{it.name}</span>
                    <button
                      onClick={() => {
                        if (!confirm("Slette dette bildet fra biblioteket?")) return;
                        removeFromImageLibrary(it.id);
                        if (on) setSelectedId(null);
                        setItems(loadImageLibrary());
                      }}
                      className="absolute top-1 right-1 hidden group-hover:block rounded bg-destructive text-destructive-foreground text-[10px] px-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="sticky bottom-0 -mx-5 -mb-5 mt-5 flex items-center gap-3 border-t border-border bg-background px-5 py-3">
              <span className="flex-1 text-xs text-muted-foreground truncate">
                {selectedId
                  ? `Valgt: ${items.find((x) => x.id === selectedId)?.name ?? ""}`
                  : "Trykk på et bilde for å velge"}
              </span>
              <button
                onClick={onClose}
                className="text-sm px-3 py-1.5 rounded border border-border hover:bg-muted"
              >
                Avbryt
              </button>
              <button
                disabled={!selectedId}
                onClick={() => {
                  const it = items.find((x) => x.id === selectedId);
                  if (!it) return;
                  onPick(it.dataUrl);
                  onClose();
                }}
                className="text-sm px-4 py-1.5 rounded bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-40"
              >
                Bruk bildet
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ImagePickerField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    const dataUrl = await readFileAsDataUrl(f);
    onChange(dataUrl);
    if (confirm("Lagre bildet i biblioteket også?")) {
      addToImageLibrary(f.name.replace(/\.[^.]+$/, ""), dataUrl);
    }
  };

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {value ? (
          <img src={value} alt="" className="h-9 w-9 rounded border border-border object-contain bg-muted" />
        ) : (
          <div className="h-9 w-9 rounded border border-dashed border-border" />
        )}
        <input
          type="text"
          value={value ?? ""}
          placeholder="URL eller velg fra bibliotek"
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 rounded-md bg-background border border-border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
        >
          📚 Bibliotek
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
        >
          ⬆ Last opp
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
          >
            Fjern
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
      </div>
      {open && <LibraryModal onPick={onChange} onClose={() => setOpen(false)} />}
    </label>
  );
};

export default ImagePickerField;
