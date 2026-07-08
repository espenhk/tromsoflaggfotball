#!/usr/bin/env python3
"""
Regenerate the IG-editor template examples.

For each template exposed by `window.__IG_EDITOR.listTemplates()`, this script:

  1. Builds a "generic" single-slide JSON payload by copying the template's
     current defaults and layering in a small per-template extras map
     (placeholder photo/logo URLs, plus a handful of pre-canned image
     scales) — see EXTRAS below.
  2. Loads that JSON into the running editor via the headless-mode API.
  3. Exports the tile at square, portrait, and story aspects using the
     exact same pipeline the human "Export PNG" button uses.
  4. Writes:
       src/make-ig-post/examples/<tpl>/<tpl>.json
       src/make-ig-post/examples/<tpl>/<tpl>-{square,portrait,story}.png
     …and rebuilds the top-level README.md with one section per template
     (schema derived from the live field definitions).
  5. Writes a manifest.json snapshot of every field id per template so the
     CI drift test can compare against the current editor.

Requires the Vite dev server to be running at http://localhost:8080/.
Run with:  npm run ig:examples
"""
import asyncio
import base64
import json
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "src" / "make-ig-post" / "examples"
EDITOR_URL = "http://localhost:8080/make-ig-post/editor.html"

# Per-template overlay applied on top of each template's defaults. Values are
# either replacements for `values.<id>` (top-level image-field replacements go
# here) or reserved keys that map to slide-root fields:
#     __photo:          slide.photo (data URL or absolute URL)
#     __photoCutout:    slide.photoCutout
#     __imageScales:    slide.imageScales
#     __chrome:         slide.chrome
#     __accent:         slide.accent
#
# Keep this map minimal — the point is that changes to a template's own
# defaults automatically propagate to the example without editing this file.
IMG = "http://localhost:8080/make-ig-post/examples-assets/"
EXTRAS = {
    "player":  {"__photo": IMG + "ig-ex-player.jpg"},
    "pos101":  {},
    "schedule":{},
    "event":   {"__photo": IMG + "ig-ex-event.jpg"},
    "nm":      {},
    "welcome": {},
    "bts":     {"__photo": IMG + "ig-ex-candid.jpg"},
    "fact":    {},
    "rule":    {},
    "drill":   {},
    "matchup": {
        "oPhoto": IMG + "ig-ex-athlete-a.jpg",
        "dPhoto": IMG + "ig-ex-athlete-b.jpg",
    },
    "game": {
        "hLogo": IMG + "ig-ex-logo-a.png",
        "aLogo": IMG + "ig-ex-logo-b.png",
    },
}

ASPECTS = ["square", "portrait", "story"]


def build_payload(tpl_meta, extras):
    values = {}
    for f in tpl_meta["fields"]:
        values[f["id"]] = f["default"]
    payload = {
        "tpl": tpl_meta["key"],
        "chrome": extras.get("__chrome", "curve"),
        "accent": extras.get("__accent", "primary"),
        "photo": extras.get("__photo"),
        "photoCutout": bool(extras.get("__photoCutout")),
        "imageScales": extras.get("__imageScales", {}),
        "values": values,
    }
    # Overlay any values-level extras (e.g. oPhoto, dPhoto).
    for k, v in extras.items():
        if k.startswith("__"):
            continue
        if k in values:
            values[k] = v
    return payload


def render_readme(templates_meta):
    lines = [
        "# Instagram post templates",
        "",
        "Reference examples for every template exposed by the Instagram frame editor.",
        "Each subfolder contains a generic example JSON plus the three rendered PNG",
        "aspect ratios (square 1080×1080, portrait 1080×1350, story 1080×1920).",
        "",
        "**Regenerate:** `npm run ig:examples` — this rewrites every JSON, PNG, and",
        "this README from the current template definitions in `editor.html`. Do it",
        "whenever you add, rename, or remove a template field (the CI test in",
        "`__tests__/examples.test.ts` will otherwise fail).",
        "",
        "**Visual regression:** `__tests__/pixel-diff.test.ts` re-renders every",
        "committed example through the live editor and pixel-diffs the result",
        "against the checked-in PNG (≤1% mismatched pixels tolerated). If a",
        "template's rendering changes intentionally, refresh the baselines with",
        "`npm run ig:examples`. Otherwise investigate the drift before merging.",
        "The test needs the Vite dev server running on `:8080` and a Playwright",
        "Chromium binary — it skips gracefully when either is missing.",
        "",
        "The example JSON is also directly consumable by the editor's",
        "**Import from JSON** button.",
        "",
        "## Templates",
        "",
    ]
    for tpl in templates_meta:
        key = tpl["key"]
        lines.append(f"### `{key}` — {tpl['label']}")
        lines.append("")
        lines.append("| Field | Type | Default |")
        lines.append("| --- | --- | --- |")
        for f in tpl["fields"]:
            default_repr = json.dumps(f["default"], ensure_ascii=False)
            if len(default_repr) > 80:
                default_repr = default_repr[:77] + "…"
            default_repr = default_repr.replace("|", "\\|")
            lines.append(f"| `{f['id']}` | {f['type']} | `{default_repr}` |")
        lines.append("")
        lines.append(f"Example JSON: [`{key}/{key}.json`]({key}/{key}.json)")
        lines.append("")
        for asp in ASPECTS:
            lines.append(f"![{key} {asp}]({key}/{key}-{asp}.png)")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


async def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()
        # Wipe persisted state so we start clean each run.
        await page.goto("http://localhost:8080/make-ig-post/editor.html", wait_until="domcontentloaded")
        await page.evaluate("localStorage.removeItem('tff-ig-editor-state-v1')")
        await page.reload(wait_until="networkidle")
        await page.wait_for_function("window.__IG_EDITOR && window.__IG_EDITOR.apiVersion")
        templates = await page.evaluate("window.__IG_EDITOR.listTemplates()")
        manifest = {"templates": {}}
        for tpl in templates:
            key = tpl["key"]
            extras = EXTRAS.get(key, {})
            payload = build_payload(tpl, extras)
            tpl_dir = OUT_DIR / key
            tpl_dir.mkdir(parents=True, exist_ok=True)
            (tpl_dir / f"{key}.json").write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            manifest["templates"][key] = {
                "label": tpl["label"],
                "fields": [f["id"] for f in tpl["fields"]],
            }
            for asp in ASPECTS:
                print(f"[{key}] rendering {asp}…", flush=True)
                await page.evaluate("(p) => window.__IG_EDITOR.loadPayload(p)", payload)
                await page.evaluate("(a) => window.__IG_EDITOR.setAspect(a)", asp)
                # Give any post-load fit hooks a moment.
                await page.wait_for_timeout(400)
                b64 = await page.evaluate("() => window.__IG_EDITOR.exportCurrentAsBase64()")
                (tpl_dir / f"{key}-{asp}.png").write_bytes(base64.b64decode(b64))
        await browser.close()

    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (OUT_DIR / "README.md").write_text(render_readme(templates), encoding="utf-8")
    print(f"Wrote {len(templates)} templates × {len(ASPECTS)} aspects to {OUT_DIR}", flush=True)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:  # noqa: BLE001
        print("ERROR:", e, file=sys.stderr)
        sys.exit(1)