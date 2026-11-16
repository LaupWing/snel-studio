"""How bright is the mascot in our still vs his own flat drawing (the target: Ricks' characters are the brightest thing in frame).
usage: mascot.py <full still.png> <flat still.png>   flat = same frame, only the mascot as the plain drawing on pure green."""
import sys, numpy as np
from PIL import Image
full = np.asarray(Image.open(sys.argv[1]).convert('RGB')).astype(float) / 255
flat = np.asarray(Image.open(sys.argv[2]).convert('RGB')).astype(float) / 255
m = ~((flat[..., 1] > .8) & (flat[..., 0] < .3) & (flat[..., 2] < .3))
L = lambda a: (a @ [.2126, .7152, .0722])[m].mean()
lf, ld, frame = L(full), L(flat), (full @ [.2126, .7152, .0722]).mean()
print(f'mascot luma {lf:.2f} | drawing {ld:.2f} | {lf/ld:.0%} of the drawing | frame avg {frame:.2f} | mascot {"brighter" if lf > frame else "DARKER"} than the frame')
