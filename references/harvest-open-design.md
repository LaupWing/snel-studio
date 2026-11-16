# Harvest: reusable pieces from Open Design shots (2026-11-16)

284 toon-2d shots scanned (post-office, heartbleed, sonos, robinhood, myfitnesspal, mcp-server). Most shots copy the
same core helpers; "seen in" = how many of the 284 files contain it (a sign it is proven).
Paths under `ai-harness/open-design/.od/projects/`:
PO `ec4dbd1f.../03-verder-terug-een-dorpsplein.html` · HB `00a1a244.../15-pas-na-heartbleed-gingen.html` ·
PO4 `e712c26d.../04-in-engeland-zette-de-v1515.html` · PO5 `0a4838ae.../05-and-then-money-started-v1542.html` ·
CI `ca7155b7.../04-commit-intro-shot-v1655.html` · SV `77884d5b.../09-and-the-server-sends.html` ·
SO `541eaa9d.../04-mei-2024-sonos-het-v0927.html` · CODE `06036722.../05-code-start-close-on.html` ·
BU `77e95cf7.../04-het-heette-heartbleed-een.html`

| # | piece | where (lines) | Q | port | seen in |
|---|---|---|---|---|---|
| 1 | toon look: 3-4 step ramp, `toon()` with violet shadow floor, ink colour | HB 238-243 | 5 | easy | 168 |
| 2 | ink: `inkHull(k)` + `box`/`smooth` builders with hull and edges | HB 245-275 | 5 | easy | 109-168 |
| 3 | post: depth blur (golden-angle), violet shadows, highlight rolloff, vignette, grain | PO 559-612; PO5 1081-1134 | 5 | medium | ~all |
| 4 | level camera: focal px + `setViewOffset` lens shift (verticals stay vertical) | PO 76-90; PO4 386 | 5 | easy | ~120 |
| 5 | `worldAt(col,row,depth)`: place at a screen pixel | PO4 403-412; HB 866 | 5 | easy | ~35 |
| 6 | `canvasTex` + `brushNoise` | PO 134-151 | 4 | easy | 128-168 |
| 7 | `paintTex`: wash + brush strokes + grain (best surface) | SV 82-100 | 5 | easy | ~60 |
| 8 | character card: lit plane, alpha shadow, blob shadow, lean, `poseCard` | HB 447-474 | 5 | easy | 129 |
| 9 | `armsFromKeys`/`lerpArms`/`armKey`: arm poses over time | HB 475-491 | 5 | easy | 76-147 |
| 10 | side-character kit: torsos, hair, beanie, `lidEye`, faces smug/doomer/shock/NPC/kind | HB 493-650; PO4 769-924 | 5 | medium | ~60 |
| 11 | wojak from real PNG faces (`drawPerson`) | PO 513-560 | 4 | easy | - |
| 12 | vector wojak (`drawWojakFace/Head`) | CI 572-655; SO 582-625 | 3 | easy | ~90 |
| 13 | `buildShop`: shopfront, window/door holes, gables, roof, opening door | PO 351-469 | 4 | medium | - |
| 14 | canal-house `facadeTex` | SO 498-535 | 4 | easy | 39 |
| 15 | `cobbleTex`, `shopTex`, `brickTex`, planks | PO 153-176; PO4 160-215; HB 90 | 4 | easy | - |
| 16 | `drawScreen`: canvas UI on a screen | PO5 362-449 | 4 | medium | 72 |
| 17 | server `rack()` + paper ribbon | SV 289-301, 570-712 | 4 | easy/hard | - |
| 18 | 3D extruded title (14 layers, slam-in) | CI 725-787 | 5 | medium | 44 |
| 19 | dust puffs `addPuffs`/`updPuffs` | CI 679-699 | 5 | easy | 44 |
| 20 | ambient loops: leaves, birds, dust motes, steam | PO5 771-793 | 4 | easy | - |
| 21 | bunting | BU 395-423; PO5 750 | 4 | easy | - |
| 22 | birds `mkFlock`, `birdTex` | PO4 558; SO 298-307 | 4 | easy | 31-40 |
| 23 | low-poly props (`flatGeo`/`lowpoly`), `makeTree` | CI 286-295; SO 791-798 | 4 | easy | 24-36 |
| 24 | labelled slabs, instanced blocks rising | CI 328-335, 409-421 | 4 | medium | - |
| 25 | code page (`tokenize`, `pageCanvas`) + glowing links | CODE 266-410 | 4 | medium | code-explainer |

Patterns: every shot is a pure function of time `render(t)` (fits Remotion's useCurrentFrame); the look is always
toon ramp + inverted-hull ink + painted canvas textures + 2D cards + depth blur/grade (= template core); only set
builders and props change per shot; placement measured in screen pixels.
