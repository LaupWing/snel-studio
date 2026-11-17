# 2026-11-17 mascot-3d

**Goal:** Ricks' characters are real 3D models (scan 2026-11-17); our flat card reads flat on turns. Build the mascot
in 3D, same design.

**What:** `Mascot3D.tsx` (lab only, not in the template yet). All sizes + colours from the approved mascot2d.js:
sphere head (r 228 body px) with gradient, shine and the one bolt painted on by front projection; rounded hoodie
+ collar + pocket + strings, jeans, cuffs, white shoes; stick arms in ink with ball hands (bezier tubes from the
MASCOT_ARMS pose table), right hand waves every frame, the body turns (yaw ±0.5). Smooth 4-step toon ramp,
self-light 0.35, cast/receive shadows, ink = normal-pushed hull ~2.2% of head width.
Comps: `LabMascot3D` props mode full / close / card (card = same close-up with the old flat card).

**Stills:** `out/lab/toon-2d/2026-11-17-mascot-3d/m3_0.png`, `m3_89.png`, `close_45.png`, `card_45.png`, `vs-ricks.png`.

**Result:** reads as our mascot, now with volume: round shaded head with real shine, hoodie with depth, casts a shadow,
turns. Small details (pocket, strings) barely read at this size. Scene numbers as test 7 (white still low).

**Verdict (Loc 2026-11-17): the flat card is better.** Mascot stays the flat card (Card.tsx, self 0.8). Mascot3D stays here as a test only.
on the head, then side characters built the same way.
