# 2026-11-17 meme-focus-ink

**Goal:** Loc on test 9: (1) use real meme faces, (2) the close-up was blurry (bug: focus fixed at 9.8 m, camera ~3.5 m),
(3) ink only on characters is not a hard rule: some Ricks videos ink the set too.

**What:** `public/memes` = symlink to Expansion `assets/memes/wojak` (gitignored, never in git); sidekit `meme` option puts
the PNG head on the card body; loaded with delayRender. Post.tsx `focusOn` = world point whose view depth sets the focus
every frame. Set ink knob `ink`: none / props (barrels, plants) / all (also houses, boxes).
Stills: props_0 (ink props), close_45 (ink none), all_89 (ink all).

**Result:** chad, doomer, wojak (with '!'), npc read clearly. Close-up: mascot + wojak sharp now, background soft.
Ink 'all' barely visible on the houses at this distance (hull 0.035 is thin on big boxes). Whites still 1-3%.

**Verdict:** keep `focusOn` (Post) and the meme heads. Ink 'all' needs a thicker set hull before it can be judged.
