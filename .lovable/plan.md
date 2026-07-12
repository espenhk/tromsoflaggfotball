
## Goal

Let you edit copy on the four "simple" pages (front page, `/presse`, `/quiz`, `/posisjoner`) without going through chat — including dropping in ad‑hoc markdown sections on the front page — while keeping the current design intact.

## How hard is it?

Small. The site already has an admin area (`/admin`) behind a password gate, a database, and typed client bindings. There's no new infrastructure — one table, one edge function, one admin page, and small edits to the four target pages. Realistic scope: an afternoon.

## Concept

Two content shapes, both stored as rows in a `content_blocks` table:

1. **Named slots** — a fixed key that a specific page already renders (e.g. `home.hero.tagline`, `presse.about.body`, `quiz.intro`). Editing the row changes the text in place; nothing about layout moves.
2. **Free sections** — extra markdown blocks scoped to a page + placement anchor (e.g. `home:after-training`, `home:after-faq`). The page renders whatever free blocks exist for each anchor, in `sort_order`. This is how you "add a new section to the front page" without a code change.

Both are markdown; both render through the same component.

## Data model

```text
content_blocks
  id            uuid pk
  page          text     -- 'home' | 'presse' | 'quiz' | 'posisjoner'
  key           text     -- slot key OR anchor id for free sections
  kind          text     -- 'slot' | 'section'
  title         text     -- section heading (sections only, optional)
  body_md       text     -- markdown
  sort_order    int      -- ordering within an anchor
  visible       bool
  updated_at    timestamptz
  unique (page, key) where kind = 'slot'
```

RLS: public `SELECT` (so the site can read without auth); writes only via the admin edge function using the existing admin token — matches how `matches-admin` already works.

## Backend

- One migration to create the table + grants + policies.
- One edge function `content-admin` (mirrors `matches-admin`): verifies the admin session token, exposes `list`, `upsert`, `delete`, `reorder`.
- Public reads go straight through the typed Supabase client from the page components — no function needed.

## Admin UI

New route `/admin/content` (inside the existing `AdminGate`):

- Page selector: Home / Presse / Quiz / Posisjoner.
- **Slots** panel: fixed list of known keys for that page, each with a title, a markdown textarea, and a live preview. Save = upsert.
- **Sections** panel: list of free blocks grouped by anchor. Add / edit / reorder (up/down buttons) / hide / delete. Each has title + markdown body + anchor dropdown.
- Link card added to `/admin` index.

Editor is a plain `<textarea>` with a side-by-side rendered preview. No WYSIWYG.

## Rendering on the site

- New tiny hook `useContentBlocks(page)` that fetches all rows for a page once and caches them.
- New `<MdBlock md={...} />` component using `react-markdown` + `remark-gfm`, styled with the site's typography tokens (Tailwind `prose` variant tuned to the theme).
- Named slots: replace the current hard-coded string with `slot("home.hero.tagline") ?? "…default fallback…"`. The English/Norwegian dictionary stays authoritative when no CMS row exists, so the site never renders blank if you haven't touched a slot.
- Free sections: each target page gets a handful of `<SectionAnchor id="home:after-training" />` markers. The anchor renders every visible section row for that id, in order, using a standard section shell (heading + markdown body, matching the zebra-stripe pattern already in the codebase).

## Which slots to expose first

Minimal, high-value set — everything else stays as code until you ask:

- **Home:** hero tagline, "Dette er flaggfotball" intro paragraph, FAQ intro, footer brand line. Free-section anchors: `after-hero`, `after-training`, `after-positions`, `after-faq`.
- **Presse:** intro, about body, contact body. Free-section anchor: `end`.
- **Quiz:** intro, result footer. Free-section anchor: `end`.
- **Posisjoner:** page intro. Free-section anchor: `end`.

Bilingual: each slot/section row carries `body_md_no` and `body_md_en` (same for `title`), so the language toggle keeps working. Empty English falls back to Norwegian.

## Adding a section to the front page — the actual flow

1. Open `/admin/content`, pick **Home**.
2. Under **Sections**, click **New section**, pick anchor `after-training`, type a title, paste markdown into the body, save.
3. Reload the front page — the section is there, styled like the rest of the site.

## Technical details

- Deps: `react-markdown`, `remark-gfm` (both small, no config).
- Sanitization: `react-markdown` escapes HTML by default; we do not enable `rehype-raw`, so admin markdown can't inject scripts.
- Types: after the migration is approved, `src/integrations/supabase/types.ts` regenerates and the hook/page code lands.
- Caching: single fetch per page load; realtime is not needed at this scale.
- No changes to the IG editor, matches admin, training plans, or `/how-i-did-it`.

## Out of scope

- Image uploads (can add a storage bucket later if wanted).
- Draft/publish workflow, versioning, scheduled publishing.
- CMS-driven layout changes (reordering existing hard-coded sections, editing the field diagram, etc.).
- Non-simple pages: `/make-ig-post`, `/pameldinger`, `/how-i-did-it`, training plans, admin pages.
