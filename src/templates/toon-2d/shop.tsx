import { useMemo } from 'react';
import * as THREE from 'three';
// @ts-ignore three example module
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Box, Solid } from './World';
import { paint } from './paint';
import { face, canvasTex } from './stage';

// Shop kit: a high-street shopfront (closed, or open with a room behind it), a shop counter with a till, parcel
// shelves, a wall clock, a pillar box and bunting. Ricks rules: every piece 4-6 parts, painted faces, ink seams.
type V3 = [number, number, number];
const INK = '#261a22';
const rbox = (s: V3, r = 0.03) => new RoundedBoxGeometry(s[0], s[1], s[2], 3, Math.min(r, Math.min(...s) / 2.2));

// Sign board texture: coloured board, cream lettering, ink border.
export const signTex = (text: string, bg: string, fg = '#fff4e0', w = 1024, h = 160) => canvasTex(w, h, (g) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,0.16)'; g.fillRect(0, 0, w, h * 0.22);
  g.strokeStyle = INK; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); g.strokeStyle = fg; g.lineWidth = 3; g.strokeRect(18, 18, w - 36, h - 36);
  g.fillStyle = fg; g.font = `900 ${Math.round(h * 0.56)}px "Arial Black", Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 6; g.strokeStyle = INK; g.strokeText(text, w / 2, h / 2 + 4); g.fillText(text, w / 2, h / 2 + 4);
});

// Window display: warm interior glow with shelves and a poster; `flash` 0..1 tints it police red.
const glassTex = (seed: number) => canvasTex(256, 256, (g) => {
  const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, '#ffe2a8'); gr.addColorStop(1, '#f2a86a'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#c46a4a'; for (const y of [90, 170]) g.fillRect(0, y, 256, 8);
  const cols = ['#5a8ad8', '#e8473c', '#76b98a', '#f4c84a', '#b07ad8'];
  for (let i = 0; i < 9; i++) { g.fillStyle = cols[(i + seed) % 5]; const x = 12 + (i % 5) * 48, y = i < 5 ? 58 : 138; g.fillRect(x, y, 34, 32); g.strokeStyle = INK; g.lineWidth = 2; g.strokeRect(x, y, 34, 32); }
  g.fillStyle = '#fff4e0'; g.fillRect(150, 196, 80, 50); g.strokeRect(150, 196, 80, 50);
  g.fillStyle = 'rgba(255,255,255,0.45)'; g.beginPath(); g.moveTo(20, 0); g.lineTo(70, 0); g.lineTo(10, 256); g.lineTo(-40, 256); g.fill();   // glass streak
});

// Shopfront facing +z, origin = ground at the centre of the front. open: no glass in the big window and a lit room
// behind it (camera can fly through); otherwise a closed box behind the facade.
export const Shopfront = ({ pos, rot = [0, 0, 0], w = 3.2, h = 4.6, depth = 3.4, color = '#d8323a', wall = '#f2d2b0', sign = 'POST OFFICE', flash = 0, open = false, seed = 1 }:
  { pos: V3; rot?: V3; w?: number; h?: number; depth?: number; color?: string; wall?: string; sign?: string; flash?: number; open?: boolean; seed?: number }) => {
  const t = useMemo(() => ({
    brick: paint('brick', wall, 20 + seed), sign: signTex(sign, color), glass: glassTex(seed), door: paint('planks', color, 5 + seed),
    riser: face(512, 160, color, (g) => { for (let i = 0; i < 3; i++) { g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(20 + i * 166, 24, 140, 112); } }, seed),
    sash: face(128, 192, '#fff4e0', (g) => { g.fillStyle = '#7ab0e0'; g.fillRect(14, 14, 100, 76); g.fillRect(14, 102, 100, 76); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(14, 14, 100, 76); g.strokeRect(14, 102, 100, 76); }, seed),
  }), [wall, color, sign, seed]);
  const fh = 0.5, gw = 2.0, gh = 1.9, dw = 0.75, upper = h - 2.9;   // fascia height, glass, door, upper storey
  const lit = new THREE.Color('#ffe9c0').lerp(new THREE.Color('#ff2a3a'), flash);
  return (
    <group position={pos} rotation={rot}>
      {/* upper storey: brick with two sash windows */}
      <Box size={[w, upper, 0.25]} pos={[0, 2.9 + upper / 2, -0.1]} map={t.brick} rep={[w / 1.2, upper / 1.2]} />
      {[-w / 4, w / 4].map((x) => <mesh key={x} position={[x, 2.9 + upper / 2, 0.035]}><planeGeometry args={[0.55, 0.85]} /><meshToonMaterial map={t.sash} emissive="#3a2a6e" emissiveIntensity={0.3} /></mesh>)}
      <Box size={[w + 0.25, 0.12, 0.4]} pos={[0, h, 0]} color="#fff4e0" role="prop" />
      {/* fascia sign + cornice */}
      <Box size={[w + 0.2, 0.1, 0.42]} pos={[0, 2.9, 0.05]} color="#fff4e0" role="prop" />
      <mesh position={[0, 2.9 - fh / 2 - 0.05, 0.12]}><boxGeometry args={[w, fh, 0.12]} /><meshToonMaterial map={t.sign} emissive="#3a2a6e" emissiveIntensity={0.25} /></mesh>
      {/* pilasters */}
      {[-w / 2 + 0.1, w / 2 - 0.1].map((x) => <Box key={x} size={[0.22, 2.35, 0.3]} pos={[x, 1.175, 0.03]} color={color} role="prop" />)}
      {/* shop window over a panelled stall riser */}
      <mesh position={[-w / 2 + 0.2 + gw / 2, 0.25, 0.06]}><planeGeometry args={[gw, 0.5]} /><meshToonMaterial map={t.riser} emissive="#3a2a6e" emissiveIntensity={0.3} /></mesh>
      {!open && <mesh position={[-w / 2 + 0.2 + gw / 2, 0.5 + gh / 2 - 0.05, 0.02]}><planeGeometry args={[gw, gh - 0.1]} /><meshBasicMaterial map={t.glass} color={lit} /></mesh>}
      <Box size={[gw + 0.06, 0.07, 0.12]} pos={[-w / 2 + 0.2 + gw / 2, 0.5 + gh / 2, 0.06]} color="#fff4e0" role="prop" />
      {!open && <Box size={[0.06, gh, 0.1]} pos={[-w / 2 + 0.2 + gw / 2, 0.5 + gh / 2 - 0.05, 0.05]} color="#fff4e0" role="prop" />}
      {/* door with a step and a lit fanlight */}
      <mesh position={[w / 2 - 0.2 - dw / 2, 1.05, -0.02]}><planeGeometry args={[dw, 2.1]} /><meshToonMaterial map={t.door} emissive="#3a2a6e" emissiveIntensity={0.3} /></mesh>
      <mesh position={[w / 2 - 0.2 - dw / 2, 2.25, 0.0]}><planeGeometry args={[dw, 0.22]} /><meshBasicMaterial color={lit} /></mesh>
      <Box size={[dw + 0.15, 0.08, 0.3]} pos={[w / 2 - 0.2 - dw / 2, 0.04, 0.12]} color="#d8cfc4" role="prop" />
      {/* the building behind the facade */}
      {open ? <group>
        <Box size={[0.2, h, depth]} pos={[-w / 2, h / 2, -depth / 2]} map={t.brick} rep={[depth / 1.2, h / 1.2]} />
        <Box size={[0.2, h, depth]} pos={[w / 2, h / 2, -depth / 2]} map={t.brick} rep={[depth / 1.2, h / 1.2]} />
      </group> : <Box size={[w, h, depth]} pos={[0, h / 2, -depth / 2 - 0.12]} map={t.brick} rep={[w / 1.2, h / 1.2]} />}
      {/* police light on the glass */}
      {flash > 0 && <pointLight color="#ff2a3a" intensity={6 * flash} distance={4} decay={1.5} position={[-0.3, 1.5, 1.0]} />}
    </group>
  );
};

// Shop counter (customer side = +z): panelled front, top slab, a glass screen with a frame.
export const Counter = ({ pos, w = 3, color = '#e8473c' }: { pos: V3; w?: number; color?: string }) => {
  const front = useMemo(() => face(1024, 256, color, (g) => { const n = Math.max(2, Math.round(w)); for (let i = 0; i < n; i++) { const x = 24 + i * (976 / n); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(x, 30, 976 / n - 24, 196); g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(x, 30, 976 / n - 24, 196); } }, 21), [w, color]);
  const top = useMemo(() => rbox([w + 0.1, 0.08, 0.7], 0.03), [w]);
  return (
    <group position={pos}>
      <Box size={[w, 1.0, 0.6]} pos={[0, 0.5, 0]} color="#ffffff" map={front} role="prop" />
      <Solid geo={top} role="prop" color="#fff4e0" position={[0, 1.04, 0.03]} />
      {/* glass screen + frame */}
      <mesh position={[0, 1.55, -0.12]}><planeGeometry args={[w, 0.9]} /><meshBasicMaterial color="#cfe8ff" transparent opacity={0.16} depthWrite={false} /></mesh>
      <Box size={[w, 0.05, 0.06]} pos={[0, 2.0, -0.12]} color="#fff4e0" role="prop" />
      {[-w / 2, 0, w / 2].map((x) => <Box key={x} size={[0.05, 0.92, 0.06]} pos={[x, 1.54, -0.12]} color="#fff4e0" role="prop" />)}
    </group>
  );
};

// Till: rounded monitor on a stand (pass the screen texture), keyboard with coloured keys, receipt printer.
export const Till = ({ pos, rot = [0, 0, 0], screen }: { pos: V3; rot?: V3; screen: THREE.Texture }) => {
  const p = useMemo(() => ({
    mon: rbox([0.62, 0.44, 0.07], 0.03), stand: new THREE.CylinderGeometry(0.03, 0.03, 0.18, 8), base: rbox([0.24, 0.03, 0.16], 0.01),
    kb: rbox([0.5, 0.04, 0.18], 0.012), printer: rbox([0.16, 0.12, 0.18], 0.02),
    keys: face(256, 96, '#2c2a34', (g) => { const c = ['#f2efe8', '#f2efe8', '#e8473c', '#f4c84a', '#76b98a']; for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { g.fillStyle = c[i > 6 ? i - 5 : 0]; g.fillRect(10 + i * 27, 10 + r * 28, 22, 22); } }, 4),
  }), []);
  return (
    <group position={pos} rotation={rot}>
      <Solid geo={p.base} role="prop" color="#2c2a34" position={[0, 0.015, 0]} />
      <Solid geo={p.stand} role="prop" color="#2c2a34" position={[0, 0.1, 0]} />
      <group position={[0, 0.4, 0]} rotation={[-0.08, 0, 0]}>
        <Solid geo={p.mon} role="prop" color="#3a3644" />
        <mesh position={[0, 0, 0.037]}><planeGeometry args={[0.55, 0.37]} /><meshBasicMaterial map={screen} toneMapped={false} /></mesh>
      </group>
      <group position={[0, 0.02, 0.24]}><Solid geo={p.kb} role="prop" color="#2c2a34" /><mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.46, 0.16]} /><meshToonMaterial map={p.keys} /></mesh></group>
      <Solid geo={p.printer} role="prop" color="#d8d4e0" position={[0.42, 0.06, 0.12]} />
    </group>
  );
};

// Parcel shelves: frame + 3 boards, boxes in post colours with tape.
export const ParcelShelf = ({ pos, w = 2.4, seed = 2 }: { pos: V3; w?: number; seed?: number }) => {
  const boxes = useMemo(() => {
    const out: { p: V3; s: V3; c: string }[] = []; let s = seed * 97;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (const y of [0.42, 0.98, 1.54]) for (let x = -w / 2 + 0.15; x < w / 2 - 0.3;) { const bw = 0.22 + r() * 0.2, bh = 0.18 + r() * 0.24; out.push({ p: [x + bw / 2, y + bh / 2, 0], s: [bw, bh, 0.32], c: ['#d8a46a', '#c98e56', '#e8c08a', '#f4c84a', '#e8473c'][Math.floor(r() * 5)] }); x += bw + 0.05; }
    return out;
  }, [w, seed]);
  return (
    <group position={pos}>
      <Box size={[w, 2.0, 0.06]} pos={[0, 1.0, -0.2]} color="#4a5ab0" />
      {[0.4, 0.96, 1.52, 2.0].map((y) => <Box key={y} size={[w, 0.05, 0.42]} pos={[0, y, 0]} color="#fff4e0" role="prop" />)}
      {[-w / 2, w / 2].map((x) => <Box key={x} size={[0.06, 2.04, 0.42]} pos={[x, 1.02, 0]} color="#fff4e0" role="prop" />)}
      {boxes.map((b, i) => <group key={i}><Box size={b.s} pos={b.p} color={b.c} role="prop" /><Box size={[b.s[0] + 0.004, 0.035, b.s[2] + 0.004]} pos={b.p} color="#c9b48a" /></group>)}
    </group>
  );
};

// Wall clock: rim, face with ticks, two hands.
export const WallClock = ({ pos, r = 0.32 }: { pos: V3; r?: number }) => {
  const t = useMemo(() => canvasTex(256, 256, (g) => {
    g.fillStyle = '#fffaf0'; g.beginPath(); g.arc(128, 128, 124, 0, 7); g.fill();
    g.strokeStyle = INK; g.lineWidth = 6; for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; g.beginPath(); g.moveTo(128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); g.lineTo(128 + Math.cos(a) * 112, 128 + Math.sin(a) * 112); g.stroke(); }
    g.lineWidth = 9; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 60); g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(128, 128); g.lineTo(186, 150); g.stroke();
  }), []);
  const rim = useMemo(() => new THREE.TorusGeometry(r, r * 0.12, 10, 32), [r]);
  return <group position={pos}><Solid geo={rim} role="prop" color="#e8473c" /><mesh><circleGeometry args={[r, 32]} /><meshToonMaterial map={t} /></mesh></group>;
};

// Pillar box: red post box with a cap, slot and plate.
export const PillarBox = ({ pos }: { pos: V3 }) => {
  const p = useMemo(() => ({ body: new THREE.CylinderGeometry(0.26, 0.28, 1.25, 24), cap: new THREE.SphereGeometry(0.29, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), band: new THREE.CylinderGeometry(0.3, 0.3, 0.08, 24), base: new THREE.CylinderGeometry(0.31, 0.33, 0.12, 24) }), []);
  return (
    <group position={pos}>
      <Solid geo={p.base} role="prop" color="#2c2a34" position={[0, 0.06, 0]} />
      <Solid geo={p.body} role="prop" color="#d8323a" position={[0, 0.72, 0]} />
      <Solid geo={p.band} role="prop" color="#c0262e" position={[0, 1.33, 0]} />
      <Solid geo={p.cap} role="prop" color="#d8323a" position={[0, 1.36, 0]} />
      <Box size={[0.26, 0.04, 0.06]} pos={[0, 1.12, 0.26]} color="#2c2a34" />
      <Box size={[0.2, 0.14, 0.03]} pos={[0, 0.85, 0.27]} color="#fff4e0" />
    </group>
  );
};

// Bunting: triangle flags hanging along a sagging line from a to b.
export const Bunting = ({ a, b, n = 14, sag = 0.5 }: { a: V3; b: V3; n?: number; sag?: number }) => {
  const flag = useMemo(() => { const s = new THREE.Shape(); s.moveTo(-0.14, 0); s.lineTo(0.14, 0); s.lineTo(0, -0.32); s.lineTo(-0.14, 0); return new THREE.ShapeGeometry(s); }, []);
  const cols = ['#e8473c', '#2e9a9a', '#f4c84a', '#5a6ad8', '#ff8a5a'];
  return <group>{Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n, y = a[1] + (b[1] - a[1]) * t - sag * 4 * t * (1 - t);
    return <mesh key={i} geometry={flag} position={[a[0] + (b[0] - a[0]) * t, y, a[2] + (b[2] - a[2]) * t]} rotation={[0, Math.atan2(b[0] - a[0], b[2] - a[2]) - Math.PI / 2, 0]}>
      <meshToonMaterial color={cols[i % 5]} side={THREE.DoubleSide} emissive="#3a2a6e" emissiveIntensity={0.3} /></mesh>;
  })}</group>;
};
