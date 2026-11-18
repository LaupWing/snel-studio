// OUR 2D MASCOT (toon-2d, Loc approved 2026-11-11). Taken 1:1 from the approved sample (_style-2d-test shot 1),
// only change: NO FACE, one big lightning bolt on the head. Emotion is drawn ON/AROUND the head (blush, sweat, ! ? Zz,
// sparkles, glow colour). Use it EXACTLY as is: never redraw, restyle or re-proportion him.
//
// Design canvas 1000 x 1650 (200 px headroom for ! ? Zz on top, feet at the bottom ~y 1640). Usage:
//   const can = document.createElement('canvas'); can.width = 1000 * S; can.height = 1650 * S;
//   const g = can.getContext('2d'); g.setTransform(S,0,0,S,0,0);
//   drawMascot2D(g, { arms: MASCOT_ARMS.down, blush: 0..1, sweat: 0..1, mark: '' | '!' | '?' | 'z' | 'anger',
//                     sparkle: 0..1, glow: '#hex' | null, legs: true });
//   then use the canvas as a texture on a camera-facing plane (aspect 1000:1650), lit by the scene.
// arms: { L: [[elbowX, elbowY], [handX, handY]], R: [...] } in body px (before the 200 px headroom); shoulders at (325,592) and (675,592).
const MASCOT_ARMS = {
  down:  { L: [[290, 760], [300, 900]], R: [[710, 760], [700, 900]] },
  wave:  { L: [[290, 760], [300, 900]], R: [[800, 520], [860, 360]] },
  point: { L: [[290, 760], [300, 900]], R: [[820, 600], [960, 560]] },
  up:    { L: [[200, 500], [170, 330]], R: [[800, 500], [830, 330]] },
  type:  { L: [[300, 760], [400, 860]], R: [[700, 760], [600, 860]] },
  cover: { L: [[300, 720], [450, 420]], R: [[700, 720], [550, 420]] },   // hands over the mouth (shock)
  cuff:  { L: [[260, 700], [420, 760]], R: [[740, 700], [580, 760]] },   // both hands in front of the chest (cuffing)
  head:  { L: [[220, 520], [330, 210]], R: [[780, 520], [670, 210]] },   // hands on the head (disbelief)
};
const INKC = '#241726';
function inked(g, fns, fill, lw) {
  g.strokeStyle = INKC; g.lineWidth = lw * 2;
  for (const f of fns) { g.beginPath(); f(); g.stroke(); }
  g.fillStyle = fill;
  for (const f of fns) { g.beginPath(); f(); g.fill(); }
}
function shadeIn(g, fns, paint) { g.save(); g.beginPath(); for (const f of fns) f(); g.clip(); paint(); g.restore(); }
const rr = (g, x, y, w, h, r) => () => g.roundRect(x, y, w, h, r);
function drawLegs(g) {
  const shoes = [rr(g, 322, 1352, 175, 88, 40), rr(g, 503, 1352, 175, 88, 40)];
  inked(g, shoes, '#f8f5f0', 9);
  shadeIn(g, shoes, () => { g.fillStyle = '#ddd5ea'; g.fillRect(300, 1410, 400, 40); g.fillStyle = '#cbc3dc'; g.fillRect(450, 1340, 40, 110); g.fillRect(630, 1340, 60, 110); });
  g.strokeStyle = INKC; g.lineWidth = 6;
  for (const sx of [410, 590]) {
    g.beginPath(); g.moveTo(sx - 82, 1410); g.lineTo(sx + 82, 1410); g.stroke();
    g.beginPath(); g.arc(sx, 1392, 38, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.lineWidth = 5; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(sx - 20, 1362 + k * 11); g.lineTo(sx + 20, 1362 + k * 11); g.stroke(); } g.lineWidth = 6;
  }
  const shins = [rr(g, 360, 1000, 100, 320, 30), rr(g, 540, 1000, 100, 320, 30), rr(g, 348, 1288, 124, 72, 22), rr(g, 528, 1288, 124, 72, 22)];
  inked(g, shins, '#3f74d1', 9);
  shadeIn(g, shins.slice(0, 2), () => { g.fillStyle = '#2c55a0'; g.fillRect(432, 990, 40, 340); g.fillRect(612, 990, 40, 340); });
  g.fillStyle = '#7aa4ea'; shins.slice(2).forEach(f => { g.beginPath(); f(); g.fill(); });
  shadeIn(g, shins.slice(2), () => { g.fillStyle = '#5c86d0'; g.fillRect(440, 1280, 40, 90); g.fillRect(620, 1280, 40, 90); });
  g.strokeStyle = INKC; g.lineWidth = 6;
  for (const x of [348, 528]) { g.beginPath(); g.moveTo(x + 4, 1324); g.lineTo(x + 120, 1324); g.stroke(); g.beginPath(); g.roundRect(x, 1288, 124, 72, 22); g.stroke(); }
  const thighs = [rr(g, 342, 884, 140, 152, 62), rr(g, 518, 884, 140, 152, 62), rr(g, 418, 878, 164, 84, 30)];
  inked(g, thighs, '#4a7fd8', 9);
  shadeIn(g, thighs, () => { g.fillStyle = '#2f5aa6'; g.fillRect(612, 870, 60, 180); g.fillRect(470, 960, 60, 80); });
  g.strokeStyle = INKC; g.lineWidth = 5;
  g.beginPath(); g.moveTo(500, 905); g.lineTo(500, 1000); g.stroke();
  for (const x of [412, 588]) { g.beginPath(); g.arc(x, 1004, 22, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); }
}
function drawTorso(g) {
  g.strokeStyle = INKC; g.lineWidth = 18; g.beginPath(); g.ellipse(500, 548, 192, 62, 0, 0, 6.283); g.stroke();
  g.fillStyle = '#a8a3ba'; g.fill();
  const torso = [() => { g.moveTo(300, 640); g.quadraticCurveTo(300, 546, 400, 540); g.lineTo(600, 540); g.quadraticCurveTo(700, 546, 700, 640); g.lineTo(690, 925); g.quadraticCurveTo(690, 946, 668, 946); g.lineTo(332, 946); g.quadraticCurveTo(310, 946, 310, 925); g.closePath(); }];
  inked(g, torso, '#bdb9c9', 9);
  shadeIn(g, torso, () => {
    g.fillStyle = '#8c86ab'; g.beginPath(); g.moveTo(622, 540); g.quadraticCurveTo(650, 740, 630, 950); g.lineTo(720, 950); g.lineTo(720, 540); g.fill();
    g.beginPath(); g.ellipse(500, 560, 210, 52, 0, 0, 6.283); g.fill();
    g.fillStyle = '#aaa5bd'; g.fillRect(300, 902, 400, 50);
  });
  g.strokeStyle = INKC; g.lineWidth = 6; g.beginPath(); g.moveTo(313, 902); g.lineTo(689, 902); g.stroke();
  g.lineWidth = 3; for (let x = 330; x < 680; x += 22) { g.beginPath(); g.moveTo(x, 908); g.lineTo(x, 940); g.stroke(); }
  g.beginPath(); g.moveTo(398, 788); g.lineTo(602, 788); g.lineTo(628, 890); g.lineTo(372, 890); g.closePath();
  g.fillStyle = '#b1acc2'; g.fill(); g.lineWidth = 7; g.stroke();
  for (const [x0, x1] of [[466, 456], [534, 544]]) {
    g.strokeStyle = INKC; g.lineWidth = 15; g.beginPath(); g.moveTo(x0, 590); g.lineTo(x1, 690); g.stroke();
    g.strokeStyle = '#f2eef8'; g.lineWidth = 7; g.beginPath(); g.moveTo(x0, 590); g.lineTo(x1, 690); g.stroke();
    g.fillStyle = INKC; g.beginPath(); g.arc(x1, 696, 9, 0, 6.283); g.fill();
  }
}
function drawHead2D(g, o) {
  const cx = 500, cy = 290, r = 228;
  if (o.glow) { const h = g.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 1.35); h.addColorStop(0, o.glow); h.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = h; g.beginPath(); g.arc(cx, cy, r * 1.35, 0, 6.283); g.fill(); }
  g.strokeStyle = INKC; g.lineWidth = 22; g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.stroke();
  const gr = g.createLinearGradient(330, 90, 690, 500);
  gr.addColorStop(0, '#b65cff'); gr.addColorStop(0.5, '#6f63ff'); gr.addColorStop(1, '#3a8cff');
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.fill();
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.clip();
  g.fillStyle = 'rgba(48,40,190,0.55)'; g.beginPath(); g.rect(200, 0, 700, 600); g.arc(cx - 46, cy - 40, r + 6, 0, 6.283, true); g.fill('evenodd');
  const gl = g.createRadialGradient(420, 190, 0, 420, 190, 230); gl.addColorStop(0, 'rgba(255,240,255,0.42)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gl; g.fillRect(200, 0, 600, 600);
  g.restore();
  g.save(); g.translate(392, 150); g.rotate(-0.55); g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.ellipse(0, 0, 46, 22, 0, 0, 6.283); g.fill(); g.restore();
  g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(352, 196, 10, 0, 6.283); g.fill();
  // ONE BIG lightning bolt, centred on the head (no face)
  g.save(); g.translate(cx + 6, cy + 4); g.scale(3.3, 3.3);
  g.beginPath(); g.moveTo(-14, -40); g.lineTo(20, -40); g.lineTo(5, -9); g.lineTo(24, -9); g.lineTo(-16, 42); g.lineTo(-4, 4); g.lineTo(-23, 4); g.closePath();
  g.lineJoin = 'round'; g.strokeStyle = INKC; g.lineWidth = 4.2; g.stroke(); g.fillStyle = '#ffffff'; g.fill(); g.restore();
  // emotion on the head
  if (o.blush > 0) {
    g.fillStyle = `rgba(255,128,176,${0.75 * o.blush})`;
    for (const x of [356, 644]) { g.beginPath(); g.ellipse(x, 372, 40, 21, 0, 0, 6.283); g.fill(); }
    g.strokeStyle = `rgba(255,200,222,${0.95 * o.blush})`; g.lineWidth = 5;
    for (const x of [356, 644]) for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(x + k * 15 - 5, 380); g.lineTo(x + k * 15 + 5, 364); g.stroke(); }
  }
  if (o.sweat > 0) {
    g.save(); g.globalAlpha = o.sweat; g.translate(742, 220);
    g.beginPath(); g.moveTo(0, -46); g.bezierCurveTo(26, -8, 34, 14, 0, 40); g.bezierCurveTo(-34, 14, -26, -8, 0, -46);
    g.fillStyle = '#8fd8ff'; g.fill(); g.strokeStyle = INKC; g.lineWidth = 8; g.stroke();
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(-9, 8, 6, 11, 0.3, 0, 6.283); g.fill(); g.restore();
  }
  if (o.sparkle > 0) {
    g.save(); g.globalAlpha = o.sparkle; g.fillStyle = '#fff6b0'; g.strokeStyle = INKC; g.lineWidth = 6;
    for (const [x, y, s] of [[220, 120, 1], [790, 90, 0.8], [830, 420, 0.65], [170, 400, 0.6]]) {
      g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = (i % 2 ? 14 : 44) * s; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); g.stroke();
    }
    g.restore();
  }
  if (o.mark) {
    g.save(); g.translate(500, -40); g.lineJoin = 'round';
    if (o.mark === '!' || o.mark === '?') {
      g.font = '900 150px Arial Black, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
      g.lineWidth = 18; g.strokeStyle = INKC; g.strokeText(o.mark, 0, 40); g.fillStyle = o.mark === '!' ? '#ffd23a' : '#ffffff'; g.fillText(o.mark, 0, 40);
    } else if (o.mark === 'z') {
      g.font = '900 90px Arial Black, Arial, sans-serif'; g.lineWidth = 12; g.strokeStyle = INKC; g.fillStyle = '#fff';
      [['Z', 80, 30], ['z', 160, -40], ['z', 220, -100]].forEach(([c, x, y]) => { g.strokeText(c, x, y); g.fillText(c, x, y); });
    } else if (o.mark === 'anger') {
      g.translate(220, 120); g.strokeStyle = '#ff3b4f'; g.lineWidth = 16; g.lineCap = 'round';
      for (const a of [0, 1.5708, 3.1416, 4.7124]) { g.save(); g.rotate(a); g.beginPath(); g.moveTo(14, -34); g.quadraticCurveTo(14, -14, 34, -14); g.stroke(); g.restore(); }
    }
    g.restore();
  }
}
// Arms = thick hoodie sleeves (~ leg width) + white mittens (Loc's choice: thick arms, 'geen dunne armpjes', as in the approved Open Design shots, e.g.
// heartbleed shot 04). Was a thin 21 px ink stick until 2026-11-17.
function drawArms2D(g, arms) {
  g.lineCap = 'round'; g.lineJoin = 'round';
  const SH = [[325, 592], [675, 592]];
  for (const [s, [el, hd]] of [[SH[0], arms.L], [SH[1], arms.R]]) {
    g.strokeStyle = INKC; g.lineWidth = 92; g.beginPath(); g.moveTo(s[0], s[1]); g.quadraticCurveTo(el[0], el[1], hd[0], hd[1]); g.stroke();
    g.strokeStyle = '#bdb9c9'; g.lineWidth = 74; g.beginPath(); g.moveTo(s[0], s[1]); g.quadraticCurveTo(el[0], el[1], hd[0], hd[1]); g.stroke();
  }
  for (const [s, [, hd]] of [[SH[0], arms.L], [SH[1], arms.R]]) {     // round white mittens + thumb nub
    const side = s[0] < 500 ? -1 : 1;
    g.fillStyle = '#ffffff'; g.strokeStyle = INKC; g.lineWidth = 9;
    g.beginPath(); g.arc(hd[0] - side * 34, hd[1] - 8, 18, 0, 6.283); g.stroke(); g.fill();
    g.beginPath(); g.arc(hd[0], hd[1], 42, 0, 6.283); g.stroke(); g.fill();
  }
}
function drawMascot2D(g, o = {}) {
  o = { arms: MASCOT_ARMS.down, blush: 0, sweat: 0, mark: '', sparkle: 0, glow: null, legs: true, ...o };
  g.save(); g.translate(0, 200); g.lineCap = 'round'; g.lineJoin = 'round';
  if (o.legs) drawLegs(g);
  drawTorso(g); drawHead2D(g, o); drawArms2D(g, o.arms); g.restore();
}

export { drawMascot2D, MASCOT_ARMS };
