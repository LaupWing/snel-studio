// Jensen as a flat 2D side character (same canvas + proportions as the side kit: 1000 x 1650, 200 px headroom).
// Built from the template kit (headBase, nose, faces, thick sideArms); only the outfit + hair are new for this reel:
// black leather jacket over a black tee, black jeans, swept-back grey hair. No wojak face.
// o: { arms: {L,R}, face: 'grin' | 'shock', kiss: 0..1.4 (lipstick mark on his cheek, scale) }
// @ts-ignore plain js
import { inkFill, clipShade, TORSO, headBase, nose, sideArms, faceShock, INKC } from '../sidekit.js';

const LEATHER = '#2c2a34', LEATHER_D = '#1b1a22', TEE = '#141318', JEANS = '#2a2b33';

function legs(g) {
  for (const x of [410, 590]) {
    const leg = () => g.roundRect(x - 60, 930, 120, 410, 28);
    inkFill(g, leg, JEANS, 9);
    clipShade(g, leg, () => { g.fillStyle = '#1e1f26'; g.fillRect(x + 18, 900, 60, 460); });
    inkFill(g, () => g.roundRect(x - 90, 1332, 180, 84, 40), '#16151a', 9);
    g.fillStyle = '#4a4656'; g.beginPath(); g.ellipse(x - 34, 1356, 30, 9, -0.1, 0, 6.283); g.fill();
  }
  inkFill(g, () => g.roundRect(345, 890, 310, 130, 50), JEANS, 9);
}

function jacket(g) {
  const T = TORSO(g);
  inkFill(g, T, LEATHER, 9);
  clipShade(g, T, () => {
    g.fillStyle = LEATHER_D; g.beginPath(); g.moveTo(622, 540); g.quadraticCurveTo(650, 740, 630, 950); g.lineTo(720, 950); g.lineTo(720, 540); g.fill();
    // leather shine: two soft streaks
    g.fillStyle = 'rgba(255,255,255,0.16)'; g.beginPath(); g.ellipse(352, 700, 22, 140, 0.08, 0, 6.283); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.beginPath(); g.ellipse(560, 820, 16, 90, -0.1, 0, 6.283); g.fill();
  });
  // black tee in the open front
  g.beginPath(); g.moveTo(430, 542); g.lineTo(570, 542); g.lineTo(552, 946); g.lineTo(448, 946); g.closePath();
  g.fillStyle = TEE; g.fill(); g.strokeStyle = INKC; g.lineWidth = 7; g.stroke();
  g.strokeStyle = '#3a3846'; g.lineWidth = 6; g.beginPath(); g.moveTo(448, 548); g.quadraticCurveTo(500, 590, 552, 548); g.stroke();
  // wide biker lapels + zipper
  g.strokeStyle = INKC; g.lineWidth = 8;
  for (const s of [-1, 1]) {
    g.beginPath(); g.moveTo(500 + s * 70, 542); g.lineTo(500 + s * 150, 610); g.lineTo(500 + s * 104, 690); g.lineTo(500 + s * 52, 946);
    g.fillStyle = '#34323e'; g.fill(); g.stroke();
  }
  g.strokeStyle = '#b9b6c6'; g.lineWidth = 5; g.beginPath(); g.moveTo(560, 700); g.lineTo(556, 930); g.stroke();
}

function sweptHair(g) {
  clipShade(g, () => g.arc(500, 290, 228, 0, 6.283), () => {
    g.beginPath(); g.moveTo(262, 300); g.bezierCurveTo(266, 230, 330, 214, 400, 206); g.bezierCurveTo(470, 196, 540, 198, 610, 206); g.bezierCurveTo(680, 214, 736, 236, 740, 300);
    g.lineTo(780, 0); g.lineTo(220, 0); g.closePath(); g.fillStyle = '#6e6c7a'; g.fill();
    g.strokeStyle = '#c4c2d0'; g.lineWidth = 12; g.lineCap = 'round';                       // combed-back strands
    for (const [x0, x1] of [[340, 320], [440, 425], [560, 570], [660, 690]]) { g.beginPath(); g.moveTo(x0, 200); g.quadraticCurveTo((x0 + x1) / 2, 120, x1, 70); g.stroke(); }
    g.strokeStyle = '#3a3846'; g.lineWidth = 9;
    for (const [x0, x1] of [[405, 385], [500, 496], [596, 616]]) { g.beginPath(); g.moveTo(x0, 200); g.quadraticCurveTo((x0 + x1) / 2, 120, x1, 70); g.stroke(); }
  });
  g.strokeStyle = INKC; g.lineWidth = 8; g.beginPath(); g.moveTo(264, 300); g.bezierCurveTo(268, 230, 330, 214, 400, 206); g.bezierCurveTo(470, 196, 540, 198, 610, 206); g.bezierCurveTo(680, 214, 734, 236, 738, 300); g.stroke();
  g.beginPath(); g.arc(500, 290, 228, 0, 6.283); g.lineWidth = 22; g.stroke();
}


