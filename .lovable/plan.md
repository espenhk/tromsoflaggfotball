## Goal

Replace the current "slots + anchors" model with a single ordered list of sections per page. Every section — whether it comes from code (Hero, Treninger, FAQ, Field diagram…) or from the database — appears as one row in the admin, and can be reordered / have new custom sections inserted between any two rows. Custom sections can be more than plain markdown: multi-field templates (e.g. training time + location), maps, image cards, etc.

## Data model

Extend `content_blocks`:

- `kind` becomes: `"code"` (placeholder marker) | `"markdown"` | `"fields"` (typed record) | `"map"` | `"image"` (extensible).
- Add `variant text` (e.g. `"training-info"`, `"map-basic"`, `"image-hero"`) so multiple typed templates can share `kind = "fields"`.
- Add `data jsonb` for structured content (map coords, field values, image URLs). Markdown stays in `body_md_no` / `body_md_en`.
- Keep `sort_order int` as the single ordering axis per `page`. Drop the anchor semantics on `key` — `key` becomes a stable slug (`"hero"`, `"training-info"`, `"custom-abc123"`) used only for referencing code sections.
- Seed one row per code-defined section per page with `kind = "code"` and the right `sort_order`, so ordering is stored uniformly.

Migration also: unique `(page, key)` for code/slot rows; free rows use generated keys.

## Rendering

`useContentBlocks` returns the ordered list for the page. New helper:

```tsx
<PageSections page="home">
  {(block) => {
    if (block.kind === "code") return CODE_SECTIONS.home[block.key];
    if (block.kind === "markdown") return <MarkdownSection block={block} />;
    if (block.kind === "fields") return <FieldsSection block={block} />;
    if (block.kind === "map") return <MapSection block={block} />;
    if (block.kind === "image") return <ImageSection block={block} />;
  }}
</PageSections>
```

Each page (`Index`, `PressKit`, `Quiz`, `Posisjoner`) exposes a `CODE_SECTIONS` map keyed by slug, mapping to the existing JSX for that native section. The page body becomes a single `<PageSections>` render — the zebra `<div className="zebra">` wrapper stays, so alternating backgrounds keep working automatically regardless of insertions.

Hero-tagline-style slots become `kind = "fields"` rows with a `hero-tagline` variant instead of the old `useSlot` API. `useSlot` is removed.

## Section variants (initial set)

Registry in `src/cms/variants.ts`:

- `markdown` — bilingual markdown, current renderer.
- `fields:training-info` — fields: `weekday`, `time`, `location`, `map_url`, `notes_md`.
- `fields:hero-tagline` — fields: `tagline_no`, `tagline_en`.
- `map:basic` — fields: `lat`, `lng`, `zoom`, `label`. Renders an embedded Leaflet/OSM iframe.
- `image:card` — fields: `image_url`, `alt`, `caption_no`, `caption_en`.

Each variant declares: label, editor field list (with types: text, textarea, markdown, number, url), and a React renderer. Adding a new variant later = one file entry.

## Admin UI

New `/admin/content` layout:

- Page tabs unchanged.
- Single vertical list of every row for that page, sorted by `sort_order`.
- Each row shows: drag handle, variant label (e.g. "Treninger (code)", "Markdown", "Training info"), title preview, and actions: edit, hide/show, delete (code rows: only reorder + hide).
- Between every pair of rows: `+ Insert here` button → menu of variants → new row created with `sort_order = midpoint` of neighbours.
- Reordering: drag-and-drop (dnd-kit) OR up/down buttons. Save reorder = bulk `sort_order` update via edge function.
- Edit panel adapts to the variant's field list (rendered from the registry).

## Edge function

`content-admin` gains:

- Accept new fields `variant`, `data`.
- New action `reorder`: takes `{ page, order: [{id, sort_order}, ...] }`, updates in a transaction.
- `list` returns everything (including `code` rows) ordered by `sort_order`.

## Migration path

1. Migration: add `variant text`, `data jsonb default '{}'`, allow new `kind` values, seed `code` rows for existing native sections on all four pages with sensible `sort_order` values (10, 20, 30, …).
2. Move existing markdown rows (`kind = "section"`) into the new model as `kind = "markdown"`, recomputing `sort_order` so they land right after their old anchor.
3. Convert existing slot rows: `hero.tagline` → `fields:hero-tagline` row at the top; `intro` → `markdown` row at the top of subpages.

## Files touched

- `supabase/migrations/*` — schema + data migration.
- `supabase/functions/content-admin/index.ts` — variant/data support + `reorder`.
- `src/cms/variants.ts` (new) — variant registry + renderers.
- `src/hooks/useContentBlocks.tsx` — new `PageSections` component; drop `SectionAnchor`, `useSlot`.
- `src/pages/AdminContent.tsx` — rewritten as a single ordered list with insert-between + drag reorder.
- `src/pages/Index.tsx`, `PressKit.tsx`, `Quiz.tsx`, `Posisjoner.tsx` — expose `CODE_SECTIONS`, render via `<PageSections>`.

## Open questions

1. **Drag-and-drop or up/down arrows?** Drag is nicer but pulls in `@dnd-kit/*`. Arrows are zero-dep and enough for a low-frequency admin task. -> arrows.
2. **Initial extra variants beyond markdown** — is `training-info`, `map:basic`, `image:card` the right starter set, or do you have specific ones in mind (schedule table, coach card, video embed…)? -> those suggested and video embed.
3. **Code sections editable at all?** Proposed: only reorder + hide/show. Editing their content stays in code. OK? Explain this question.