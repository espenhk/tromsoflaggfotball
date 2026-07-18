# CMS expansion: field diagram + position lists + audit

## 1. Audit of non-front pages

What's already CMS-flexible today: `presse` (intro/about/facts/logos/colors/typography/contact — all have `<AfterSection>` slots), `posisjoner` (intro/field/offense/defense), `quiz` (fully DB-driven).

What can move from hard-coded TSX to a CMS variant, per page:

- **Posisjoner** — the two hard-coded position lists (`offensePositions.map(...)` / `defensePositions.map(...)`) and the two `FieldDiagram` embeds (fullscreen + inline) are still in TSX. These become variants (see §2, §3).
- **How I did it** — the whole page is one giant hard-coded FAQ-ish list of expandable sections. Out of scope for this turn; noted for a future pass. Doesn't fit the new variants.
- **PressKit** — the header/intro/contact are already overridable via `useSlot` + `AfterSection`. The remaining hard-coded blocks (`about`, `facts`, `logos`, `colors`, `typography`) are brand-guideline content that is unlikely to change often; leaving them as-is unless you want them CMS-editable too.
- **Front page** — biggest opportunity is the `GameSection` (`#spillet`): quiz prompt, two position lists, `FieldDiagram`. This turn converts the diagram + lists into CMS variants; the surrounding section stays as code.

Result: this turn adds two new variants (`field-diagram`, `position-list`) and wires them into `home#spillet` and `posisjoner`.

## 2. New variant: `field-diagram`

Renders `<FieldDiagram>` with CMS-configurable overrides.

Editable in admin:
- Variant preset: `classic` (short 30-yd field, front-page style) or `simple` (full 70-yd field, posisjoner style).
- Fullscreen toggle (posisjoner-style edge-to-edge).
- Which side is shown by default (offense/defense tab).
- Optional **custom formation**: list of players with `{ id, label, side, color, topYd, left }`. When empty, fall back to the built-in formation for the chosen tab.
- Optional **routes**: list of route paths, each with `{ playerId, color, points: [{x, yYd}, …] }`. When present they replace the built-in play arrows.
- Optional title.

Implementation:
- Refactor `FieldDiagram` to accept `customPlayers?` and `customRoutes?` props that override the built-in `baseOffense`/`defenseFor` and `passPlays`/`runPlays` when provided.
- Add `field-diagram` to `VariantKey`, `VARIANTS`, `VARIANT_ORDER`.
- New editor field types (reused from existing `list` support): players list + routes list, with a `points` sub-list of `{x,yYd}` pairs. Points are entered as numeric inputs — no visual drag editor in this turn (called out below).

Use it on:
- **Front page** — replace the two `<FieldDiagram/>` in `GameSection` with `<AfterSection after="spillet-field" />`, and seed one `field-diagram` DB row with the current classic defaults.
- **Posisjoner** — replace the fullscreen and the inline `<FieldDiagram/>` with `<AfterSection after="field" />` slots, seeded with two `field-diagram` rows (fullscreen simple + inline simple).

## 3. New variant: `position-list`

Renders a grid of position cards using entries from `@/data/positions` (`offensePositions` / `defensePositions`). CMS controls which subset and how it's laid out — the position data itself stays in code (icons, images, copy, i18n keys are tightly coupled to code).

Editable in admin:
- Side: `offense` | `defense` | `custom`.
- If `custom`: multi-select of position slugs (list of `{ position: <slug> }`).
- Layout: `grid` (default, current front-page look) or `stack` (posisjoner-style expandable rows).
- Optional heading override.

Implementation:
- Add `position-list` to variants; renderer imports the same `PositionCard` used by `Index.tsx` (extract it to `src/components/PositionCard.tsx`) and the `PositionRow` from `Posisjoner.tsx` (extract to `src/components/PositionRow.tsx`).
- On **Posisjoner**, replace `offensePositions.map(PositionRow)` and `defensePositions.map(PositionRow)` with `AfterSection` slots seeded with two `position-list` rows (`stack`, offense/defense).
- Front-page position lists stay in `GameSection` code for this turn (they're tightly interwoven with the two-column layout around the diagram). Optional follow-up if you also want them movable.

## 4. Data / migration

- No schema change — everything fits in `content_blocks.data` (jsonb).
- Seed rows via `supabase--insert`:
  - `home` / `spillet-field` — one `field-diagram` (classic).
  - `posisjoner` / `field-fullscreen` — one `field-diagram` (simple, fullscreen).
  - `posisjoner` / `field-inline` — one `field-diagram` (simple, inline).
  - `posisjoner` / `offense-list` — one `position-list` (stack, offense).
  - `posisjoner` / `defense-list` — one `position-list` (stack, defense).
- Manifest gets a new sub-anchor `spillet-field` on `home` and reworked ordering on `posisjoner`.

## 5. Known limits (explicit, so we don't over-scope)

- Route/formation editing is numeric (topYd, left%, x, yYd) — no visual drag editor. Fine for occasional tweaks; a canvas editor is a separate project.
- HowIDidIt page is left as-is (no natural fit for the new variants).
- Front-page position lists stay in code; only the diagram there moves to CMS.
- Position data (names, taglines, images, skills) stays code-managed — the CMS chooses which positions to show and how.

## Files touched

```text
src/cms/manifest.ts               (add spillet-field anchor, tweak posisjoner)
src/cms/variants.tsx              (add 2 variants + render)
src/components/FieldDiagram.tsx   (accept custom players/routes props)
src/components/PositionCard.tsx   (new; extracted from Index)
src/components/PositionRow.tsx    (new; extracted from Posisjoner)
src/pages/Index.tsx               (replace FieldDiagram with AfterSection)
src/pages/Posisjoner.tsx          (replace lists+diagrams with AfterSections)
```

Plus a data-seed insert for the 5 rows above.
