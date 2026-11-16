# Measure one vertical short frame by frame (30 fps): light, colour, ink, blur, motion, cuts.
# usage: measure.py <video> <out.json>     (numpy; run with the whisper venv python)
# Numbers only. Motion at 720 px wide; the caption band (lower middle) is skipped for motion.
import json, subprocess, sys, numpy as np
vid, out = sys.argv[1], sys.argv[2]
W, H = 270, 480
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vid, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.float32) / 255
n = len(F)
lum = F @ np.array([.2126, .7152, .0722])
mx, mn = F.max(3), F.min(3)
sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)

def hue(px):                                    # mean hue (deg) of an Nx3 pixel list, circular
    r, g, b = px[:, 0], px[:, 1], px[:, 2]
    h = np.degrees(np.arctan2(np.sqrt(3) * (g - b), 2 * r - g - b)) % 360
    return round(float(np.degrees(np.angle(np.exp(1j * np.radians(h)).mean())) % 360), 1)

def shift(a, b):                                # camera pan by phase correlation
    A = np.fft.fft2(a - a.mean()); B = np.fft.fft2(b - b.mean()); R = A * np.conj(B); R /= np.abs(R) + 1e-9
    r = np.abs(np.fft.ifft2(R)); y, x = np.unravel_index(r.argmax(), r.shape); h, w = r.shape
    return (x if x < w / 2 else x - w), (y if y < h / 2 else y - h)

def lap(a):                                     # laplacian (sharpness / edges)
    return np.abs(4 * a[1:-1, 1:-1] - a[:-2, 1:-1] - a[2:, 1:-1] - a[1:-1, :-2] - a[1:-1, 2:])

diff = np.abs(np.diff(lum, axis=0)).mean((1, 2))
cuts = [i + 1 for i in range(1, n - 2) if diff[i] > 0.12 and diff[i] > 4 * np.median(diff[max(0, i - 5):i + 6])]

g = lum[:, int(H * .05):int(H * .55)]
mot = np.array([np.hypot(*shift(g[i + 1], g[i])) * (720 / W) for i in range(n - 1)])
moving = mot >= 0.5
runs, k = [], 0                                 # glide length: consecutive moving frames
for m in moving:
    if m: k += 1
    elif k: runs.append(k); k = 0
if k: runs.append(k)

ink, sharp_top, sharp_mid, shadow_h, light_h, black = [], [], [], [], [], []
for i in range(0, n, 3):                        # every 3rd frame
    L, f = lum[i], F[i]
    e = lap(L); dark = L[1:-1, 1:-1] < 0.12
    ink.append(float(((e > 0.25) & dark).mean() * 100))                    # % dark edge pixels = ink lines
    sharp_top.append(float(lap(L[:int(H * .25)]).var() * 1e3))               # background (top) sharpness
    sharp_mid.append(float(lap(L[int(H * .3):int(H * .65)]).var() * 1e3))   # subject zone sharpness
    sh = f[(L > 0.08) & (L < 0.3)]; li = f[L > 0.7]
    if len(sh) > 50: shadow_h.append(hue(sh))
    if len(li) > 50: light_h.append(hue(li))
    black.append(float((L < 0.03).mean() * 100))

med = lambda a: round(float(np.median(a)), 2)
res = {'video': vid.split('/')[-1], 'frames': n, 'sec': round(n / 30, 2),
       'luma_median': med(lum), 'luma_p5': round(float(np.percentile(lum, 5)), 3), 'luma_p95': round(float(np.percentile(lum, 95)), 3),
       'contrast_std_median': med(lum.std((1, 2))),
       'sat_median': med(sat), 'sat_p90': round(float(np.percentile(sat, 90)), 3),
       'pure_black_pct': med(black),
       'shadow_hue_deg': med(shadow_h) if shadow_h else None, 'highlight_hue_deg': med(light_h) if light_h else None,
       'ink_edge_pct': med(ink),
       'sharpness_bg_top': med(sharp_top), 'sharpness_subject_mid': med(sharp_mid),
       'bg_vs_subject_sharpness': round(med(sharp_top) / max(med(sharp_mid), 1e-6), 2),
       'hard_cuts': len(cuts), 'cut_times_s': [round(c / 30, 2) for c in cuts],
       'camera_moving_pct': round(float(moving.mean() * 100), 1),
       'pan_px_per_frame_median_when_moving': round(float(np.median(mot[moving])), 2) if moving.any() else 0,
       'pan_px_per_frame_p90': round(float(np.percentile(mot, 90)), 1),
       'glide_frames_median': med(runs) if runs else 0, 'glide_frames_p90': round(float(np.percentile(runs, 90)), 1) if runs else 0,
       'frames_with_any_change_pct': round(float((diff > 0.004).mean() * 100), 1)}
json.dump(res, open(out, 'w'), indent=1); print(json.dumps(res))
