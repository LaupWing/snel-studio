---
name: scan
description: Measure reference videos (a channel's top shorts or one video Loc sends) and turn them into a style guide in numbers, then compare our own shots against it. Triggers on "scan", "meet deze video's", "analyseer dit kanaal", "style guide", "waarom ziet het er goedkoop uit".
---

# Scan

Measure, don't eyeball: you can't rebuild an opinion, you can rebuild a number.
Study only: never copy a reference's script, characters or shots.

Files live on Expansion, never in git: `/Volumes/Expansion/snelstack/snel-studio/references/<name>/`.
Only the style guide (numbers) goes in git: `references/<style>.md`.

## Steps
1. **Download.** Top 20 of a channel by views (`~/.local/share/snel-whisper/bin/yt-dlp --flat-playlist
   --print "%(view_count)s|%(id)s|%(title)s" <channel>/shorts`, sort, download as `<views>_<id>.mp4`).
   Check one frame per video; drop any that is not the style.
2. **Measure.** `.claude/skills/scan/run.sh <folder> [skip-id,skip-id]` → `measure/*.json`,
   `sheets/<video>/` (60 frames per image, 2 s each), `measure/summary.md`.
3. **Ours.** Symlink 5 of our shots into `references/ours/`, run the same script. Compare both summaries.
4. **Topic agents.** Pick the topics that apply (table below). Start one agent per topic, all at once,
   each with its brief from `topics/<topic>.md` plus: the reference folder, both summary.md files,
   and 6-8 chosen videos (spread over day/night, inside/outside, close/wide).
   Each answers in ≤200 words, numbers only. Agents can't write files: save each answer yourself
   to `<folder>/reports/<topic>.md`.
5. **Style guide.** Merge the reports into `references/<style>.md`: per topic the target values,
   ours, and the gap. The gaps are the template's to-do list.

## Topics
| Topic | When |
|---|---|
| color | always |
| light | always |
| camera | always |
| depth | always |
| pacing | always |
| characters | when there are characters |
| materials | when surfaces are drawn or stylised (textures, ink outlines) |
