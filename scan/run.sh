#!/bin/bash
# Measure + contact-sheet every video in a reference folder, then a summary table.
# usage: scan/run.sh <folder with mp4s> [skip-id,skip-id]
D="$1"; SKIP="${2:-}"; PY=~/.local/share/snel-whisper/bin/python; HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$D/measure" "$D/sheets"
for v in "$D"/*.mp4; do
  b=$(basename "$v" .mp4); id=${b#*_}
  [[ ",$SKIP," == *",$id,"* ]] && { echo "skip $b"; continue; }
  [ -f "$D/measure/$b.json" ] || $PY "$HERE/measure.py" "$v" "$D/measure/$b.json" > /dev/null
  [ -d "$D/sheets/$b" ] || $PY "$HERE/sheets.py" "$v" "$D/sheets/$b" > /dev/null
  echo "done $b"
done
$PY "$HERE/summary.py" "$D/measure"
