# Instagram post templates

Reference examples for every template exposed by the Instagram frame editor.
Each subfolder contains a generic example JSON plus the three rendered PNG
aspect ratios (square 1080×1080, portrait 1080×1350, story 1080×1920).

**Regenerate:** `npm run ig:examples` — this rewrites every JSON, PNG, and
this README from the current template definitions in `editor.html`. Do it
whenever you add, rename, or remove a template field (the CI test in
`__tests__/examples.test.ts` will otherwise fail).

**Visual regression:** `__tests__/pixel-diff.test.ts` re-renders every
committed example through the live editor and pixel-diffs the result
against the checked-in PNG (≤1% mismatched pixels tolerated). If a
template's rendering changes intentionally, refresh the baselines with
`npm run ig:examples`. Otherwise investigate the drift before merging.
The test needs the Vite dev server running on `:8080` and a Playwright
Chromium binary — it skips gracefully when either is missing.

The example JSON is also directly consumable by the editor's
**Import from JSON** button.

## Templates

### `player` — Player intro

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Møt laget · 04 av 18"` |
| `first` | text | `"Magnus"` |
| `last` | text | `"Sætre"` |
| `jersey` | text | `"07"` |
| `pos_label` | text | `"QUARTERBACK · #07"` |
| `season` | text | `"3."` |
| `from` | text | `"Tromsdalen"` |
| `background` | text | `"Håndball"` |
| `quote` | textarea | `"«Det handler om å lese spillet før det skjer.»"` |
| `wm_right` | text | `"QB · 69° NORD"` |

Example JSON: [`player/player.json`](player/player.json)

![player square](player/player-square.png)
![player portrait](player/player-portrait.png)
![player story](player/player-story.png)

### `pos101` — Position 101

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Posisjonsskolen · 03 av 07"` |
| `abbr` | text | `"RB"` |
| `name` | text | `"Running back"` |
| `tagline` | textarea | `"Eksplosiv ballbærer. Tar både handoffs og korte pasninger. Trenger akseleras…` |
| `r1` | text | `"Mottar handoffs i bakfeltet"` |
| `r2` | text | `"Sekundærmottaker på pasning"` |
| `r3` | text | `"Blokkerer rushere"` |
| `r4` | text | `"Leser hull i forsvaret"` |
| `wm_right` | text | `"POSISJONSSKOLEN"` |

Example JSON: [`pos101/pos101.json`](pos101/pos101.json)

![pos101 square](pos101/pos101-square.png)
![pos101 portrait](pos101/pos101-portrait.png)
![pos101 story](pos101/pos101-story.png)

### `schedule` — Schedule

| Field | Type | Default |
| --- | --- | --- |
| `week` | text | `"Uke 23 · 02 — 08 juni"` |
| `title` | text | `"Ukens treninger."` |
| `events` | list | `[{"date": "TIRSDAG", "time": "19:00–21:00", "info": "Templarheimen · 7-on-7"}…` |
| `footnote` | text | `"Åpne treninger. Bare møt opp."` |
| `wm_right` | text | `"UKE 23"` |

Example JSON: [`schedule/schedule.json`](schedule/schedule.json)

![schedule square](schedule/schedule-square.png)
![schedule portrait](schedule/schedule-portrait.png)
![schedule story](schedule/schedule-story.png)

### `event` — Event

| Field | Type | Default |
| --- | --- | --- |
| `badge` | text | `"ÅPENT FOR ALLE"` |
| `date` | text | `"Lørdag 14. juni · 12:00"` |
| `titleA` | text | `"Åpen"` |
| `titleB` | text | `"trening."` |
| `desc` | textarea | `"Aldri prøvd flaggfotball? Kom som du er. Vi har ekstra flagg, baller og kaff…` |
| `meta1_l` | text | `"Sted"` |
| `meta1_v` | text | `"Tromsdalen"` |
| `meta2_l` | text | `"Varighet"` |
| `meta2_v` | text | `"2 timer"` |
| `meta3_l` | text | `"Pris"` |
| `meta3_v` | text | `"Gratis"` |
| `wm_right` | text | `"ÅPEN TRENING"` |

