# Instagram post templates

Reference examples for every template exposed by the Instagram frame editor.
Each subfolder contains a generic example JSON plus the three rendered PNG
aspect ratios (square 1080×1080, portrait 1080×1350, story 1080×1920).

**Regenerate:** `npm run ig:examples` — this rewrites every JSON, PNG, and
this README from the current template definitions in `editor.html`. Do it
whenever you add, rename, or remove a template field (the CI test in
`__tests__/examples.test.ts` will otherwise fail).

The example JSON is also directly consumable by the editor's
**Import from JSON** button.

## Templates

### `player` — Player intro

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"M\u00f8t laget \u00b7 04 av 18"` |
| `first` | text | `"Magnus"` |
| `last` | text | `"S\u00e6tre"` |
| `jersey` | text | `"07"` |
| `pos_label` | text | `"QUARTERBACK \u00b7 #07"` |
| `season` | text | `"3."` |
| `from` | text | `"Tromsdalen"` |
| `background` | text | `"H\u00e5ndball"` |
| `quote` | textarea | `"\u00abDet handler om \u00e5 lese spillet f\u00f8r det skjer.\u00bb"` |
| `wm_right` | text | `"QB \u00b7 69\u00b0 NORD"` |

Example JSON: [`player/player.json`](player/player.json)

![player square](player/player-square.png)
![player portrait](player/player-portrait.png)
![player story](player/player-story.png)

### `pos101` — Position 101

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Posisjonsskolen \u00b7 03 av 07"` |
| `abbr` | text | `"RB"` |
| `name` | text | `"Running back"` |
| `tagline` | textarea | `"Eksplosiv ballb\u00e6rer. Tar b\u00e5de handoffs og korte pasninger. Trenger…` |
| `r1` | text | `"Mottar handoffs i bakfeltet"` |
| `r2` | text | `"Sekund\u00e6rmottaker p\u00e5 pasning"` |
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
| `week` | text | `"Uke 23 \u00b7 02 \u2014 08 juni"` |
| `title` | text | `"Ukens treninger."` |
| `events` | list | `[{"date": "TIRSDAG", "time": "19:00\u201321:00", "info": "Templarheimen \u00b…` |
| `footnote` | text | `"\u00c5pne treninger. Bare m\u00f8t opp."` |
| `wm_right` | text | `"UKE 23"` |

Example JSON: [`schedule/schedule.json`](schedule/schedule.json)

![schedule square](schedule/schedule-square.png)
![schedule portrait](schedule/schedule-portrait.png)
![schedule story](schedule/schedule-story.png)

### `event` — Event

| Field | Type | Default |
| --- | --- | --- |
| `badge` | text | `"\u00c5PENT FOR ALLE"` |
| `date` | text | `"L\u00f8rdag 14. juni \u00b7 12:00"` |
| `titleA` | text | `"\u00c5pen"` |
| `titleB` | text | `"trening."` |
| `desc` | textarea | `"Aldri pr\u00f8vd flaggfotball? Kom som du er. Vi har ekstra flagg, baller og…` |
| `meta1_l` | text | `"Sted"` |
| `meta1_v` | text | `"Tromsdalen"` |
| `meta2_l` | text | `"Varighet"` |
| `meta2_v` | text | `"2 timer"` |
| `meta3_l` | text | `"Pris"` |
| `meta3_v` | text | `"Gratis"` |
| `wm_right` | text | `"\u00c5PEN TRENING"` |

Example JSON: [`event/event.json`](event/event.json)

![event square](event/event-square.png)
![event portrait](event/event-portrait.png)
![event story](event/event-story.png)

