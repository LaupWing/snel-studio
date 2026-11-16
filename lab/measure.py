"""Adds a numbers table under vs-ricks.png: our stills vs the 3 Ricks frames.
usage: measure.py <vs-ricks.png> <number of our stills>   (run with the scan venv python: it has PIL + numpy)"""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont
path, n = sys.argv[1], int(sys.argv[2])
im = Image.open(path).convert('RGB'); cols = n + 3; W = im.width // cols

def stats(c):
    hsv = np.asarray(c.convert('HSV')).reshape(-1, 3).astype(float); h = hsv[:, 0] / 255 * 360; s = hsv[:, 1] / 255
    l = np.asarray(c.convert('L')) / 255.; hh = h[s > .25]
    f = lambda a, b: ((hh >= a) & (hh < b)).mean() if len(hh) else 0
    return dict(luma=l.mean(), white=(l > .8).mean(), sat=s.mean(), orange=f(0, 40) + f(330, 361), blue=f(170, 260))

S = [stats(im.crop((i * W, 0, (i + 1) * W, im.height))) for i in range(cols)]
R = {k: (min(x[k] for x in S[n:]), max(x[k] for x in S[n:])) for k in S[0]}
rows = [('luma', '{:.2f}'), ('white', '{:.0%}'), ('sat', '{:.2f}'), ('orange', '{:.0%}'), ('blue', '{:.0%}')]
lh = 34; strip = Image.new('RGB', (im.width, lh * (len(rows) + 1) + 10), (24, 22, 30)); d = ImageDraw.Draw(strip)
try: font = ImageFont.truetype('/System/Library/Fonts/Menlo.ttc', 24)
except OSError: font = ImageFont.load_default()
for i in range(cols): d.text((i * W + 14, 6), 'OURS' if i < n else 'RICKS', fill=(200, 200, 220), font=font)
for r, (k, fmt) in enumerate(rows):
    y = 6 + lh * (r + 1); lo, hi = R[k]
    for i, x in enumerate(S):
        ok = i >= n or lo - 0.02 <= x[k] <= hi + 0.02
        d.text((i * W + 14, y), f'{k:6} ' + fmt.format(x[k]), fill=(235, 235, 235) if i >= n else ((120, 220, 120) if ok else (255, 110, 110)), font=font)
out = Image.new('RGB', (im.width, im.height + strip.height)); out.paste(im, (0, 0)); out.paste(strip, (0, im.height)); out.save(path)
for k, _ in rows: print(f'{k:6} ours ' + ' '.join(f'{x[k]:.2f}' for x in S[:n]) + f'  | ricks {R[k][0]:.2f}-{R[k][1]:.2f}')
