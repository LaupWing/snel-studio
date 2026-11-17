import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
// @ts-ignore plain js, the approved drawing (only its pose table is used here)
import { MASCOT_ARMS } from '../../../src/templates/toon-2d/mascot2d.js';

// Our mascot as a real 3D model (Ricks' characters are 3D: scan 2026-11-17, references/toon-2d.md).
// Every size and colour is taken from the approved drawing mascot2d.js (body px: x 0..1000, feet at y 1440,
// head centre (500,290) r 228), so seen from the front he matches the drawing; only now he has depth.
// Head: sphere with the gradient, the shine and the ONE bolt painted on (front-projected, like the drawing).
// Body: rounded hoodie, jeans, white shoes; stick arms in ink with ball hands (as drawn). Ink = normal-pushed hull.
const INK = '#241726';
const FEET = 1440, TOP = 62;
const rampTex = (() => {
  const t = new THREE.DataTexture(new Uint8Array([150, 185, 225, 255]), 4, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.LinearFilter; t.needsUpdate = true; return t;
})();

const hullMat = (w: number) => {
  const m = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });
  m.onBeforeCompile = (s) => { s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', `vec3 transformed = position + normal * ${w.toFixed(5)};`); };
  return m;
};

// Head texture: equirect canvas, painted by projecting the drawing onto the front of the sphere.
const headTexture = () => {
  const W = 1024, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d')!, img = g.createImageData(W, H), d = img.data;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = hex('#b65cff'), B = hex('#6f63ff'), C = hex('#3a8cff'), INKC = hex(INK);
  const bolt = [[-14, -40], [20, -40], [5, -9], [24, -9], [-16, 42], [-4, 4], [-23, 4]].map(([x, y]) => [x * 3.3 + 6, y * 3.3 + 4]);
  const inside = (x: number, y: number) => { let k = false; for (let i = 0, j = bolt.length - 1; i < bolt.length; j = i++) { const [xi, yi] = bolt[i], [xj, yj] = bolt[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) k = !k; } return k; };
  const edge = (x: number, y: number) => { let m = 1e9; for (let i = 0, j = bolt.length - 1; i < bolt.length; j = i++) { const [ax, ay] = bolt[j], [bx, by] = bolt[i]; const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2))); m = Math.min(m, Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay))); } return m; };
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
    const phi = px / W * Math.PI * 2, th = py / H * Math.PI;           // three.js SphereGeometry uv convention
    const x = -Math.cos(phi) * Math.sin(th), y = Math.cos(th), z = Math.sin(phi) * Math.sin(th);
    let t = 0.5 + 0.5 * (x * 0.66 - y * 0.75); t = Math.max(0, Math.min(1, t));
    let col = t < 0.5 ? A.map((a, i) => a + (B[i] - a) * t * 2) : B.map((b, i) => b + (C[i] - b) * (t - 0.5) * 2);
    if (z > 0) {
      const sx = x * 228, sy = -y * 228;                                 // front view, drawing px from head centre
      const hx = sx + 108, hy = sy + 140, ca = Math.cos(0.55), sa = Math.sin(0.55);
      const ex = (hx * ca - hy * sa) / 46, ey = (hx * sa + hy * ca) / 22;
      if (ex * ex + ey * ey < 1) col = col.map((v) => v + (255 - v) * 0.85);
      if (Math.hypot(sx + 148, sy + 94) < 10) col = col.map((v) => v + (255 - v) * 0.8);
      const e = edge(sx, sy);
      if (inside(sx, sy)) col = e < 7 ? INKC : [255, 255, 255]; else if (e < 7) col = INKC;
    }
    const o = (py * W + px) * 4; d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return tex;
};

type Part = { geo: THREE.BufferGeometry; pos: [number, number, number]; color?: string; map?: THREE.Texture; ink?: boolean; rot?: [number, number, number] };

