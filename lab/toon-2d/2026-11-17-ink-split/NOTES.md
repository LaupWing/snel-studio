# 2026-11-17 ink-split

**Goal:** Ricks inks only characters + held/hero props; the set, machines, metal and far things are plain lit 3D
(scan 2026-11-17, Expansion reports/ink-vs-3d.md). We inked everything, so the mascot never popped (test 5).

**What:** from test 5. Set = `Set3D` (meshStandardMaterial, roughness 0.72, no ink); lamp posts metal (0.8).
Only the mascot + one hero crate next to him get toon + ink. Palette between test 4 and 5: brick middle,
blue right, cool grey ground.

**Stills:** `out/lab/toon-2d/2026-11-17-ink-split/is_0.png`, `is_89.png`, `flat_*.png`, `vs-ricks.png`.

**Result:** first time the mascot is brighter than the frame (0.45 vs 0.37-0.38, 90% of his drawing). Orange 55-56%,
blue 17-21%, sat, luma all inside the Ricks range. White 0% (standard material is darker than the toon ramp, and
white trims lost their ink so they read grey). The hero crate's ink is too thin to read at this distance.

**Verdict:** keep the ink split as the template rule. Next: lift the set exposure a little for whites (key or expo),
thicker ink on hero props, then side characters + a close-up.
