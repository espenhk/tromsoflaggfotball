## Instagram editor

### 1. Placeholder-style defaults + required validation

- Move every field's current `default` string into a new `placeholder` property in each template's `fields` config in `public/make-ig-post/editor.html` (all `T.<tpl>` blocks). Actual `default` becomes `""`.
- Field renderer: apply the value to the `placeholder=` attribute on `<input>`/`<textarea>` (and analogous "empty" visual for image pickers), so tapping the field shows an empty editable state — no manual-delete step.
- Preview render path: when a field is empty, fall back to the placeholder string only for display, styled dimmed (e.g. `opacity:0.4`) so it's obviously not a real value.
- Add a `required` flag (default true; a few genuinely optional ones like `descOffset`, `wm_right`, secondary meta labels can be marked optional).
- Export guard: before running PNG export, scan current slides for empty required fields. If any, block export, highlight the offending fields, show a toast "Fyll ut alle felter før eksport" and scroll the first offender into view.

### 2. Matchup / player matchup "VS" circle

- In `frames.css`, position `.vs` absolutely centered vertically to the image row (currently sits between text). Compute using the image row's bounding box so it stays centered vs. the two `.matchup-photo` boxes regardless of below-text height.
- Add two new template fields on both `matchup` and `game` templates:
  - `vsShow` (boolean toggle, default true)
  - `vsSize` (number/range 60–240px, default current size)
- Wire the toggle to hide `.vs` when off, and the size to a CSS variable on the frame root (`--vs-size`).

### 3. "Bli med" flexible steps (2–6)

- Replace hard-coded `s1/s2/s3` fields with a dynamic list editor: `steps: [{title, desc}, …]` stored in slide values.
- Default 2 steps. Add "+ Legg til steg" button up to max 6. Each row has a "Fjern" (min 2).
- Render logic: 1–3 steps = single row (existing grid). 4–6 steps = two rows using CSS grid `repeat(3, 1fr)` with the second row filling remaining items.
- Update examples/manifest so the `welcome` fields no longer hard-code `s1t..s3d`; migrate the existing example to the new shape.

### 4. Caption generation via LLM

- Add a new Supabase Edge Function `ig-caption` that takes `{ slides, brandContext }` and calls Lovable AI Gateway (`google/gemini-3-flash-preview`, `generateText`) with a Norwegian system prompt: "Skriv en naturlig, varm bildetekst på norsk basert på disse slides. Ikke bruk emoji med mindre input har det. Ikke lag hashtags — de legges til separat."
- Editor's caption preview UI: replace the current concatenation with a call to this function. Keep the existing surrounding structure (tags + photo credit + hashtags appended after the LLM body).
- Fallback: on network/gateway failure, fall back to current concatenated caption and show a subtle "AI utilgjengelig — bruker enkel bildetekst" note.

## Main site

### 5. Påmelding email dispatch — status + steps

Email dispatch is already wired: `src/pages/Index.tsx` invokes `send-transactional-email` with template `training-signup-notification` after insert, currently hardcoded to `espenhkristensen@gmail.com`. To turn this into a defined admin recipient list:

Steps:

1. Confirm the app-email infrastructure (`setup_email_infra` + `scaffold_transactional_email`) is already deployed. Verify the `training-signup-notification` template exists in `supabase/functions/_shared/transactional-email-templates/` and is registered.
2. Decide where the admin recipient list lives. Recommend a new `admin_notification_recipients` table (columns: `email`, `active`, `created_at`) with RLS so only admin can manage it — or, for a simpler v1, an env-var comma-separated list `TRAINING_SIGNUP_NOTIFY_EMAILS`.
3. Add a small Edge Function (or extend `list-signups`) that returns the current recipient list, and a UI in `/admin` to add/remove emails (only if we go the table route).
4. Change `Index.tsx` to invoke a wrapper Edge Function `notify-training-signup` that reads the recipient list and fans out one `send-transactional-email` call per recipient (each with its own idempotency key `training-signup-${id}-${email}`), instead of calling `send-transactional-email` directly with a single hardcoded email.
5. Deploy the new/edited edge functions and test with two addresses.

I'll present the choice (env var vs. table+admin UI) and only implement after confirmation.

### 6. Reframe påmelding as "show interest"

- Update `try.h`, `try.sub`, `try.cta`, `try.submit`, `try.success` copy in `src/i18n/dictionaries.ts` (no + en) to say this is an interest signal, not a binding registration.
- Add a small info line under the form heading: "Vi sjekker påmeldinger med jevne mellomrom. For raskt svar, ta kontakt via Facebook eller Instagram." (+ EN).

### 7. Error text with links

- Split `try.error` into a JSX-rendered message (not a raw string) so we can embed:
  - An anchor on "en av trenerne" → `href="#coachene"` (scrolls to coaches section — id already used by nav).
  - A short follow-up sentence with links to the club's Instagram and Facebook (reuse the URLs from the existing social section).
- Keep both language variants.

## Technical notes

- Editor changes are contained to `public/make-ig-post/editor.html` and `public/make-ig-post/frames.css`.
- New edge functions: `ig-caption` (AI), optionally `notify-training-signup` (fan-out). Both use the shared gateway/AI patterns already in the project.
- Placeholder defaults require regenerating `src/make-ig-post/examples/*` — I'll rerun `npm run ig:examples` after the field changes and update the example JSONs where they still reference removed defaults (mainly `welcome`).
- No schema changes required for editor work. For section 5, a migration is only needed if we choose the recipient-table route.

## Open questions before I start

1. Section 5: env-var recipient list (fast, no UI) vs. DB table + admin UI (more work, self-serve)? -> do the UI approach, I want to edit recipients from the /admin page.
2. Section 4 caption LLM: OK to use `google/gemini-3-flash-preview` (fast, low cost) as default? Any tone/length hints to bake into the system prompt? -> OK, tone should be positive and professional, without becoming gaudy.
3. Section 2: keep the same default VS size as today, or set a new default (e.g. 140px)? -> current default is fine