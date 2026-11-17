# snel-studio

Templates for Snelstack reel b-roll. One template per video style, built once and made right,
then used by every reel so the look stays consistent. Read README.md for the why.

## Structure
```
src/templates/toon-2d/     first template: flat 2D characters in a painted 3D toon world
  stage.tsx                stage kit (flight case, wedge, speaker, lectern, truss + spots, StageSet hall)
  people/<name>.js         real people traced from a photo (photo itself on Expansion, never in git)
src/videos/<slug>          symlink to <writing repo>/snelstack/video_scripts/shorts/<slug>/scenes (gitignored);
                           the video's own scene code lives next to its script, see src/videos/README.md
src/templates/code-explainer/  later: code pages in 3D, Loc explains
references/                measurements of reference videos (numbers, never opinions)
lab/<template>/             one folder per test (+ README.md overview); lab/shared/ for tests that apply to all
out/                       renders and stills (not in git)
```

## How a template works
- Fixed in the template: light and palette, ink lines, blur and grade, our mascot and side
  characters, a set of camera moves, one knobs file (camera speed, light, blur).
- Per shot the agent only writes the scene: which place, who stands where, what happens on which word.
- Stills first, then render. Same code makes both. Loc approves the stills at a glance before
  anything is rendered.
- A tweak ("camera slower") is a knob, not a new prompt.
- Something a second video could use (a prop, a set, a person) goes into the template, never into the video.
- Props the Ricks way (Loc 2026-11-17): a real object of 4-6 parts (body, insets, trim, hardware, a label),
  rounded edges, painted 2-tone face with ink seams and +-6% noise, an AO pool under it. Never a bare box.

## Rules
- Measure, don't eyeball. Compare against a reference in numbers.
- Study references, never copy their scripts, characters or shots. Ours stay ours.
- This repo is public: no reference frames or videos from other channels in git.
- Our mascot comes from the approved drawing; never redraw or restyle him.
- Shots are literal: show the real thing the line is about, no metaphors.
- Code and comments in English. Keep files small.
- No commit or push without Loc's explicit go.

## Build order (per template)
1. One test scene in lab/, four stills.
2. Side by side with the reference, measure, fix. Max 3-4 rounds, until Loc says "this is it".
3. Run one existing script through the template, next to the old version.
4. Only then into the pipeline.

## Scan
To measure reference videos: use the scan skill (`.claude/skills/scan/SKILL.md`).

## Lab
Every test gets its own folder `lab/<template>/<YYYY-MM-DD>-<name>/` (or `lab/shared/` when it applies to all templates): the scene file(s) plus `NOTES.md` with
goal, what was tried, where the stills are (`out/lab/<template>/<same name>/`), the result, and the verdict
(keep → move into the template, or drop and why). Never overwrite an old test; start a new folder, and add one line to `lab/<template>/README.md`.
Every test ends with ONE image for Loc: our stills next to 2-3 reference frames (`vs-ricks.png`), never separate files.
Make it with `lab/compare.sh <out dir> <stills>`: it adds a numbers table (luma, white, sat, orange, blue; red = outside the Ricks range). Never call a look close by eye: report the table.