### `nm` — NM

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Vi er kvalifisert"` |
| `titleA` | text | `"Troms\u00f8"` |
| `titleB` | text | `"til <span style=\"color:var(--chrome);\">NM.</span>"` |
| `desc` | textarea | `"For f\u00f8rste gang i klubbens historie. Vi reiser til Oslo 22.\u201324. au…` |
| `m1l` | text | `"Dato"` |
| `m1v` | text | `"22\u201324 AUG"` |
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
| `subtitle` | textarea | `"Du trenger ikke ha spilt f\u00f8r. Du trenger ikke utstyr.<br><strong style=…` |
| `s1t` | text | `"M\u00f8t opp"` |
| `s1d` | text | `"Tirsdag, torsdag eller l\u00f8rdag."` |
| `s2t` | text | `"L\u00e5n utstyr"` |
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
| `eyebrow` | text | `"Bak laget \u00b7 04"` |
| `titleA` | text | `"Etter siste"` |
| `titleB` | text | `"fl\u00f8yt."` |
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
| `desc` | textarea | `"For f\u00f8rste gang debuterer flaggfotball p\u00e5 OL-programmet i Los Ange…` |
| `wm_right` | text | `"VISSTE DU?"` |

Example JSON: [`fact/fact.json`](fact/fact.json)

![fact square](fact/fact-square.png)
![fact portrait](fact/fact-portrait.png)
![fact story](fact/fact-story.png)

### `rule` — Rule

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Regeltorsdag \u00b7 12 av 24"` |
| `titleA` | text | `"Hva er"` |
| `titleB` | text | `"en <span style=\"color:var(--chrome);\">first down?</span>"` |
| `figure` | figure | `[{"type": "area", "points": [[15, 2], [25, 2], [25, 23], [15, 23]], "color": …` |
| `desc` | textarea | `"<strong style=\"color:var(--fg);\">Du f\u00e5r 4 fors\u00f8k (\u00abdowns\u0…` |
| `descOffset` | offset | `0` |
| `wm_right` | text | `"REGELTORSDAG"` |

Example JSON: [`rule/rule.json`](rule/rule.json)

![rule square](rule/rule-square.png)
![rule portrait](rule/rule-portrait.png)
![rule story](rule/rule-story.png)

### `drill` — Play/concept

| Field | Type | Default |
| --- | --- | --- |
| `eyebrow` | text | `"Ukens konsept \u00b7 08 av 30"` |
| `titleA` | text | `"Slant-Flat"` |
| `titleB` | text | `"<span style=\"color:var(--chrome);\">combination.</span>"` |
| `origin` | origin | `{"x": 15, "y": 12.5}` |
| `pointScale` | scale | `1.8` |
| `players` | players | `[{"label": "Q", "color": "qb", "x": 0, "y": 0, "r": 1, "width": 0.32, "route"…` |
| `desc` | textarea | `"<strong style=\"color:var(--fg);\">Hvorfor:</strong> Slant tvinger n\u00e6r-…` |
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
| `oTag` | text | `"WR \u00b7 #11"` |
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
| `dTag` | text | `"CB \u00b7 #24 \u00b7 BOD\u00d8"` |
| `dS1l` | text | `"INT"` |
| `dS1v` | text | `"5"` |
| `dS2l` | text | `"Pull"` |
| `dS2v` | text | `"19"` |
| `dS3l` | text | `"40-yd"` |
| `dS3v` | text | `"4.5s"` |
| `wm_right` | text | `"RUNDE 04 \u00b7 L\u00d8RDAG"` |

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
| `hName` | text | `"TROMS\u00d8"` |
| `hTag` | text | `"FLAGGFOTBALL"` |
| `hScore` | text | `"28"` |
| `aColor` | colorPick | `"#fb7185"` |
| `aLogo` | image | `""` |
| `aName` | text | `"BOD\u00d8"` |
| `aTag` | text | `"GLIMT FLAG"` |
| `aScore` | text | `"14"` |
| `gDate` | text | `"L\u00d8R 14. JUNI"` |
| `gTime` | text | `"KL 14:00"` |
| `gVenue` | text | `"TROMSDALEN KUNSTGRESS"` |
| `gResult` | text | `"FULL TID"` |
| `wm_right` | text | `"RUNDE 04 \u00b7 L\u00d8RDAG"` |

Example JSON: [`game/game.json`](game/game.json)

![game square](game/game-square.png)
![game portrait](game/game-portrait.png)
![game story](game/game-story.png)
