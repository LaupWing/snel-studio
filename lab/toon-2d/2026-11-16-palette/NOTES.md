# 2026-11-16 palette

**Goal:** fix what Loc saw in test 3 ("kleuren heel anders, super donker"). Measured test 3: 84% orange,
0% white, sat 0.62 vs Ricks 55-66% orange, 3-21% white, sat 0.32-0.53. One hue everywhere + crushed highlights = muddy.

**What:** Post.tsx gets two knobs, `sat` (was fixed 1.14) and `knee` (highlight rolloff start, was fixed 0.72).
Test uses sat 0.95, knee 0.92, focus on the mascot (9.8, k 30). Palette: cream plaster house with blue door,
blue plank house with slate roof, white window frames and trims, pale stone ground, blue crate up front,
whiter key light, lighter hemi ground. Camera a bit lower with the look-at higher, so the sky shows.
New tool: `lab/measure.py` (called by compare.sh) prints a numbers table under vs-ricks.png: green inside the
Ricks range, red outside.

**Stills:** `out/lab/toon-2d/2026-11-16-palette/pa_0.png`, `pa_89.png`, `vs-ricks.png`.

**Result:** luma 0.45-0.48, white 3%, sat 0.38-0.40, blue 18-19%: all inside the Ricks range. Orange 73% is still
over (55-66%): the brick house + beige ground fill the frame. The camera ended up less from above than test 3.

**Verdict:** keep `sat` 0.95 and `knee` 0.92 as template defaults candidate. Next: less brick in frame / cooler
ground, and get the high angle back (look-at lower again, but keep a slice of sky).