// ---- Face traced from a real photo (Wikimedia 'Jensen Huang (cropped).jpg', on Expansion assets/people/jensen-huang,
// never in git). All points below are PHOTO pixels read off a 20 px grid; one transform maps them onto the head.
const PX = 342, PY = 214, S = 1.4;                     // photo face centre -> canvas (500, 290), scale
const FSKIN = '#f1caa8', FSHADE = 'rgba(150,90,170,0.22)', HAIR = '#cfced6', HAIR_D = '#8f8e99';
function photoSpace(g, fn) { g.save(); g.translate(500 - PX * S, 290 - PY * S); g.scale(S, S); g.lineCap = 'round'; g.lineJoin = 'round'; fn(); g.restore(); }
const LW = (px) => px / S;                               // canvas px -> photo px line width

function tracedHead(g, face) {
  photoSpace(g, () => {
    // hair mass behind the head
    g.beginPath(); g.moveTo(206, 236); g.bezierCurveTo(170, 150, 214, 20, 345, 12); g.bezierCurveTo(470, 6, 522, 120, 482, 236); g.closePath();
    g.fillStyle = HAIR; g.fill(); g.strokeStyle = INKC; g.lineWidth = LW(20); g.stroke();
    // ears
    for (const x of [212, 473]) { g.beginPath(); g.ellipse(x, 252, 17, 36, 0, 0, 6.283); g.fillStyle = FSKIN; g.fill(); g.lineWidth = LW(9); g.stroke(); }
    // face: temples, cheeks, rounded jaw, chin
    const F = () => { g.moveTo(224, 170); g.bezierCurveTo(218, 230, 222, 290, 248, 322); g.bezierCurveTo(280, 362, 322, 372, 352, 371); g.bezierCurveTo(392, 370, 432, 348, 452, 314); g.bezierCurveTo(470, 284, 470, 220, 464, 168); g.bezierCurveTo(440, 70, 250, 70, 224, 170); };
    g.beginPath(); F(); g.fillStyle = FSKIN; g.fill();
    g.save(); g.beginPath(); F(); g.clip();
    g.fillStyle = FSHADE; g.beginPath(); g.moveTo(430, 120); g.bezierCurveTo(470, 200, 470, 320, 400, 380); g.lineTo(500, 380); g.lineTo(500, 100); g.fill();   // cool shade, camera-right
    g.fillStyle = 'rgba(255,120,120,0.18)'; for (const x of [282, 418]) { g.beginPath(); g.ellipse(x, 258, 26, 16, 0, 0, 6.283); g.fill(); }  // cheeks
    g.restore();
    g.beginPath(); g.moveTo(224, 170); g.bezierCurveTo(218, 230, 222, 290, 248, 322); g.bezierCurveTo(280, 362, 322, 372, 352, 371); g.bezierCurveTo(392, 370, 432, 348, 452, 314); g.bezierCurveTo(470, 284, 470, 220, 464, 168);
    g.strokeStyle = INKC; g.lineWidth = LW(20); g.stroke();   // outline only below the hairline (no ink band under the hair)
    // front hair: swept back, covers the temples down to the glasses
    g.beginPath(); g.moveTo(207, 232); g.bezierCurveTo(172, 150, 216, 22, 345, 14); g.bezierCurveTo(468, 8, 520, 120, 481, 232);
    g.lineTo(466, 206); g.bezierCurveTo(462, 150, 440, 104, 400, 92); g.bezierCurveTo(372, 84, 322, 84, 292, 94); g.bezierCurveTo(252, 110, 232, 150, 228, 206); g.closePath();
    g.fillStyle = HAIR; g.fill(); g.strokeStyle = HAIR_D; g.lineWidth = LW(6); g.stroke();
    g.strokeStyle = '#a9a8b3'; g.lineWidth = LW(6);                                                                  // combed-back strands
    for (const [a, b, c] of [[[236, 196], [232, 120], [300, 52]], [[256, 120], [290, 70], [350, 46]], [[330, 86], [380, 40], [430, 60]], [[452, 196], [462, 120], [420, 60]], [[420, 98], [455, 70], [470, 120]]]) {
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(b[0], b[1], c[0], c[1]); g.stroke(); }
    g.strokeStyle = '#f4f4f8'; g.lineWidth = LW(6);
    for (const [a, b, c] of [[[300, 70], [340, 40], [392, 44]], [[244, 160], [244, 110], [278, 80]]]) { g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(b[0], b[1], c[0], c[1]); g.stroke(); }
    // brows (grey, just above the frame)
    g.strokeStyle = '#6d6b78'; g.lineWidth = LW(10);
    g.beginPath(); g.moveTo(258, 176); g.quadraticCurveTo(296, 166, 332, 172); g.stroke();
    g.beginPath(); g.moveTo(372, 172); g.quadraticCurveTo(408, 166, 444, 176); g.stroke();
    // eyes
    g.strokeStyle = INKC;
    if (face === 'shock') {
      for (const x of [314, 398]) { g.beginPath(); g.arc(x, 204, 15, 0, 6.283); g.fillStyle = '#fff'; g.fill(); g.lineWidth = LW(7); g.stroke(); g.beginPath(); g.arc(x, 205, 5, 0, 6.283); g.fillStyle = INKC; g.fill(); }
    } else {
      g.lineWidth = LW(9);                                                                                        // smiling squint
      for (const x of [314, 398]) { g.beginPath(); g.moveTo(x - 22, 208); g.quadraticCurveTo(x, 192, x + 22, 208); g.stroke(); }
      g.lineWidth = LW(5); for (const x of [314, 398]) { g.beginPath(); g.moveTo(x - 16, 216); g.quadraticCurveTo(x, 222, x + 16, 216); g.stroke(); }
    }
    // crow's feet + under-eye lines (his smile)
    g.lineWidth = LW(5); g.strokeStyle = 'rgba(36,23,38,0.55)';
    for (const [x0, y0, x1, y1] of [[244, 206, 232, 202], [244, 214, 230, 216], [243, 222, 233, 230], [456, 206, 468, 202], [456, 214, 470, 216], [457, 222, 467, 230]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
    // glasses: thin dark half-rims, top bar heavier, bridge + temples
    g.strokeStyle = INKC; g.fillStyle = 'rgba(255,255,255,0.14)';
    for (const [x, w] of [[238, 102], [362, 94]]) { g.beginPath(); g.roundRect(x, 184, w, 40, [6, 6, 16, 16]); g.fill(); g.lineWidth = LW(6); g.stroke(); g.lineWidth = LW(11); g.beginPath(); g.moveTo(x + 2, 185); g.lineTo(x + w - 2, 185); g.stroke(); }
    g.lineWidth = LW(7); g.beginPath(); g.moveTo(340, 190); g.quadraticCurveTo(351, 184, 362, 190); g.stroke();
    g.beginPath(); g.moveTo(238, 188); g.lineTo(220, 196); g.stroke(); g.beginPath(); g.moveTo(456, 188); g.lineTo(470, 196); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = LW(5); for (const x of [256, 380]) { g.beginPath(); g.moveTo(x, 196); g.lineTo(x + 16, 192); g.stroke(); }
    // nose: bridge shadow, round tip, nostril wings
    g.strokeStyle = INKC; g.lineWidth = LW(8);
    g.beginPath(); g.moveTo(326, 252); g.quadraticCurveTo(320, 268, 338, 268); g.stroke();
    g.beginPath(); g.moveTo(378, 252); g.quadraticCurveTo(386, 268, 368, 268); g.stroke();
    g.beginPath(); g.moveTo(338, 270); g.quadraticCurveTo(353, 278, 368, 270); g.stroke();
    g.strokeStyle = 'rgba(36,23,38,0.4)'; g.lineWidth = LW(6); g.beginPath(); g.moveTo(346, 214); g.quadraticCurveTo(340, 238, 344, 250); g.stroke();
    // nasolabial folds
    g.strokeStyle = 'rgba(36,23,38,0.6)'; g.lineWidth = LW(7);
    g.beginPath(); g.moveTo(318, 264); g.quadraticCurveTo(298, 282, 302, 306); g.stroke();
    g.beginPath(); g.moveTo(390, 264); g.quadraticCurveTo(410, 282, 406, 306); g.stroke();
    // mouth
    g.strokeStyle = INKC;
    if (face === 'shock') {
      const M = () => g.ellipse(353, 304, 20, 26, 0, 0, 6.283);
      g.beginPath(); M(); g.fillStyle = '#5a1f3a'; g.fill(); g.lineWidth = LW(9); g.stroke();
    } else {
      const M = () => { g.moveTo(306, 287); g.quadraticCurveTo(354, 280, 404, 289); g.quadraticCurveTo(384, 316, 354, 316); g.quadraticCurveTo(324, 315, 306, 287); };
      g.beginPath(); M(); g.fillStyle = '#5a1f3a'; g.fill();
      g.save(); g.beginPath(); M(); g.clip(); g.fillStyle = '#ffffff'; g.fillRect(300, 278, 110, 20); g.fillStyle = '#ff7d9b'; g.beginPath(); g.ellipse(354, 318, 30, 10, 0, 0, 6.283); g.fill(); g.restore();
      g.beginPath(); M(); g.lineWidth = LW(9); g.stroke();
      g.lineWidth = LW(6); g.beginPath(); g.moveTo(300, 282); g.quadraticCurveTo(304, 290, 308, 290); g.stroke(); g.beginPath(); g.moveTo(410, 284); g.quadraticCurveTo(404, 291, 401, 291); g.stroke();
    }
    g.strokeStyle = 'rgba(36,23,38,0.35)'; g.lineWidth = LW(5); g.beginPath(); g.moveTo(334, 346); g.quadraticCurveTo(354, 352, 374, 346); g.stroke();   // chin
  });
}

function faceGrin(g) {
  g.strokeStyle = INKC; g.lineCap = 'round'; g.lineWidth = 11;
  g.beginPath(); g.moveTo(372, 236); g.quadraticCurveTo(412, 210, 456, 230); g.stroke();
  g.beginPath(); g.moveTo(544, 230); g.quadraticCurveTo(588, 210, 628, 236); g.stroke();
  g.lineWidth = 10;                                                                          // happy squint eyes
  for (const x of [414, 586]) { g.beginPath(); g.moveTo(x - 36, 300); g.quadraticCurveTo(x, 266, x + 36, 300); g.stroke(); }
  nose(g);
  const M = () => { g.moveTo(400, 392); g.quadraticCurveTo(500, 404, 600, 392); g.quadraticCurveTo(580, 478, 500, 482); g.quadraticCurveTo(420, 478, 400, 392); };
  g.beginPath(); M(); g.fillStyle = '#5a1f3a'; g.fill();
  clipShade(g, M, () => { g.fillStyle = '#ffffff'; g.fillRect(390, 380, 220, 34); g.fillStyle = '#ff7d9b'; g.beginPath(); g.ellipse(500, 486, 60, 34, 0, 0, 6.283); g.fill(); });
  g.strokeStyle = INKC; g.lineWidth = 9; g.beginPath(); M(); g.stroke();
  g.lineWidth = 6; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(500 + s * 108, 384); g.quadraticCurveTo(500 + s * 122, 396, 500 + s * 114, 410); g.stroke(); }
}

function kissMark(g, s) {                                                                    // pink lipstick lips on his left cheek
  g.save(); g.translate(395, 395); g.rotate(-0.35); g.scale(s * 0.6, s * 0.6);
  const top = () => { g.moveTo(-62, 0); g.quadraticCurveTo(-40, -36, -6, -12); g.quadraticCurveTo(0, -20, 6, -12); g.quadraticCurveTo(40, -36, 62, 0); g.quadraticCurveTo(0, 6, -62, 0); };
  const bot = () => { g.moveTo(-62, 4); g.quadraticCurveTo(0, 12, 62, 4); g.quadraticCurveTo(30, 50, 0, 50); g.quadraticCurveTo(-30, 50, -62, 4); };
  for (const p of [top, bot]) { g.beginPath(); p(); g.fillStyle = '#ff3d8e'; g.fill(); g.strokeStyle = '#c21f68'; g.lineWidth = 4; g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.ellipse(-24, -10, 12, 5, -0.2, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(18, 30, 14, 5, 0.1, 0, 6.283); g.fill();
  g.restore();
}

function neck(g) {                                                                          // neck from under the chin into the tee
  g.beginPath(); g.roundRect(446, 440, 108, 130, 30); g.fillStyle = '#f1caa8'; g.fill(); g.strokeStyle = INKC; g.lineWidth = 9; g.stroke();
  g.fillStyle = 'rgba(150,90,170,0.30)'; g.fillRect(451, 445, 98, 70);                       // shadow under the jaw
  g.beginPath(); g.moveTo(430, 546); g.quadraticCurveTo(500, 604, 570, 546); g.lineTo(570, 590); g.lineTo(430, 590); g.closePath(); g.fillStyle = TEE; g.fill();
  g.strokeStyle = INKC; g.lineWidth = 8; g.beginPath(); g.moveTo(430, 546); g.quadraticCurveTo(500, 604, 570, 546); g.stroke();
  g.strokeStyle = '#3a3846'; g.lineWidth = 6; g.beginPath(); g.moveTo(440, 556); g.quadraticCurveTo(500, 606, 560, 556); g.stroke();
}

export function drawJensen(g, o) {
  g.save(); g.translate(0, 200); g.lineCap = 'round'; g.lineJoin = 'round';
  legs(g);
  jacket(g);
  neck(g);
  tracedHead(g, o.face);
  if (o.kiss) kissMark(g, o.kiss);
  sideArms(g, o.arms, LEATHER);
  g.restore();
}
