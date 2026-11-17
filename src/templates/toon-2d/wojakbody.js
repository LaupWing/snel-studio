// Wojak bodies that match the meme head: the PNG (with its neck + shoulders) sits on top, the body continues from the
// shoulders in the SAME colour and the SAME thin black MS Paint line, so head and body are one drawing.
// Canvas 1000 x 1650 like every card (200 px headroom). Body colour + shoulder span are read from the PNG's bottom rows.
const LINE = '#111111', LW = 6;
const info = new WeakMap();
function measure(img) {
  if (info.has(img)) return info.get(img);
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  // lowest row that is mostly opaque (some PNGs end in a few transparent rows)
  let y = img.height - 1, row = g.getImageData(0, y, img.width, 1).data;
  const opaque = (d) => { let n = 0; for (let x = 3; x < d.length; x += 4) if (d[x] >= 200) n++; return n; };
  while (y > img.height * 0.6 && opaque(row) < img.width * 0.2) { y--; row = g.getImageData(0, y, img.width, 1).data; }
  let l = -1, r = -1; const counts = {};
  for (let x = 0; x < img.width; x++) {
    if (row[x * 4 + 3] < 200) continue; if (l < 0) l = x; r = x;
    const k = [0, 1, 2].map((i) => row[x * 4 + i] >> 4).join(','); counts[k] = (counts[k] || 0) + 1;   // most common = body colour
  }
  const top = Object.entries(counts).sort((p, q) => q[1] - p[1])[0][0].split(',').map((v) => (+v << 4) + 8);
  const res = { l: l / img.width, r: r / img.width, yr: (y + 1) / img.height, color: `rgb(${top.join(',')})` };
  info.set(img, res); return res;
}
const darker = (rgb, f) => rgb.replace(/\d+/g, (v) => Math.round(v * f));
// o: { arms: {L,R} (mascot pose table), step, mark, legs: '#hex' pants colour }
function drawWojak(g, img, o = {}) {
  const m = measure(img), W = 520, H = W * img.height / img.width, x0 = 500 - W / 2, yb = 610;   // PNG bottom at body y 610
  let sl = x0 + m.l * W, sr = x0 + m.r * W; const body = m.color, pants = o.legs || '#3b3f52';
  if (sr - sl < 300) { const c = (sl + sr) / 2; sl = c - 150; sr = c + 150; }   // narrow busts (chad profile): keep a full torso
  g.save(); g.translate(0, 200); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = LINE; g.lineWidth = LW;
  // legs + shoes (behind the torso)
  for (const [x, k] of [[430, 0], [570, 1]]) {
    const lift = -40 * Math.max(0, k ? -(o.step || 0) : (o.step || 0));
    g.fillStyle = pants; g.beginPath(); g.roundRect(x - 50, 900 + lift, 100, 440, 22); g.fill(); g.stroke();
    g.fillStyle = '#f4f4f4'; g.beginPath(); g.roundRect(x - 80, 1330 + lift, 160, 74, 34); g.fill(); g.stroke();
  }
  // torso: continues straight down from the PNG shoulders, slight taper, same colour, thin line
  const tw = sr - sl, bl = sl + tw * 0.06, br = sr - tw * 0.06;
  g.fillStyle = body; g.beginPath(); g.moveTo(sl, yb - 4); g.lineTo(sr, yb - 4); g.quadraticCurveTo(sr + 6, 760, br, 960);
  g.lineTo(bl, 960); g.quadraticCurveTo(sl - 6, 760, sl, yb - 4); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(sr, yb); g.quadraticCurveTo(sr + 6, 760, br, 960); g.lineTo(bl, 960); g.quadraticCurveTo(sl - 6, 760, sl, yb); g.stroke();
  g.strokeStyle = darker(body, 0.8); g.lineWidth = 3; g.beginPath(); g.moveTo(500, 700); g.quadraticCurveTo(505, 800, 498, 900); g.stroke();
  // head PNG on top (its own neck + shoulders join the torso)
  g.drawImage(img, x0, yb - H * m.yr, W, H);   // measured shoulder row lands on the torso top
  // arms: thick (Loc 2026-11-17, no thin arms on any character), in the body colour with the thin line (two strokes), ball hands
  const pose = o.arms; const sh = [[sl + 46, yb + 40], [sr - 46, yb + 40]];
  for (const [s, [el, hd]] of [[sh[0], pose.L], [sh[1], pose.R]]) {
    const dx = s[0] - (s === sh[0] ? 325 : 675);
    const e = [el[0] + dx, el[1]], h = [hd[0] + dx, hd[1]];
    g.strokeStyle = LINE; g.lineWidth = 92; g.beginPath(); g.moveTo(...s); g.quadraticCurveTo(...e, ...h); g.stroke();
    g.strokeStyle = body; g.lineWidth = 92 - LW * 2; g.beginPath(); g.moveTo(...s); g.quadraticCurveTo(...e, ...h); g.stroke();
    g.fillStyle = body; g.strokeStyle = LINE; g.lineWidth = LW; g.beginPath(); g.arc(h[0], h[1], 42, 0, 6.283); g.fill(); g.stroke();
  }
  if (o.mark) {
    g.font = '900 260px "Arial Black", Arial, sans-serif'; g.textAlign = 'center';
    g.lineWidth = 30; g.strokeStyle = '#241726'; g.strokeText(o.mark, 500, yb - H - 20); g.fillStyle = '#ffd23a'; g.fillText(o.mark, 500, yb - H - 20);
  }
  g.restore();
}
export { drawWojak };
