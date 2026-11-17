# Lab: toon-2d

One line per test. Details in each folder's NOTES.md, stills in `out/lab/toon-2d/<test>/`.

| Test | Tried | Result |
|---|---|---|
| 2026-11-16-street | stack check: Remotion + three.js, mascot card, ink, push-in | works, looks flat |
| 2026-11-16-style-guide | style guide values: light, painted textures, ink seams, props, DOF + bloom + ACES | big step up; ACES too pale, DOF too weak, mascot grey; vs Ricks: too empty, too front-on |
| 2026-11-16-od-post | Open Design post pass + lit mascot card, high 3/4 camera, more props | shadows + high angle good; colour wrong once measured (84% orange, 0% white, sat 0.62) |
| 2026-11-16-palette | post knobs sat 0.95 + knee 0.92, cream/blue/white palette, numbers table under vs-ricks | luma, white, sat, blue inside Ricks range; orange 73% still high, camera less high |
| 2026-11-16-mascot-light | mascot card self-lit (self 0.8), blue middle house, camera back up | mascot 91% of his drawing (was dark); palette overshot to 60% blue |
| 2026-11-17-ink-split | ink only on mascot + hero prop, set plain lit 3D, palette between 4 and 5 | mascot brighter than frame for the first time; 4/5 numbers in range, white 0% |
| 2026-11-17-set-light | key + hemi up, pure white trims, hero ink 3x | hero ink reads; white still 0% (no white surface in direct light) |
| 2026-11-17-mascot-3d | mascot as real 3D model (sizes/colours from the drawing), turns + waves | Loc: flat card is better, mascot stays a card |
| 2026-11-17-side-chars | OD side-character kit as flat cards (smug, doomer, shock), white house, close-up | reads as a scene, same style; white still 0% (white wall in shade) |
| 2026-11-17-meme-focus-ink | wojak heads from Expansion, focus follows the mascot, set ink knob none/props/all | memes read, close-up sharp; ink "all" too thin to see |
| 2026-11-17-wojak-body | wojak bodies matching the meme heads (colour + thin line from the PNG), own side characters kept | memes read as one drawing |
| 2026-11-17-wojak-body (arms) | thick arms on every character (mascot, own side chars, wojaks) | Loc: prima |
| 2026-11-17-template-v1 | proven pieces moved into src/templates/toon-2d, ToonDemo built only from the template | matches test 11; meme-loading bug fixed |
| 2026-11-17-jensen-face | Jensen traced from a real photo on a 20 px grid, drawn in photo space | Loc: prima (with neck); moved to templates/toon-2d/people/jensen.js |
