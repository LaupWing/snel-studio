# Style guide: toon-2d

Measured 2026-11-16: 20 Ricks Clips shorts (script, all frames) + 7 topic agents on 8 of them, vs 5 of our
shots (sonos, post-office, robinhood). Numbers only. Full reports: Expansion
`snel-studio/references/ricks/reports/`. Study only: never copy their stories, characters or shots.

## Biggest gaps (fix first)
1. Too bright and flat: luma median 0.69 vs 0.41, darks 0.27 vs 0.10.
2. Too little ink: 1-2% of pixels vs 7-17%; world has no creases or seams.
3. Background too sharp: no depth of field at all vs 36% of shots.
4. Characters not lit by the scene, no contact shadow, too big in frame.
5. Camera moves all ~25 f; holds go dead; hard cut every shot instead of camera travel.

## Color
| | target |
|---|---|
| luma median / p5 | 0.42 / 0.10 |
| black point | #0f0b2d, never #000 (pure black ~0.2%) |
| saturation median / peak | 0.46 / 0.83 |
| shadow tint | #1c1f52 (hue 235), plum shade #30223F |
| highlight tint | #f7e7ca (hue 40) |
| key contrast | cobalt #1330d2 (sky/backdrop) vs orange #e78e2a (props/accents) |
| night grade (explanation third) | base #304cd2, luma x0.75, sat +0.2; light changes only at scene changes |
Palette: night #1330d2 #304cd2 #152faf #07188f #0f0b2d; warm #e78e2a #f36916 #d28930 #692716;
wood/inside #8f542c #b78656 #4e2c2d #6d4f51; day #f1f2f3 #70aa79 #6db3ee.

## Light
- Key: DirectionalLight 0xFFE2B8, 2.2, upper-left front (az ~-35, el ~40), position (-0.6, 0.8, 0.5); hard cast
  shadows ~1x character height (shadow map 2048, radius 1.5).
- Fill: HemisphereLight 0x8C7BB8 / 0x3A2438, 0.6 (key:fill ~3.7:1, shade luma ~0.20, shade/lit 0.26).
- Rim: DirectionalLight 0xFFB070, 0.8 at (0.4, 0.5, -0.8).
- Bloom on practicals only: strength 0.35, radius 0.4, threshold 0.85; emissive 0xFFC870 x2.
- ACES tone mapping, exposure 0.85.

## Materials and ink
- Ink colour 0x261a22 (warm near-black), never 0x000000. 7-17% of pixels.
- Width at 1080 wide: clamp(6 * (5 / dist), 1.5, 7) px; near 4-6 on world props, far 1-2.
- Inked: silhouettes (inverted hull), creases (EdgesGeometry 30), plank/brick seams, window/door insets, trim.
  Never on sky, water or shadow edges.
- Textures painted in canvas: 2-tone, ±6% value noise, seams as 2-3 px ink lines (planks ~40 px, bricks 24x12 px),
  soft gradient + AO at the base.
- Toon ramp 3 steps: 1.0 / 0.82 / 0.62.
- Houses: windows, doors, eave overhang, roof tile rows, wall planks/brick, 3+ props each.

## Characters
- Our mascot is fixed (approved drawing, thick arms by Loc's choice): do not copy the reference's thin limbs.
- Outline 6 px #2a1210 (~2% of head width) for new characters.
- Lit by the scene: gradient along the light direction 0 -> -30% L, shadow tint #6a5acd 25% multiply; night tints them blue.
- Contact shadow always: ellipse 1.1x foot span, 12 px tall, #000 35%, blur 6.
- Height in wides ~0.30 of frame height (ours 0.50).
- Side characters 1-5 per shot, swap expression/gesture every 6-10 f, sweat drops on stress.

## Depth
- Background blur sigma at 1080: close-up 4 (to 5), medium 2, wide 0-1; focus on the face.
- DOF on 35-40% of shots: all close-ups + ~1 in 4 mediums.
- Shot mix: ~25% wide, 50% medium, 25% close-up (incl. prop inserts). Ours has no close-ups.
- Foreground prop on 25% of shots: 15-30% of frame width at a side edge, blur sigma 6-10.
- Fog on wides only, sky tint (~0x8fa6d6).
- Captions sit at ~70% of height; heads at 25-45%.

## Camera
- Moving 57-87% of frames; never static more than 15 f: hold creep zoom 0.05-0.08%/f + drift 0.2-0.3 px/f.
- Move lengths: 50% 20-45 f, 25% snaps 8-14 f (8-10 px/f or 2-2.6%/f, ease-out), 25% slow glides 90-140 f.
- Easing cubic in-out, 80% speed ~28% into the move.
- ~40% zoom-led, 60% pan/track-led; push-in : pull-back 65 / 35.
- Roll/tilt that unwinds over ~10 f, used sparingly.

## Pacing
- Something new starts every ~1.9 s (max 4 s); 1.7 events per sentence; reaction +1 f on the word (-2..+4).
- New place every 3-5 s, reached by camera travel through one world (~20 f) or a 5 f crossfade; hard cuts 0-1 per video.
- Every shot has at least one ambient loop (water, flags, background props).
- Voice: 3.6 words/s, longest silence 0.45 s, first word at 0.00 s.
