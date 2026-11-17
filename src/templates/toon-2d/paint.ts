import * as THREE from 'three';

// Painted canvas textures (style guide: 2-tone, ±6% value noise, seams as 2-3 px warm ink lines).
const INK = '#261a22';
const rand = (s: number) => () => ((s = (s * 16807) % 2147483647) / 2147483647);

const shade = (hex: string, k: number) => {
  const c = new THREE.Color(hex); c.multiplyScalar(k); return '#' + c.getHexString();
};

function base(c: CanvasRenderingContext2D, w: number, h: number, color: string, seed: number) {
  c.fillStyle = color; c.fillRect(0, 0, w, h);
  const r = rand(seed);
  for (let i = 0; i < 900; i++) {          // value noise blotches ±6%
    c.fillStyle = shade(color, 0.94 + r() * 0.12); c.globalAlpha = 0.5;
    const s = 6 + r() * 26; c.fillRect(r() * w, r() * h, s, s * 0.6);
  }
  c.globalAlpha = 1;
}

export function paint(kind: 'planks' | 'brick' | 'tiles' | 'cobble' | 'plaster', color: string, seed = 7) {
  const w = 256, h = 256, cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const c = cv.getContext('2d')!; base(c, w, h, color, seed);
  const r = rand(seed + 1);
  c.strokeStyle = INK; c.lineWidth = 2.5;
  if (kind === 'planks') {
    for (let y = 0; y <= h; y += 40) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
      c.strokeStyle = shade(color, 0.8); c.lineWidth = 1;   // grain
      for (let g = 0; g < 3; g++) { c.beginPath(); const gy = y + 8 + g * 10 + r() * 4; c.moveTo(0, gy); c.bezierCurveTo(w * .3, gy + 3, w * .6, gy - 3, w, gy + 1); c.stroke(); }
      c.strokeStyle = INK; c.lineWidth = 2.5; }
  }
  if (kind === 'brick') {
    for (let y = 0, row = 0; y < h; y += 24, row++) {
      c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
      for (let x = (row % 2) * 24; x < w; x += 48) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 24); c.stroke(); }
    }
  }
  if (kind === 'tiles') {
    for (let y = 0, row = 0; y < h; y += 32, row++) {
      c.fillStyle = shade(color, 0.78); c.fillRect(0, y + 22, w, 10);
      c.beginPath(); c.moveTo(0, y + 32); c.lineTo(w, y + 32); c.stroke();
      for (let x = (row % 2) * 16; x < w; x += 32) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 32); c.stroke(); }
    }
  }
  if (kind === 'cobble') {
    for (let y = 0, row = 0; y < h; y += 28, row++) for (let x = (row % 2) * 18; x < w + 36; x += 36) {
      c.fillStyle = shade(color, 0.9 + r() * 0.15); c.beginPath(); c.ellipse(x, y + 14, 15, 11, 0, 0, Math.PI * 2); c.fill(); c.stroke();
    }
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4; return t;
}
