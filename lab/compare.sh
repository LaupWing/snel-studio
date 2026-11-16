#!/bin/bash
# One image for Loc: our stills next to 3 fixed reference frames.  usage: lab/compare.sh <out dir> <still.png>...
# Reference frames come from Expansion (never in git). Writes <out dir>/vs-ricks.png and opens it.
OUT="$1"; shift; R=/Volumes/Expansion/snelstack/snel-studio/references/ricks; T=$(mktemp -d)
ffmpeg -v error -y -ss 22 -i $R/29521037_7xS87iActkU.mp4 -frames:v 1 $T/r1.png
ffmpeg -v error -y -ss 8 -i $R/9922149_nzbkkEZFM8g.mp4 -frames:v 1 $T/r2.png
ffmpeg -v error -y -ss 22 -i $R/9922149_nzbkkEZFM8g.mp4 -frames:v 1 $T/r3.png
IN=(); for f in "$@" $T/r1.png $T/r2.png $T/r3.png; do IN+=(-i "$f"); done
N=$(( $# + 3 )); F=""; for i in $(seq 0 $((N-1))); do F+="[$i]scale=-1:960[v$i];"; done
for i in $(seq 0 $((N-1))); do F+="[v$i]"; done; F+="hstack=$N,scale=$((N*360)):-1"
ffmpeg -v error -y "${IN[@]}" -filter_complex "$F" "$OUT/vs-ricks.png"; rm -rf $T
# Numbers under the image (green = inside the Ricks range, red = outside). Never judge a look by eye alone.
~/.local/share/snel-whisper/bin/python "$(dirname "$0")/measure.py" "$OUT/vs-ricks.png" $(( N - 3 ))
echo "$OUT/vs-ricks.png"; open "$OUT/vs-ricks.png"
