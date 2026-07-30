// Shared image library, same localStorage store the IG editor uses
// (public/make-ig-post/editor.html — key must stay in sync).
export const IMAGE_LIB_KEY = "tff-image-library-v1";

export type LibraryImage = {
  id: string;
  name: string;
  dataUrl: string;
  addedAt: number;
};

export function loadImageLibrary(): LibraryImage[] {
  try {
    const raw = localStorage.getItem(IMAGE_LIB_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveImageLibrary(arr: LibraryImage[]) {
  try {
    localStorage.setItem(IMAGE_LIB_KEY, JSON.stringify(arr));
  } catch (e) {
    alert("Kunne ikke lagre i biblioteket (fullt lager?): " + (e as Error).message);
  }
}

export function addToImageLibrary(name: string, dataUrl: string) {
  const arr = loadImageLibrary();
  arr.push({
    id: "img_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    dataUrl,
    addedAt: Date.now(),
  });
  saveImageLibrary(arr);
}

export function removeFromImageLibrary(id: string) {
  saveImageLibrary(loadImageLibrary().filter((x) => x.id !== id));
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

// Curated team accent swatches — mirrors MATCHUP_COLORS in the IG editor.
export const TEAM_COLORS: [string, string][] = [
  ["#38bdf8", "WR Blue"],
  ["#fb7185", "Defense Rose"],
  ["#fbbf24", "QB Yellow"],
  ["#34d399", "RB Green"],
  ["#fb923c", "Rusher Orange"],
  ["#54c59e", "Primary"],
  ["#a78bfa", "Violet"],
  ["#f0fcfa", "Is"],
];
