# videos

One symlink per video: `src/videos/<slug> -> <writing repo>/snelstack/video_scripts/shorts/<slug>/scenes`.
The scene code lives next to its script; this repo only holds the template. Symlinks are gitignored.
Each `scenes/index.tsx` exports `compositions` (Root picks them up). Import the template as
`../../templates/toon-2d/...` (resolved from the link: remotion.config.ts sets `symlinks: false`).