Example JSON: [`event/event.json`](event/event.json)

![event square](event/event-square.png)
![event portrait](event/event-portrait.png)
![event story](event/event-story.png)

### `nm` — NM

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Vi er kvalifisert"` |
| `titleA` | text | `"Tromsø"` |
| `titleB` | text | `"til <span style=\"color:var(--chrome);\">NM.</span>"` |
| `desc` | textarea | `"For første gang i klubbens historie. Vi reiser til Oslo 22.–24. august for å…` |
| `m1l` | text | `"Dato"` |
| `m1v` | text | `"22–24 AUG"` |
| `m2l` | text | `"Sted"` |
| `m2v` | text | `"EKEBERG, OSLO"` |
| `m3l` | text | `"Lag"` |
| `m3v` | text | `"12"` |
| `wm_right` | text | `"NM 2026"` |

Example JSON: [`nm/nm.json`](nm/nm.json)

![nm square](nm/nm-square.png)
![nm portrait](nm/nm-portrait.png)
![nm story](nm/nm-story.png)

### `welcome` — Bli med

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Vi vokser"` |
| `titleA` | text | `"Bli med"` |
| `titleB` | text | `"<span style=\"color:var(--chrome);\">oss.</span>"` |
| `subtitle` | textarea | `"Du trenger ikke ha spilt før. Du trenger ikke utstyr.<br><strong style=\"col…` |
| `s1t` | text | `"Møt opp"` |
| `s1d` | text | `"Tirsdag, torsdag eller lørdag."` |
| `s2t` | text | `"Lån utstyr"` |
| `s2d` | text | `"Vi har flagg + ball klart."` |
| `s3t` | text | `"Kom igjen"` |
| `s3d` | text | `"Du er en av oss."` |
| `wm_right` | text | `"BLI MED"` |

Example JSON: [`welcome/welcome.json`](welcome/welcome.json)

![welcome square](welcome/welcome-square.png)
![welcome portrait](welcome/welcome-portrait.png)
![welcome story](welcome/welcome-story.png)

### `bts` — BTS

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Bak laget · 04"` |
| `titleA` | text | `"Etter siste"` |
| `titleB` | text | `"fløyt."` |
| `caption` | textarea | `"Klubbhuset i Tromsdalen, en torsdag i mai. Termoser med kaffe, et par klemme…` |
| `wm_right` | text | `"BAK LAGET"` |

Example JSON: [`bts/bts.json`](bts/bts.json)

![bts square](bts/bts-square.png)
![bts portrait](bts/bts-portrait.png)
![bts story](bts/bts-story.png)

### `fact` — Visste du?

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Visste du?"` |
| `big` | text | `"2028"` |
| `titleA` | text | `"Flaggfotball"` |
| `titleB` | text | `"blir <span style=\"color:var(--chrome);\">olympisk gren.</span>"` |
| `desc` | textarea | `"For første gang debuterer flaggfotball på OL-programmet i Los Angeles 2028. …` |
| `wm_right` | text | `"VISSTE DU?"` |

Example JSON: [`fact/fact.json`](fact/fact.json)

![fact square](fact/fact-square.png)
![fact portrait](fact/fact-portrait.png)
![fact story](fact/fact-story.png)

### `rule` — Rule

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Regeltorsdag · 12 av 24"` |
| `titleA` | text | `"Hva er"` |
| `titleB` | text | `"en <span style=\"color:var(--chrome);\">first down?</span>"` |
| `figure` | figure | `[{"type": "area", "points": [[15, 2], [25, 2], [25, 23], [15, 23]], "color": …` |
| `desc` | textarea | `"<strong style=\"color:var(--fg);\">Du får 4 forsøk («downs») til å rykke bal…` |
| `descOffset` | offset | `0` |
| `wm_right` | text | `"REGELTORSDAG"` |

