## Problem

The CMS `field-diagram` section is near-unusable: coordinates are percentages (`x` 0–100, `y` 0–100 from the top), routes are a single "to X/Y" point, and the boxes start empty — so it's either the built-in default or you rebuild everything by hand. There's no way to see or tweak the plays the site actually shows.

## Shared foundation (both options)

**New coordinate system — yards, matching how you think about a field**

- `y` = yard line, `0` = own goal line, `-10` = back of own end zone, `5` = the 5-yard line, `45` = deep upfield.
- `x` = cross-field, centered: `-12.5` left sideline … `0` middle … `+12.5` right sideline. Width configurable per section (default 25 yd).
- Route waypoints use the same absolute yard coordinates (not deltas), so a route is just a list of `{x, y}` points ending in an arrowhead.
- `FieldDiagram` internally works in `topYd` relative to the line of scrimmage plus `left` %, so a small conversion layer translates yard coordinates ↔ internal geometry using the chosen preset (short 30-yd front-page field or full 70-yd field).

**Prefilled, editable defaults**

- Instead of "empty = use built-in", the editor always holds real, editable data.
- A **Sett** (set) dropdown per section: Formasjon, Kastespill (each of the 5 built-in pass plays), Løpespill (each run play), Forsvar — the exact sets used on the front page today.
- **Tilbakestill** loads the currently used front-page sets into the boxes (formation + plays, in yard coordinates) so you can tweak from a working starting point.
- **Tøm** empties players and routes (blank field).
- Existing DB rows with old percentage data are converted on read (one-time mapping so nothing breaks).

**Behaviour preserved**

- Custom players stay interactive: label/ID maps to a position, tap opens the tooltip and links to `/posisjoner`, and the offense/defense tabs still render.

---

## Option A — Structured yard editor (port of the IG editor pattern)

Rebuild the admin fields as a dedicated `field-players` field type in the CMS editor, modelled directly on the IG editor's `players` field type (`public/make-ig-post/editor.html`, the `type: 'players'` renderer): one card per player with label, colour, x, y; inside it a "Ruter" sub-list of numbered waypoint rows with `x`/`y` steppers and add/remove buttons per waypoint.

- Reuses the IG editor's proven layout and interaction model, rewritten as a React component in the CMS.
- Add/remove/reorder players; add/remove waypoints; per-player colour dropdown.
- Sett dropdown + Tøm + Tilbakestill sit above the list.
- Small live preview of the diagram under the editor so you see edits immediately.

Cost: moderate. Low risk. Still numeric entry, but fast and predictable.

## Option B — Visual field canvas editor

Everything in Option A, plus a drag-and-drop field canvas above the numeric list:

- The real field is rendered in the admin at editing scale. Drag a player dot to move it; coordinates in the list update live (snapped to 0.5 yd, with yard-line labels).
- Route mode: select a player, then click on the field to append waypoints; drag waypoints to adjust, click one to delete.
- "Legg til spiller" drops a new dot at the ball; colour/label edited in a small popover.
- The numeric list stays as the exact-values fallback and stays in sync both ways.

Cost: roughly double Option A (new drag/hit-testing layer, touch handling for phone use). Highest payoff if you edit diagrams often.

---

## Recommendation

Option A first — it removes the actual pain (percentages, empty boxes, one-point routes) with far less surface area, and Option B can be layered on top later without changing the data format.

## Technical notes

```text
src/components/FieldDiagram.tsx   yard<->internal conversion; accept customPlayers/customRoutes
                                  with absolute yard coords + multi-point routes
src/cms/fieldSets.ts   (new)      export the front-page formations/plays as yard-coordinate sets
src/cms/variants.tsx              field-diagram dataFields -> new `field-players` type,
                                  width + set fields; legacy percentage migration on read
src/pages/AdminContent.tsx        renderer for `field-players` (player cards, waypoint rows,
                                  Sett / Tøm / Tilbakestill, live preview)
                                  + canvas editor if Option B
```

No database migration is needed — everything fits in the existing `data` JSON on content blocks.  
  
THIS PLAN IS OK, BUT DO NOT IMPLEMENT YET. STORE THE PLAN AS A FILE, AND I WILL RETURN TO IT.