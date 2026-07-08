## Finish what was skipped from the original 3-part request

Two gaps to close:

### 1. Text-issue audit + fixes (the main miss)

Use the existing headless setup (`window.__IG_EDITOR` + gen script) to render **every template × every aspect ratio** (12 × 3 = 36) and diff each PNG against the live editor preview at the same size. For each mismatch, log the specific issue: text clipping, wrap/linebreak mismatch, baseline shift, logo stretch/crop, element cut off at safe-area edge.

Then apply fixes in `public/make-ig-post/editor.html` and `public/make-ig-post/frames.css`:

- Replace fixed `px` font sizes with `min(px, vw)` clamps on any element that overflows in portrait/story.
- Add `object-fit: contain` + fixed aspect box for logos that stretch (portrait offender from a previous round).
- Fix the `game` short-version export path so its DOM matches preview (unresolved from a previous round).
- Normalize `schedule` row heights, `pos101` grid gaps, `nm/fact` fixed inner boxes, and `bts` title line-height so they no longer clip.
- Enforce a single shared "export = preview" render path so new templates inherit correct behavior.

Regenerate all 36 example PNGs via `npm run ig:examples` after fixes so committed examples reflect the corrected output.