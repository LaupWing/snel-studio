# 2026-11-16 street

**Goal:** prove the stack works: Remotion renders a three.js world frame by frame, our mascot as a lit card,
ink on the world, a camera move driven by code.

**What:** three box houses with roofs, inverted-hull ink, two-tone toon ramp, sky gradient, fog, mascot card
(wave), 3 s slow push-in. Knobs in `src/templates/toon-2d/look.ts` (first guesses, not measured).

**Stills:** `out/lab/toon-2d/2026-11-16-street/street_0.png`, `street_89.png`.

**Result:** works end to end; a still takes seconds. Looks flat and ugly (Loc): no textures, windows or props,
light from the front, ink only on silhouettes, no depth of field, mascot grey.

**Verdict:** stack OK. Next test: apply the style guide (`references/toon-2d.md`) values.
