// Side-character kit, ported 1:1 from our Open Design shots (harvest #10: heartbleed shot 15, lines 492-664).
// Flat 2D people in the mascot's proportions (canvas 1000 x 1650, 200 px headroom): suit or hoodie, slick hair or beanie,
// faces smug / doomer / shock (drawn, no meme PNGs: this repo is public). Only change: standing legs for both outfits.
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const INKC = '#241726', SKIN = '#f5d9c3', LID = '#e7bba4';
function inkFill(g, path, fill, lw) { g.beginPath(); path(); g.lineWidth = lw * 2; g.strokeStyle = INKC; g.stroke(); g.fillStyle = fill; g.fill(); }
const TORSO = g => () => { g.moveTo(300, 640); g.quadraticCurveTo(300, 546, 400, 540); g.lineTo(600, 540); g.quadraticCurveTo(700, 546, 700, 640); g.lineTo(690, 925); g.quadraticCurveTo(690, 946, 668, 946); g.lineTo(332, 946); g.quadraticCurveTo(310, 946, 310, 925); g.closePath(); };
function clipShade(g, path, paintFn) { g.save(); g.beginPath(); path(); g.clip(); paintFn(); g.restore(); }

function suitLegs(g, step) {
  const lift = [Math.max(0, step), Math.max(0, -step)];
  [[410, 0], [590, 1]].forEach(([x, i]) => {
    const dy = -46 * lift[i];
    const leg = () => g.roundRect(x - 60, 930 + dy, 120, 410, 28);
    inkFill(g, leg, '#2e3a7a', 9);
    clipShade(g, leg, () => { g.fillStyle = '#212b62'; g.fillRect(x + 18, 900 + dy, 60, 460); });
    const shoe = () => g.roundRect(x - 90, 1332 + dy, 180, 84, 40);
    inkFill(g, shoe, '#3b2f4a', 9);
    g.fillStyle = '#7a6c98'; g.beginPath(); g.ellipse(x - 34, 1356 + dy, 30, 9, -0.1, 0, 6.283); g.fill();
  });
  const hip = () => g.roundRect(345, 890, 310, 130, 50);
  inkFill(g, hip, '#2e3a7a', 9);
}
function lap(g) {
  const parts = [() => g.roundRect(342, 884, 140, 152, 62), () => g.roundRect(518, 884, 140, 152, 62), () => g.roundRect(418, 878, 164, 84, 30)];
  g.strokeStyle = INKC; g.lineWidth = 18; parts.forEach(f => { g.beginPath(); f(); g.stroke(); });
  g.fillStyle = '#8a84a8'; parts.forEach(f => { g.beginPath(); f(); g.fill(); });
  g.save(); g.beginPath(); parts.forEach(f => f()); g.clip(); g.fillStyle = '#6c6690'; g.fillRect(612, 870, 60, 180); g.fillRect(470, 960, 60, 80); g.restore();
}
function suitTorso(g, tie) {
  const T = TORSO(g);
  inkFill(g, T, '#33428e', 9);
  clipShade(g, T, () => {
    g.fillStyle = '#25317a'; g.beginPath(); g.moveTo(622, 540); g.quadraticCurveTo(650, 740, 630, 950); g.lineTo(720, 950); g.lineTo(720, 540); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(300, 540, 70, 410);
  });
  // shirt V + tie
  g.beginPath(); g.moveTo(420, 542); g.lineTo(580, 542); g.lineTo(500, 730); g.closePath();
  g.fillStyle = '#f6f3fb'; g.fill(); g.strokeStyle = INKC; g.lineWidth = 7; g.stroke();
  g.beginPath(); g.moveTo(482, 550); g.lineTo(518, 550); g.lineTo(511, 582); g.lineTo(489, 582); g.closePath();
  g.fillStyle = tie; g.fill(); g.lineWidth = 6; g.stroke();
  g.beginPath(); g.moveTo(490, 582); g.lineTo(510, 582); g.lineTo(524, 690); g.lineTo(500, 716); g.lineTo(476, 690); g.closePath();
  g.fillStyle = tie; g.fill(); g.stroke();
  // lapels
  g.lineWidth = 8;
  g.beginPath(); g.moveTo(420, 542); g.lineTo(462, 650); g.lineTo(430, 668); g.lineTo(500, 760); g.stroke();
  g.beginPath(); g.moveTo(580, 542); g.lineTo(538, 650); g.lineTo(570, 668); g.lineTo(500, 760); g.stroke();
  g.fillStyle = INKC; for (const y of [800, 862]) { g.beginPath(); g.arc(500, y, 10, 0, 6.283); g.fill(); }
  g.beginPath(); g.moveTo(600, 640); g.lineTo(650, 640); g.lineTo(640, 606); g.lineTo(622, 626); g.lineTo(606, 604); g.closePath();
  g.fillStyle = '#ffffff'; g.fill(); g.lineWidth = 5; g.stroke();
}
function hoodieTorso(g) {
  inkFill(g, () => g.ellipse(500, 556, 205, 72, 0, 0, 6.283), '#38344f', 9);           // hood behind the neck
  const T = TORSO(g);
  inkFill(g, T, '#4b4766', 9);
  clipShade(g, T, () => { g.fillStyle = '#3a3654'; g.beginPath(); g.moveTo(622, 540); g.quadraticCurveTo(650, 740, 630, 950); g.lineTo(720, 950); g.lineTo(720, 540); g.fill(); });
  g.strokeStyle = INKC; g.lineWidth = 7; g.beginPath(); g.roundRect(380, 780, 240, 130, 30); g.fillStyle = '#56507a'; g.fill(); g.stroke();
  for (const [x0, x1] of [[468, 458], [532, 542]]) {
    g.strokeStyle = INKC; g.lineWidth = 15; g.beginPath(); g.moveTo(x0, 590); g.lineTo(x1, 700); g.stroke();
    g.strokeStyle = '#e2dcf0'; g.lineWidth = 7; g.beginPath(); g.moveTo(x0, 590); g.lineTo(x1, 700); g.stroke();
  }
}
function headBase(g) {
  const cx = 500, cy = 290, r = 228;
  for (const s of [-1, 1]) inkFill(g, () => g.ellipse(cx + s * 222, cy + 24, 36, 50, 0, 0, 6.283), SKIN, 8);
  g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.lineWidth = 22; g.strokeStyle = INKC; g.stroke(); g.fillStyle = SKIN; g.fill();
  clipShade(g, () => g.arc(cx, cy, r, 0, 6.283), () => {
    g.fillStyle = 'rgba(140,100,200,0.30)'; g.beginPath(); g.rect(200, 0, 700, 600); g.arc(cx - 40, cy - 36, r + 4, 0, 6.283, true); g.fill('evenodd');
  });
}
function slickHair(g) {
  clipShade(g, () => g.arc(500, 290, 228, 0, 6.283), () => {
    g.beginPath(); g.moveTo(262, 262); g.bezierCurveTo(266, 150, 352, 96, 420, 124); g.bezierCurveTo(476, 84, 690, 96, 738, 262);
    g.lineTo(760, 0); g.lineTo(240, 0); g.closePath(); g.fillStyle = '#4a2f3c'; g.fill();
    g.strokeStyle = '#8a6a86'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(470, 104); g.quadraticCurveTo(560, 92, 640, 128); g.stroke();
  });
  g.strokeStyle = INKC; g.lineWidth = 8; g.beginPath(); g.moveTo(266, 250); g.bezierCurveTo(272, 150, 352, 96, 420, 124); g.bezierCurveTo(476, 84, 690, 96, 734, 250); g.stroke();
  g.beginPath(); g.arc(500, 290, 228, 0, 6.283); g.lineWidth = 22; g.stroke();
}
function beanie(g) {
  const P = () => { g.moveTo(258, 230); g.lineTo(742, 230); g.lineTo(748, 168); g.bezierCurveTo(724, 8, 276, 8, 252, 168); g.closePath(); };
  inkFill(g, P, '#2d2a46', 10);
  clipShade(g, P, () => {
    g.fillStyle = '#433d68'; g.fillRect(230, 162, 540, 72);
    g.strokeStyle = 'rgba(20,14,40,0.55)'; g.lineWidth = 6; for (let x = 262; x < 742; x += 28) { g.beginPath(); g.moveTo(x, 168); g.lineTo(x, 228); g.stroke(); }
    g.fillStyle = 'rgba(160,150,220,0.25)'; g.beginPath(); g.ellipse(400, 90, 90, 30, -0.3, 0, 6.283); g.fill();
  });
  g.strokeStyle = INKC; g.lineWidth = 7; g.beginPath(); g.moveTo(252, 164); g.lineTo(748, 164); g.stroke();
  inkFill(g, () => g.arc(500, 34, 36, 0, 6.283), '#ff8f5a', 8);
}
function nose(g) { g.strokeStyle = INKC; g.lineWidth = 8; g.beginPath(); g.moveTo(508, 292); g.quadraticCurveTo(534, 350, 506, 360); g.lineTo(488, 354); g.stroke(); }
function lidEye(g, x, y, rx, ry, lidFrac, px, py) {
  const E = () => g.ellipse(x, y, rx, ry, 0, 0, 6.283);
  g.beginPath(); E(); g.fillStyle = '#ffffff'; g.fill();
  clipShade(g, E, () => {
    g.fillStyle = INKC; g.beginPath(); g.arc(x + px, y + py, ry * 0.68, 0, 6.283); g.fill();
    g.fillStyle = LID; g.fillRect(x - rx - 4, y - ry - 4, 2 * rx + 8, (2 * ry + 4) * lidFrac);
  });
  g.strokeStyle = INKC; g.lineWidth = 5; g.beginPath(); E(); g.stroke();
  const ly = y - ry - 2 + (2 * ry + 4) * lidFrac;
  g.lineWidth = 9; g.beginPath(); g.moveTo(x - rx - 6, ly + 2); g.quadraticCurveTo(x, ly - 4, x + rx + 6, ly + 1); g.stroke();
}
function faceSmug(g) {
  g.strokeStyle = INKC; g.lineCap = 'round'; g.lineWidth = 11;
  g.beginPath(); g.moveTo(370, 236); g.quadraticCurveTo(410, 200, 456, 222); g.stroke();
  g.beginPath(); g.moveTo(546, 218); g.quadraticCurveTo(594, 190, 634, 214); g.stroke();
  lidEye(g, 412, 284, 44, 19, 0.5, 16, 6);
  lidEye(g, 590, 282, 44, 19, 0.5, 16, 6);
  g.lineWidth = 4; g.strokeStyle = 'rgba(36,23,38,0.6)';
  for (const x of [412, 590]) { g.beginPath(); g.moveTo(x - 26, 314); g.quadraticCurveTo(x, 322, x + 26, 314); g.stroke(); }
  nose(g);
  g.strokeStyle = INKC; g.lineWidth = 9;
  g.beginPath(); g.moveTo(428, 404); g.quadraticCurveTo(510, 420, 576, 394); g.quadraticCurveTo(596, 384, 608, 366); g.stroke();
  g.lineWidth = 6; g.beginPath(); g.moveTo(606, 396); g.quadraticCurveTo(618, 386, 612, 372); g.stroke();
  g.lineWidth = 5; g.beginPath(); g.moveTo(468, 470); g.quadraticCurveTo(500, 482, 532, 470); g.stroke();
}
function faceDoomer(g) {
  g.strokeStyle = INKC; g.lineCap = 'round'; g.lineWidth = 10;
  g.beginPath(); g.moveTo(370, 270); g.lineTo(452, 250); g.stroke();
  g.beginPath(); g.moveTo(548, 250); g.lineTo(630, 270); g.stroke();
  lidEye(g, 412, 300, 38, 16, 0.58, 0, 5);
  lidEye(g, 588, 300, 38, 16, 0.58, 0, 5);
  g.strokeStyle = '#8a6aa8'; g.lineWidth = 5;
  for (const x of [412, 588]) for (const dy of [26, 38]) { g.beginPath(); g.moveTo(x - 30, 300 + dy); g.quadraticCurveTo(x, 310 + dy, x + 30, 300 + dy); g.stroke(); }
  nose(g);
  g.strokeStyle = INKC; g.lineWidth = 8; g.beginPath(); g.moveTo(450, 412); g.quadraticCurveTo(500, 398, 550, 412); g.stroke();
  g.fillStyle = 'rgba(70,50,90,0.45)';
  const R = rng(5); for (let i = 0; i < 34; i++) { const a = R() * Math.PI, rr = 150 + R() * 60; g.beginPath(); g.arc(500 + Math.cos(a) * rr * 0.7, 290 + Math.sin(a) * rr * 0.95, 3, 0, 6.283); g.fill(); }
}
function faceShock(g) {
  g.strokeStyle = INKC; g.lineCap = 'round'; g.lineWidth = 10;
  g.beginPath(); g.moveTo(368, 248); g.quadraticCurveTo(410, 214, 454, 234); g.stroke();
  g.beginPath(); g.moveTo(546, 234); g.quadraticCurveTo(590, 214, 632, 248); g.stroke();
  for (const x of [412, 588]) {
    g.beginPath(); g.arc(x, 298, 36, 0, 6.283); g.fillStyle = '#ffffff'; g.fill(); g.lineWidth = 6; g.strokeStyle = INKC; g.stroke();
    g.beginPath(); g.arc(x, 300, 8, 0, 6.283); g.fillStyle = INKC; g.fill();
    g.strokeStyle = '#8a6aa8'; g.lineWidth = 5; g.beginPath(); g.moveTo(x - 30, 348); g.quadraticCurveTo(x, 358, x + 30, 348); g.stroke();
  }
  nose(g);
  const M = () => g.ellipse(500, 420, 44, 54, 0, 0, 6.283);
  g.beginPath(); M(); g.fillStyle = '#5a1f3a'; g.fill();
  clipShade(g, M, () => { g.fillStyle = '#ff7d9b'; g.beginPath(); g.arc(500, 474, 34, 0, 6.283); g.fill(); });
  g.strokeStyle = INKC; g.lineWidth = 9; g.beginPath(); M(); g.stroke();
}
// Thick sleeves in the outfit colour + skin hands (Loc 2026-11-17: no thin arms on any character).
function sideArms(g, arms, sleeve = '#4b4766') {
  g.lineCap = 'round'; g.lineJoin = 'round';
  const SH = [[325, 592], [675, 592]];
  for (const [s, [el, hd]] of [[SH[0], arms.L], [SH[1], arms.R]]) {
    g.strokeStyle = INKC; g.lineWidth = 92; g.beginPath(); g.moveTo(s[0], s[1]); g.quadraticCurveTo(el[0], el[1], hd[0], hd[1]); g.stroke();
    g.strokeStyle = sleeve; g.lineWidth = 74; g.beginPath(); g.moveTo(s[0], s[1]); g.quadraticCurveTo(el[0], el[1], hd[0], hd[1]); g.stroke();
  }
  for (const [, [, hd]] of [[SH[0], arms.L], [SH[1], arms.R]]) {
    g.fillStyle = SKIN; g.strokeStyle = INKC; g.lineWidth = 9; g.beginPath(); g.arc(hd[0], hd[1], 40, 0, 6.283); g.stroke(); g.fill();
  }
}
function bigMark(g, mark, size) {
  g.save(); g.translate(500, -34); g.lineJoin = 'round';
  g.font = `900 ${size}px "Arial Black", Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.lineWidth = size * 0.12; g.strokeStyle = INKC; g.strokeText(mark, 0, 0); g.fillStyle = '#ffd23a'; g.fillText(mark, 0, 0);
  g.restore();
}
function drop(g, x, y, a) {
  g.save(); g.globalAlpha = a; g.translate(x, y);
  g.beginPath(); g.moveTo(0, -44); g.bezierCurveTo(26, -8, 32, 14, 0, 38); g.bezierCurveTo(-32, 14, -26, -8, 0, -44);
  g.fillStyle = '#8fd8ff'; g.fill(); g.strokeStyle = INKC; g.lineWidth = 8; g.stroke();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(-9, 8, 6, 11, 0.3, 0, 6.283); g.fill(); g.restore();
}
// o.meme: a loaded HTMLImageElement (wojak etc.) replaces the drawn head.
// o: { outfit: 'suit' | 'hoodie', tie, face: 'smug' | 'doomer' | 'shock', arms: {L,R}, step, sweat, mark, markSize }
function drawSide(g, o) {
  g.save(); g.translate(0, 200); g.lineCap = 'round'; g.lineJoin = 'round';
  suitLegs(g, o.step || 0);
  if (o.outfit === 'suit') suitTorso(g, o.tie || '#d8443c'); else hoodieTorso(g);
  if (o.meme) {   // real meme head (wojak PNG from Expansion, never in git): 520 px wide, neck tucked into the collar
    const w = 520, h = w * o.meme.height / o.meme.width; g.drawImage(o.meme, 500 - w / 2, 610 - h, w, h);
  } else {
    headBase(g);
    if (o.outfit === 'suit') slickHair(g); else beanie(g);
    if (o.face === 'smug') faceSmug(g); else if (o.face === 'shock') faceShock(g); else faceDoomer(g);
  }
  sideArms(g, o.arms, o.outfit === 'suit' ? '#33428e' : '#4b4766');
  if (o.sweat) drop(g, 760, 230, o.sweat);
  if (o.mark) bigMark(g, o.mark, o.markSize || 300);
  g.restore();
}
export { drawSide, faceShock, faceSmug, inkFill, clipShade, TORSO, headBase, nose, lidEye, sideArms, bigMark, drop, INKC, SKIN };
