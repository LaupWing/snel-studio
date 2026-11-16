# 2026-11-16 od-post

**Goal:** swap ACES for the proven Open Design post pass, light the mascot card like the world, and try a
high three-quarter camera like Ricks (Loc 2026-11-16: angled and from above are allowed now, not only front-on).

**What:** new template pieces (ported from Open Design, harvest #3 and #8):
`src/templates/toon-2d/Post.tsx` (48-tap DOF gather + violet shadow grade, sat +14%, highlight rolloff,
vignette, grain, lifted black) and `Card.tsx` (violet emissive floor, casts a real shadow, blob contact shadow,
turns to camera). Scene = the style-guide street, camera high 3/4 (4.6, 5.2, 9 → push), more props, mascot 1.7 m.
New tool: `lab/compare.sh <out dir> <stills>` makes vs-ricks.png in one go.

**Stills:** `out/lab/toon-2d/2026-11-16-od-post/op_0.png`, `op_89.png`, `vs-ricks.png`.

**Result:** colour much closer (warm, saturated, no washed-out sky problem); real shadows; the high angle
already reads more like Ricks; foreground barrel + plant blur nicely. Still off:
- background houses not soft enough (focus too far back; set focus on the mascot, raise k).
- mascot reads dark/grey from this angle (his hoodie is grey by design; may need a little more emissive).
- the frame is still a set, not a story: no side characters, no big hero object close to the lens.

**Verdict:** keep Post.tsx and Card.tsx in the template. Next: side characters (harvest #10), focus on the
subject, one close-up composition.
