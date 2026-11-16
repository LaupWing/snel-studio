# 2026-11-16 style guide

**Goal:** the same street as `2026-11-16-street`, with the values from `references/toon-2d.md`.

**What:** key light upper-left with hard shadows (2048 map), hemisphere fill #8c7bb8/#3a2438, warm rim;
3-step toon ramp; painted canvas textures (brick, planks, plaster, roof tiles, cobbles) with warm ink seams
#261a22; ink = inverted hull + crease lines (EdgesGeometry 30); windows, doors, eaves, plinth, lamp (bloom),
barrels, plant; fog; post: depth of field + bloom + ACES (own `postprocessing` composer in useFrame:
`@react-three/postprocessing` rendered transparent black under Remotion).

**Stills:** `out/lab/toon-2d/2026-11-16-style-guide/`: `nofx_0.png` (no post), `sg_0.png`, `sg_89.png`,
`compare.png` (old | no post | with post | end of push-in), `vs-ricks.png` (ours next to 3 Ricks frames).

**Result:** a big step up: real light and shadows, detail, textures, ink seams. Open issues:
- ACES washes it out: sky pale, ink seams grey; the no-post version is punchier. Tune exposure/tone mapping.
- Depth of field too subtle; background should be clearly softer (sigma 2-4 px).
- Mascot still grey and flat (card not lit like the world), no visible contact shadow.
- Cobbles too regular; foreground barrel out of frame.

**Verdict:** keep light, textures and ink approach. Next test: tone mapping + stronger DOF + mascot lighting.
