# 2026-11-16 mascot-light

**Goal:** Loc: the mascot looks very dark, Ricks' characters are the brightest thing in frame. Plus test 4's
leftovers: too much orange (73%), camera less from above.

**What:** `Card.tsx` gets `self` (0..1): the drawing lights itself (white emissive x map), the scene light only adds
on top. Not set = old behaviour, so tests 3/4 still render the same. Test uses self 0.8. Palette: middle house blue
planks, brick moved to the right, cooler grey ground. Camera back up (y 5.4, look-at 1.7).
New tool: `lab/mascot.py <full> <flat>`: mascot luma vs his own flat drawing (render `--props='{"mode":"flat"}'`).

**Stills:** `out/lab/toon-2d/2026-11-16-mascot-light/ml_0.png`, `ml_89.png`, `flat_*.png`, `vs-ricks.png`.

**Result:** mascot 0.45 = 91% of his flat drawing (was dark violet-grey). He is still not brighter than the frame
(0.47): his own design (navy head, grey hoodie, jeans) sits at 0.49, so self-lighting alone can't make him pop.
Palette overshot: blue 57-61% (Ricks 17-36%), orange 30-34% (55-66%). luma, white, sat inside the range.

**Verdict:** keep `self` 0.8 as the card default candidate. Next: palette in between (one blue house, not the
big middle one), and make him pop by contrast instead of brightness: a light ground patch / rim around him.
