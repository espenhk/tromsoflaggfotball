## Goal

Add a toggleable "time and place" line to the Matchup (T11) template that reads naturally and never overlaps the stats or the VS badge.

## Where it goes — and why

Two layout zones were considered:

1. **Bottom banner (previous attempt)** — sat on top of the stats; even after trimming to 2 stats it felt cramped and arbitrary. Rejected.
2. **Top header band, spanning both halves** — clean, symmetrical, and the photo+stats below simply shift down together. No stat overlap is possible because it's outside the half columns. This is what the plan uses.

The band lives in the stage as a sibling of the two halves, positioned above them. Halves remain `flex: 1` and continue to fill the remaining height, so layout naturally re-flows when the band is toggled on/off. Square and Story aspects both work because we use flex, not fixed offsets.

## Visual design

A single slim band across the full top of the stage:

```text
┌──────────────────────────────────────────────────────────┐
│  LØR 14. JUN · 14:00      ·      TUIL KUNSTGRESS, TROMSØ │
└──────────────────────────────────────────────────────────┘
│  ANGREP                  VS                     FORSVAR   │
│  [photo]                                        [photo]   │
│  Name                                              Name   │
│  stats...                                       stats...  │
```

- Background: subtle dark surface (`rgba(0,0,0,0.35)` over the existing tinted halves) with a 1px bottom border in `var(--primary)` at low alpha — ties into existing chrome.
- Two text segments separated by a centered dot:
  - **Left:** when (date + time), uppercased, body font, letter-spacing 0.14em.
  - **Right:** where (venue), uppercased, body font, letter-spacing 0.14em.
- Type size: 22px square / 30px story. Padding 18px 56px (square) / 28px 72px (story).
- The VS circle stays vertically centered on the **halves area** (not the whole stage), so the band does not collide with it. Achieved by making `.stage` a column flex (band on top, then a row container holding the two halves + VS) when meta is on; otherwise unchanged.

## Editor controls

In `T.matchup.fields`, add three fields just before `wm_right`:

- `showMeta` — checkbox, default `false`
- `gameWhen` — text, default `"LØR 14. JUN · 14:00"`
- `gameWhere` — text, default `"TUIL Kunstgress, Tromsø"`

## Implementation outline (technical)

**`public/make-ig-post/editor.html` (`T.matchup`):**
- Add the 3 fields above.
- In `render`, when `d.showMeta` is true, wrap the existing two halves + VS in an inner `<div class="matchup-row">` and prepend a `<div class="matchup-meta">` band inside `<div class="stage has-meta">`. When false, render exactly as today (no class, no wrapper) so the default looks identical to the current version.
- Band markup:
  ```html
  <div class="matchup-meta">
    <span class="mm-when">${gameWhen}</span>
    <span class="mm-dot">·</span>
    <span class="mm-where">${gameWhere}</span>
  </div>
  ```

**`public/make-ig-post/frames.css`:**
- `.t-matchup .stage.has-meta { flex-direction: column; }`
- `.t-matchup .stage.has-meta .matchup-row { flex: 1; display: flex; flex-direction: row; position: relative; min-height: 0; }`
- Move the `.vs` absolute centering to be relative to `.matchup-row` when `has-meta` is on (selector: `.t-matchup .stage.has-meta .vs` re-anchored; original `.vs` rule untouched for the non-meta case).
- `.matchup-meta` rule: flex row, `justify-content: space-between`, padding, border-bottom in primary, dark translucent background, body font, uppercase, letter-spacing.
- Story override: larger padding + font size.
- No `padding-bottom` hacks on `.half` are needed — the band is outside the halves.

## What stays untouched

- All 3 stats per side remain visible.
- VS circle styling unchanged.
- Wordmark/footer behavior unchanged.
- When `showMeta` is off, the template renders byte-equivalently to today.
