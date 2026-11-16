# Contact sheets of every frame: sheet NN = 60 frames (2 s @ 30 fps), 10x6, frame number top-left.
# usage: sheets.py <video> <outdir>      (run with the whisper venv python: numpy + PIL)
import os, subprocess, sys, numpy as np
from PIL import Image, ImageDraw
vid, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
W, H = 144, 256
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vid, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
for k in range(0, len(F), 60):
    im = Image.new('RGB', (W * 10, H * 6)); d = ImageDraw.Draw(im)
    for j, f in enumerate(F[k:k + 60]):
        x, y = (j % 10) * W, (j // 10) * H; im.paste(Image.fromarray(f), (x, y))
        d.rectangle([x, y, x + 38, y + 14], fill='black'); d.text((x + 2, y + 1), str(k + j), fill='yellow')
    im.save(os.path.join(out, f's{k // 60:02d}.jpg'), quality=82)
print(len(F), 'frames ->', out)
