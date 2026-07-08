import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

/**
 * Visual-regression / drift check.
 *
 * For every committed example under src/make-ig-post/examples/<tpl>/<tpl>.json
 * this test re-renders each aspect ratio via the live editor's headless API
 * (`window.__IG_EDITOR`) and pixel-diffs the result against the committed
 * PNG. A failure means a template's visual output has drifted from what was
 * last approved — either an intentional change that needs
 * `npm run ig:examples` to refresh baselines, OR a regression that needs
 * fixing before merge.
 *
 * The test needs the Vite dev server running on port 8080 AND Playwright's
 * bundled Chromium. If either is missing the test group is skipped rather
 * than failed, so it works in local dev without extra setup.
 */

const EXAMPLES_DIR = resolve(__dirname, "..");
const EDITOR_URL = "http://localhost:8080/make-ig-post/editor.html";
const ASPECTS = ["square", "portrait", "story"] as const;
// Max share of non-matching pixels tolerated per image (0..1).
// 1% covers font hinting / antialiasing differences between runs while
// still catching layout regressions.
const MAX_MISMATCH = 0.01;
// Where to dump the visual diff PNGs when a test fails, so a human can
// inspect the exact regions that changed.
const DIFF_OUT = resolve(__dirname, "__diffs__");

async function serverUp(): Promise<boolean> {
  try {
    const r = await fetch(EDITOR_URL, { method: "HEAD" });
    return r.ok;
  } catch {
    return false;
  }
}

// Dynamic import so this file doesn't blow up in envs without playwright.
async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

function loadPNG(path: string): PNG {
  return PNG.sync.read(readFileSync(path));
}

describe("IG editor examples — visual drift", async () => {
  const up = await serverUp();
  const pw = up ? await loadPlaywright() : null;
  if (!up || !pw) {
    it.skip("dev server + Playwright required (skipped)", () => {});
    return;
  }

  const { chromium } = pw;
  let browser: import("playwright").Browser;
  let page: import("playwright").Page;
  let templates: Array<{ key: string; fields: Array<{ id: string; default: unknown }> }>;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.new_context
      ? await (browser as any).new_context({ viewport: { width: 1400, height: 1800 } })
      : await browser.newContext({ viewport: { width: 1400, height: 1800 } });
    page = await ctx.newPage();
    await page.goto(EDITOR_URL, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("tff-ig-editor-state-v1"));
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(
      () => (window as any).__IG_EDITOR && (window as any).__IG_EDITOR.apiVersion,
      { timeout: 15000 }
    );
    templates = await page.evaluate(() => (window as any).__IG_EDITOR.listTemplates());
    mkdirSync(DIFF_OUT, { recursive: true });
  }, 60000);

  // We define tests dynamically per template/aspect based on committed examples.
  // Manifest snapshot is the source of truth for which templates exist.
  const manifest = JSON.parse(
    readFileSync(join(EXAMPLES_DIR, "manifest.json"), "utf8")
  ) as { templates: Record<string, unknown> };
  const keys = Object.keys(manifest.templates);

  for (const key of keys) {
    describe(`template: ${key}`, () => {
      for (const asp of ASPECTS) {
        it(
          `${asp} matches committed baseline (≤${MAX_MISMATCH * 100}% mismatched pixels)`,
          async () => {
            const jsonPath = join(EXAMPLES_DIR, key, `${key}.json`);
            const baselinePath = join(EXAMPLES_DIR, key, `${key}-${asp}.png`);
            if (!existsSync(jsonPath) || !existsSync(baselinePath)) {
              throw new Error(`Missing example/baseline for ${key}/${asp} — run \`npm run ig:examples\`.`);
            }
            const payload = JSON.parse(readFileSync(jsonPath, "utf8"));
            await page.evaluate((p) => (window as any).__IG_EDITOR.loadPayload(p), payload);
            await page.evaluate((a) => (window as any).__IG_EDITOR.setAspect(a), asp);
            await page.waitForTimeout(500);
            const b64 = await page.evaluate(
              () => (window as any).__IG_EDITOR.exportCurrentAsBase64()
            );
            const freshBuf = Buffer.from(b64, "base64");
            const fresh = PNG.sync.read(freshBuf);
            const baseline = loadPNG(baselinePath);
            if (fresh.width !== baseline.width || fresh.height !== baseline.height) {
              throw new Error(
                `Dimension mismatch for ${key}/${asp}: baseline ${baseline.width}x${baseline.height} vs fresh ${fresh.width}x${fresh.height}`
              );
            }
            const diff = new PNG({ width: fresh.width, height: fresh.height });
            const mismatched = pixelmatch(
              baseline.data,
              fresh.data,
              diff.data,
              fresh.width,
              fresh.height,
              { threshold: 0.1 }
            );
            const ratio = mismatched / (fresh.width * fresh.height);
            if (ratio > MAX_MISMATCH) {
              const diffPath = join(DIFF_OUT, `${key}-${asp}-diff.png`);
              const freshPath = join(DIFF_OUT, `${key}-${asp}-fresh.png`);
              writeFileSync(diffPath, PNG.sync.write(diff));
              writeFileSync(freshPath, freshBuf);
              throw new Error(
                `${key}/${asp} drifted ${(ratio * 100).toFixed(2)}% (>${MAX_MISMATCH * 100}%). ` +
                  `See ${diffPath} and ${freshPath}. If intentional, run \`npm run ig:examples\`.`
              );
            }
            expect(ratio).toBeLessThanOrEqual(MAX_MISMATCH);
          },
          60000
        );
      }
    });
  }
});