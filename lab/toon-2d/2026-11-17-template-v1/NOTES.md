# 2026-11-17 template-v1

**Goal:** move what the lab proved (tests 3-11) into `src/templates/toon-2d/` and check the template on its own.

**What:** look.ts (measured knobs: sky, fog, key/hemi/rim, ink widths, post sat/knee/k, character self-light),
World.tsx (InkCtx + roles set/prop/hero, Toon, Set3D, Ink, Solid, Box, Sky, Lights), props.tsx (House, Barrel, Plant,
Lamp, Ground), characters.tsx (Mascot, Side, MemeGuy, useMemes, ARMS), Scene.tsx (ToonScene = canvas + sky + lights +
fog + ink mode + Post with focusOn), sidekit.js + wojakbody.js + paint.ts (copies), Card.tsx/Post.tsx/mascot2d.js as
before. Check comp `ToonDemo` = the test 11 street built only from template pieces. Test 1 got its own frozen copy of
the old look.ts/World.tsx.
Bug found: memes loaded after the canvas mounted never showed (Remotion's canvas does not redraw on a late state
change; earlier tests only worked by timing luck). Fix: load memes first, mount the scene after (`if (!m) return null`).

**Stills:** `out/lab/toon-2d/2026-11-17-template-v1/demo_0.png`, `demo_close_45.png`, `vs-ricks.png`.

**Result:** matches test 11 (luma 0.43-0.48, mascot, own side characters, 4 wojaks, thick arms, focus on the mascot).
Open: whites still 1-5%, close-up too blue (blue house behind).

**Verdict:** template v1 stands. Next: catalog, then one real script through the template.
