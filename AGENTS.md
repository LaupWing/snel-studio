# snel-studio

Templates for Snelstack reel b-roll. One template per video style, built once and made right,
then used by every reel so the look stays consistent. Read README.md for the why.

## Structure
```
templates/toon-2d/         first template: flat 2D characters in a painted 3D toon world
templates/code-explainer/  later: code pages in 3D, Loc explains
references/                measurements of reference videos (numbers, never opinions)
lab/                       test scenes while building a template
out/                       renders and stills (not in git)
```

## How a template works
- Fixed in the template: light and palette, ink lines, blur and grade, our mascot and side
  characters, a set of camera moves, one knobs file (camera speed, light, blur).
- Per shot the agent only writes the scene: which place, who stands where, what happens on which word.
- Stills first, then render. Same code makes both. Loc approves the stills at a glance before
  anything is rendered.
- A tweak ("camera slower") is a knob, not a new prompt.

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
