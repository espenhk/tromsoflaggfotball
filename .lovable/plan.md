
This is a large batch of features. Grouping into phases so we can ship in reviewable chunks. Confirm the whole plan (or trim it) before I start.

## 1. Site pages

### 1a. Position quiz — `/quiz` (public)
- 6 questions (NO+EN), lightweight, no backend. Result → suggested position + link into `/posisjoner#<slug>`.
- Style matches existing zebra sections. Question card with progress dots, animated transitions.
- Scoring: each answer weights the 7 positions in `src/data/positions.ts`; highest score wins, ties show top 2.
- Add nav link + a card on `/` linking to it.

### 1b. Press kit — `/presse` (public)
- Single long page: club blurb (NO+EN), key facts (founded, roster size, home venue, colors, contact), logo downloads (SVG+PNG from `src/assets/tuil-logo.svg`), color swatches with hex, typography spec, 4–6 photo thumbnails with "download all" (zip on the fly with `jszip`), press contact email.
- Add link in footer.

### 1c. i18n for `/posisjoner`, `/how-i-did-it`, FAQ
- All strings routed through `useT()` and `dictionaries.ts`.
- Existing `LanguageToggle` already handles switching; just extend the dictionary and swap literals.

## 2. IG editor — new templates
Under `public/make-ig-post/`:

- **`quote`** — big pull-quote with attribution + optional small photo. Fields: `quoteText`, `author`, `authorRole`, `photo`, `wm_right`.
- **`standings`** — league table. Fields: `title`, `subtitle`, `rows` (array: team, w, l, pf, pa, pts — up to 8 rows), `wm_right`. Renders as a semantic table styled to match `frames.css`.
- **`matchlist`** — list of games. Fields: `title`, `subtitle`, `rows` (array: date, time, home, away, venue, homeScore?, awayScore?). Rows with scores render as results; rows without render as upcoming (time+venue).

Add example JSON under `src/make-ig-post/examples/` + update `manifest.json`, and add to `renderPreview` in `editor.html`.

## 3. Matches datastore + "load from matches" picker

New table `matches` (Cloud):
```
id uuid pk, kicks_off_at timestamptz, venue text,
home_name text, home_tag text, home_logo text, home_color text, home_score int null,
away_name text, away_tag text, away_logo text, away_color text, away_score int null,
round_label text null, notes text null,
created_at, updated_at
```
- GRANT + RLS: `anon` SELECT (public schedule), `authenticated` full CRUD via admin gate (matches existing pattern; admin section is password-gated in-app, not by auth — so we'll gate writes to `service_role` only and expose an edge function `matches-admin` protected by `ADMIN_PASSWORD`, mirroring `list-signups`).

Admin CRUD page `/admin/matches`: table with add/edit/delete rows (date, teams, scores, venue).

IG editor: in the top bar of the `game` and `matchlist` templates, add a **"Load from matches"** button. Opens a modal listing matches (filter: upcoming / past / all), user ticks rows → for `game` it fills the currently-selected slide; for `matchlist` it appends the ticked rows to the `rows` field.

Also: on `/` we can optionally render an upcoming-matches strip later — not in this plan unless you want it.

## 4. IG editor — autosave, undo/redo, captions with export

- **Autosave**: debounce (800 ms) writes of the working state to a new `ig_post_drafts` row keyed by a local `draft_id` in localStorage. Restore prompt on load if a draft exists. Manual "Save draft as…" already isn't in scope — this is just crash-recovery autosave.
- **Undo/redo**: keep an in-memory ring buffer (max 100) of state snapshots. `Ctrl/Cmd+Z` / `Ctrl/Cmd+Shift+Z`. Toolbar buttons too. Snapshot on debounced change, not on every keystroke, to avoid noise.
- **Captions saved with export**: add a caption `<textarea>` in the export panel. On export, include `caption` in the `payload` written to `ig_post_exports`. Add a "Copy caption" button. Extend `ig_post_exports` with an optional `caption text` column (nullable, no default) via migration.

## Technical notes

- All new tables get GRANT + RLS in the same migration.
- No new secrets required; matches admin uses existing `ADMIN_PASSWORD`.
- New deps: `jszip` (press kit + potentially carousel zip export later).
- Undo/redo lives in the editor iframe; keep it self-contained in `editor.html`.
- i18n additions: extend `TranslationKey` union in `dictionaries.ts` and both `no`/`en` dicts.

## Suggested ship order (each is one turn)
1. Matches table + admin CRUD page + edge function
2. IG templates: `quote`, `standings`, `matchlist` (+ examples + manifest)
3. IG "Load from matches" picker for `game` and `matchlist`
4. IG autosave + undo/redo + captions-with-export (+ migration)
5. Position quiz page
6. Press kit page
7. i18n pass for `/posisjoner`, `/how-i-did-it`, FAQ

Reply "go" to start with #1, or tell me to reorder / drop items.
