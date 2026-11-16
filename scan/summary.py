# Median + spread of every metric over all measured videos -> summary.md next to the jsons.
# usage: summary.py <measure dir>
import json, sys, glob, os, numpy as np
d = sys.argv[1]; R = [json.load(open(f)) for f in sorted(glob.glob(os.path.join(d, '*.json')))]
keys = [k for k in R[0] if isinstance(R[0][k], (int, float)) and k != 'frames']
lines = [f'# Reference summary ({len(R)} videos)', '', '| metric | median | p10 | p90 |', '|---|---|---|---|']
for k in keys:
    v = np.array([r[k] for r in R if r.get(k) is not None], float)
    lines.append(f'| {k} | {np.median(v):.2f} | {np.percentile(v, 10):.2f} | {np.percentile(v, 90):.2f} |')
open(os.path.join(d, 'summary.md'), 'w').write('\n'.join(lines) + '\n'); print('\n'.join(lines))