Example JSON: [`rule/rule.json`](rule/rule.json)

![rule square](rule/rule-square.png)
![rule portrait](rule/rule-portrait.png)
![rule story](rule/rule-story.png)

### `drill` — Play/concept

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Ukens konsept · 08 av 30"` |
| `titleA` | text | `"Slant-Flat"` |
| `titleB` | text | `"<span style=\"color:var(--chrome);\">combination.</span>"` |
| `origin` | origin | `{"x": 15, "y": 12.5}` |
| `pointScale` | scale | `1.8` |
| `players` | players | `[{"label": "Q", "color": "qb", "x": 0, "y": 0, "r": 1, "width": 0.32, "route"…` |
| `desc` | textarea | `"<strong style=\"color:var(--fg);\">Hvorfor:</strong> Slant tvinger nær-CB in…` |
| `descOffset` | offset | `0` |
| `wm_right` | text | `"UKENS KONSEPT"` |

Example JSON: [`drill/drill.json`](drill/drill.json)

![drill square](drill/drill-square.png)
![drill portrait](drill/drill-portrait.png)
![drill story](drill/drill-story.png)

### `matchup` — Matchup

| Field | Type | Default |
| --- | --- | --- |
| `oColor` | colorPick | `"#38bdf8"` |
| `oPhoto` | image | `""` |
| `oFirst` | text | `"Lukas"` |
| `oLast` | text | `"Hagen"` |
| `oTag` | text | `"WR · #11"` |
| `oS1l` | text | `"Y/G snitt"` |
| `oS1v` | text | `"86"` |
| `oS2l` | text | `"TD"` |
| `oS2v` | text | `"7"` |
| `oS3l` | text | `"40-yd"` |
| `oS3v` | text | `"4.6s"` |
| `dColor` | colorPick | `"#fb7185"` |
| `dPhoto` | image | `""` |
| `dFirst` | text | `"Henrik"` |
| `dLast` | text | `"Berg"` |
| `dTag` | text | `"CB · #24 · BODØ"` |
| `dS1l` | text | `"INT"` |
| `dS1v` | text | `"5"` |
| `dS2l` | text | `"Pull"` |
| `dS2v` | text | `"19"` |
| `dS3l` | text | `"40-yd"` |
| `dS3v` | text | `"4.5s"` |
| `wm_right` | text | `"RUNDE 04 · LØRDAG"` |

Example JSON: [`matchup/matchup.json`](matchup/matchup.json)

![matchup square](matchup/matchup-square.png)
![matchup portrait](matchup/matchup-portrait.png)
![matchup story](matchup/matchup-story.png)

### `game` — Game

| Field | Type | Default |
| --- | --- | --- |
| `isPostGame` | checkbox | `false` |
| `hColor` | colorPick | `"#54c59e"` |
| `hLogo` | image | `""` |
| `hName` | text | `"TROMSØ"` |
| `hTag` | text | `"FLAGGFOTBALL"` |
| `hScore` | text | `"28"` |
| `aColor` | colorPick | `"#fb7185"` |
| `aLogo` | image | `""` |
| `aName` | text | `"BODØ"` |
| `aTag` | text | `"GLIMT FLAG"` |
| `aScore` | text | `"14"` |
| `gDate` | text | `"LØR 14. JUNI"` |
| `gTime` | text | `"KL 14:00"` |
| `gVenue` | text | `"TROMSDALEN KUNSTGRESS"` |
| `gResult` | text | `"FULL TID"` |
| `wm_right` | text | `"RUNDE 04 · LØRDAG"` |

Example JSON: [`game/game.json`](game/game.json)

![game square](game/game-square.png)
![game portrait](game/game-portrait.png)
![game story](game/game-story.png)
