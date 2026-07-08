## Plan: IG Editor — text fixes, JSON import, examples, CI

### 1. Text-issue fixes (all templates × all aspect ratios)

Re-audit each template in headless Chromium at square/portrait/story, capture screenshots, then patch the specific issues found. Known / likely offenders from earlier passes:

- **schedule** — event rows can push the footnote past the safe area in portrait; time column wraps awkwardly on story.
- **welcome** — 3-column step grid gets cramped in story; step descs wrap into 3 lines and overflow card.
- **event** — meta row (3 pairs, 32px gap) overflows story; description sometimes clips against the meta divider.
- **pos101** — 4-item responsibility grid stays 2-col in story, forcing narrow columns that wrap items awkwardly.
- **nm / fact** — big display type has fixed 120/380px sizes that ignore aspect; clips edges in story.
- **matchup / game** — team-name lines and score/status can misalign vertically after fs overrides.
- **rule / rule2** — floating text box adjuster (added earlier) sometimes overlaps footer in portrait when body is short.
- **bts** — 96px title wraps into 3 lines with real content and covers photo caption gutter.

Fix pattern (already established): use shrink-to-fit hook + `min()` clamps on hard-coded px sizes so preview and export stay consistent per aspect. No template rewrites — only clamp/wrap fixes.

### 2. Import from JSON

- Add a small "Import JSON" button next to the existing export controls.
- Accepts either a paste (textarea modal) or a `.json` file upload.
- Auto-detect payload shape:
  - If shape matches a **single slide** (`{tpl, data, aspect?}`) → replace current slide (with confirm) or append.
  - If shape matches a **session export** (`{slides:[...], aspect?, ...}` — same shape the current export log emits) → replace `state.slides` and reset `currentSlide` to 0.
- Validate `tpl` against `T` keys, drop unknown fields safely, then re-render.

### 3. Example gallery + README + CI test

**Location** (matches your instruction — with the app source, not `public/`):

```text
src/make-ig-post/examples/
  README.md                    ← template docs (schema + preview)
  <template>/
    <template>.json            ← generic sample data (one slide)
    <template>-square.png
    <template>-portrait.png
    <template>-story.png
```

**Sample content:** generic, uses openly-available images (Unsplash / Wikimedia direct URLs) for `photo` / `logo` fields so the JSON is self-contained.

**README.md structure** (auto-generated per template):

- Template key + display label
- JSON schema (fields, types, defaults) derived from `T[tpl].fields`
- Embedded thumbnails of the 3 aspect exports
- Notes on fields with special behavior (list, figure, image, HTML-allowed)

**Regeneration script** (`scripts/gen-ig-examples.mjs`):

- Headless Chromium loads `editor.html` for each template, applies the sample JSON, exports square/portrait/story via the editor's own export pipeline, saves PNGs + JSON + rebuilds the README.
- Uses each template's default field values as the seed for the sample JSON (plus generic images).

**CI test** (`src/make-ig-post/examples/__tests__/examples.test.ts`):

- For every `tpl` in `T`, assert:
  - `<template>/<template>.json` exists and its `data` keys match the current `T[tpl].fields` id set (fails when a template gains/renames a field without updating the example).
  - Three PNGs exist and are non-empty.
  - README contains a section header for the template.
- Fast checks (no rendering) so the test suite stays snappy. Regeneration is a manual `npm run ig:examples` command referenced in the failure hint.

### 4. Documentation & self-updating

- Add a `## Maintenance` block to the README explaining: whenever you add/rename a field in a template, or add a new template, run `npm run ig:examples` and commit the resulting json/png diffs. The CI test enforces this.

### Deliverables (files touched)

- `public/make-ig-post/editor.html` — text clamps, import JSON UI + handler
- `public/make-ig-post/frames.css` — a few overflow/clamp rules
- `src/make-ig-post/examples/**` — 12 folders × (1 json + 3 png) + README
- `scripts/gen-ig-examples.mjs` — regeneration script
- `package.json` — `ig:examples` script
- `src/make-ig-post/examples/__tests__/examples.test.ts` — CI drift test

### Risks / decisions to confirm before I start

- Example PNG size: I'll export at the editor's native 1080px so they're usable as references but that adds ~1MB/template to the repo. If you'd rather have smaller thumbnails (e.g. 540px webp), say so. -> fine.
- CI-style test scope: strict (fails on field-set drift + file presence) but does **not** pixel-diff the PNGs (would be flaky across font/Chromium versions). Say if you want pixel-diff too. -> no pixel diff is fine.
- The example JSON's image URLs will point at Unsplash direct-download URLs. Those are stable-ish but not eternally guaranteed. Alternative: check a few tiny placeholder images into the repo. -> add to repo.