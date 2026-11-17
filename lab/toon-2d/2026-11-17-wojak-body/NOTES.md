# 2026-11-17 wojak-body

**Goal:** Loc on test 10: the wojak heads look pasted on our thick cartoon bodies. Give memes a body that matches the
head, and keep our own drawn side characters too.

**What:** `wojakbody.js`: the PNG (with its own neck + shoulders) on top, the torso continues straight down from the
shoulders in the colour read from the PNG's bottom row, same thin black MS Paint line; our thin arms with ball hands
but drawn in that line style; plain pants + shoes. Scene: wojak ('!'), doomer, npc, chad as wojak bodies + our own
smug (suit) and shock (hoodie) side characters + the mascot.

**Stills:** `out/lab/toon-2d/2026-11-17-wojak-body/wb_0.png`, `wb_89.png`, `close_45.png`, `vs-ricks.png`.

**Result:** head and body are one drawing now: white wojak, black doomer, grey npc read as real wojak figures; our own
characters stay as they were. Chad ended up behind the left barrel (not visible). measure() in wojakbody.js has leftover
junk lines to clean before it moves to the template.

**Arms (Loc 2026-11-17):** no thin arms on any character. Mascot (mascot2d.js), own side characters (sidekit, outfit colour + skin hands) and wojak bodies (body colour) all get thick sleeves ~ leg width (ink 92, fill 74) with round hands. Loc: "dan vind ik het prima".

**Verdict:** keep wojakbody.js, sidekit.js and the thick arms (template candidates).
