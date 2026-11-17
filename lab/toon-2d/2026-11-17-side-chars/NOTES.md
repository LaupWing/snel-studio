# 2026-11-17 side-chars

**Goal:** the frame was a set, not a story: add side characters (flat cards, like the mascot; Loc keeps flat), a close-up,
and a white surface for whites.

**What:** `sidekit.js` = our Open Design side-character kit ported 1:1 (harvest #10, heartbleed shot 15): suit/hoodie,
slick hair/beanie, drawn faces smug/doomer/shock, sweat drop, big '!' mark; standing legs for both outfits. Card.tsx got
`draw` + `drawKey` so any drawing becomes a lit card. Three side characters around the mascot (smug pointing, doomer,
shock with '!'), left house white plaster. Close-up = mode 'close'.

**Stills:** `out/lab/toon-2d/2026-11-17-side-chars/sc_0.png`, `sc_89.png`, `close_45.png`, `vs-ricks.png`.

**Result:** the frame reads as a scene now; faces read even small, the close-up looks like a real shot. Same style as
the mascot. White still 0-1%: the white house is in half shade (key from the left-front, facade faces the camera) so it
renders grey. Close-up blue 45% (blue house fills the background).

**Verdict:** keep sidekit.js + Card `draw` (template candidates). Whites need the key turned so a white wall faces it.
