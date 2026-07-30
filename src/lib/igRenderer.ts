import type { IgExportPayload } from "@/lib/igExports";

type EditorApi = {
  apiVersion: number;
  loadPayload: (payload: unknown) => Promise<void>;
  setAspect: (aspect: string) => Promise<void>;
  exportCurrentAsBase64: () => Promise<string>;
};

/**
 * Off-screen renderer: boots one hidden copy of the IG editor (in ?render=1
 * mode, so it never touches the working state saved in localStorage) and uses
 * its headless API to rasterize slides to PNG. Calls are queued so only one
 * render runs at a time.
 */
export class IgRenderer {
  private iframe: HTMLIFrameElement | null = null;
  private ready: Promise<EditorApi> | null = null;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private theme: string = "default") {}

  private boot(): Promise<EditorApi> {
    if (this.ready) return this.ready;
    this.ready = new Promise<EditorApi>((resolve, reject) => {
      const iframe = document.createElement("iframe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.cssText =
        "position:fixed;left:-10000px;top:0;width:1200px;height:1400px;border:0;opacity:0;pointer-events:none;";
      const qs = new URLSearchParams({ render: "1" });
      if (this.theme === "tuil") qs.set("theme", "tuil");
      iframe.src = `/make-ig-post/editor.html?${qs.toString()}`;
      iframe.onload = () => {
        const start = Date.now();
        const poll = () => {
          const api = (iframe.contentWindow as unknown as { __IG_EDITOR?: EditorApi })?.__IG_EDITOR;
          if (api) return resolve(api);
          if (Date.now() - start > 20000) return reject(new Error("Editor svarte ikke"));
          setTimeout(poll, 100);
        };
        poll();
      };
      iframe.onerror = () => reject(new Error("Kunne ikke laste editoren"));
      document.body.appendChild(iframe);
      this.iframe = iframe;
    });
    return this.ready;
  }

  /** Renders one slide of a payload and returns a PNG data URL. */
  render(payload: IgExportPayload, slideIndex = 0): Promise<string> {
    const run = async () => {
      const api = await this.boot();
      const slides = payload.slides ?? [];
      const slide = slides[slideIndex];
      if (!slide) throw new Error("Ingen slide");
      await api.loadPayload({
        aspect: payload.aspect || "square",
        topEndZone: !!payload.topEndZone,
        currentSlide: 0,
        slides: [slide],
      });
      if (payload.aspect) await api.setAspect(payload.aspect);
      const b64 = await api.exportCurrentAsBase64();
      return `data:image/png;base64,${b64}`;
    };
    const next = this.queue.then(run, run);
    this.queue = next.catch(() => undefined);
    return next;
  }

  destroy() {
    this.iframe?.remove();
    this.iframe = null;
    this.ready = null;
  }
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