export const Mascot3D = ({ height = 1.7, arms = 'wave', self = 0.35, yaw = 0, wave = 0, position = [0, 0, 0] as [number, number, number] }:
  { height?: number; arms?: string; self?: number; yaw?: number; wave?: number; position?: [number, number, number] }) => {
  const u = height / (FEET - TOP);
  const P = (x: number, y: number, z = 0): [number, number, number] => [(x - 500) * u, (FEET - y) * u, z * u];
  const inkW = 228 * 2 * 0.022 * u;                                       // ~2.2% of head width (Ricks 2-3%)
  const parts = useMemo<Part[]>(() => {
    const collar = new THREE.CylinderGeometry(192 * u, 192 * u, 34 * u, 40); collar.scale(1, 1, 0.62);
    const pocket = new THREE.ExtrudeGeometry(new THREE.Shape([[-102, 0], [102, 0], [128, -102], [-128, -102]].map(([x, y]) => new THREE.Vector2(x * u, y * u))), { depth: 10 * u, bevelEnabled: false });
    return [
      { geo: new THREE.SphereGeometry(228 * u, 64, 40), pos: P(500, 290), map: headTexture(), ink: true },
      { geo: new RoundedBoxGeometry(400 * u, 406 * u, 290 * u, 4, 80 * u), pos: P(500, 743), color: '#bdb9c9', ink: true },
      { geo: collar, pos: P(500, 548), color: '#a8a3ba', ink: true },
      { geo: pocket, pos: P(500, 788, 140), color: '#b1acc2', ink: true },
      { geo: new RoundedBoxGeometry(316 * u, 152 * u, 250 * u, 4, 60 * u), pos: P(500, 960), color: '#4a7fd8', ink: true },
      ...[410, 590].flatMap((x): Part[] => [
        { geo: new THREE.CapsuleGeometry(50 * u, 230 * u, 6, 16), pos: P(x, 1150), color: '#3f74d1', ink: true },
        { geo: new THREE.CylinderGeometry(62 * u, 62 * u, 72 * u, 24), pos: P(x, 1324), color: '#7aa4ea', ink: true },
        { geo: new RoundedBoxGeometry(175 * u, 88 * u, 250 * u, 4, 38 * u), pos: P(x, 1396, 40), color: '#f8f5f0', ink: true },
      ]),
      ...[[466, 456], [534, 544]].flatMap(([x0, x1]): Part[] => [
        { geo: new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(...P(x0, 590, 120)), new THREE.Vector3(...P(x1, 690, 150))), 2, 4 * u, 8), pos: [0, 0, 0], color: '#f2eef8', ink: true },
        { geo: new THREE.SphereGeometry(9 * u, 12, 8), pos: P(x1, 696, 152), color: INK },
      ]),
    ];
  }, [u]);
  const armGeo = useMemo(() => {
    const pose = (MASCOT_ARMS as any)[arms];
    return ([[[325, 592], pose.L, -1], [[675, 592], pose.R, 1]] as any[]).map(([s, [el, hd], side]) => {
      const h = side > 0 && arms === 'wave' ? [hd[0] + Math.sin(wave) * 45, hd[1]] : hd;
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...P(s[0], s[1])), new THREE.Vector3(...P(el[0], el[1], 60)), new THREE.Vector3(...P(h[0], h[1], 90)));
      return { tube: new THREE.TubeGeometry(curve, 24, 11 * u, 10), hand: P(h[0], h[1], 90) };
    });
  }, [arms, wave, u]);
  const mats = useMemo(() => {
    const m = (color?: string, map?: THREE.Texture) => new THREE.MeshToonMaterial({ color: color ?? '#ffffff', map, gradientMap: rampTex,
      emissive: new THREE.Color(color ?? '#ffffff').multiplyScalar(self), emissiveMap: map, ...(map ? { emissive: new THREE.Color(self, self, self) } : {}) });
    return { m, hull: hullMat(inkW), ink: new THREE.MeshBasicMaterial({ color: INK }) };
  }, [self, inkW]);
  return (
    <group position={position} rotation={[0, yaw, 0]}>
      {parts.map((p, i) => (
        <group key={i} position={p.pos}>
          <mesh geometry={p.geo} material={p.color === INK ? mats.ink : mats.m(p.color, p.map)} castShadow receiveShadow />
          {p.ink && <mesh geometry={p.geo} material={mats.hull} />}
        </group>
      ))}
      {armGeo.map((a, i) => (
        <group key={'a' + i}>
          <mesh geometry={a.tube} material={mats.ink} castShadow />
          <mesh position={a.hand} material={mats.ink} castShadow><sphereGeometry args={[22 * u, 16, 12]} /></mesh>
        </group>
      ))}
    </group>
  );
};
