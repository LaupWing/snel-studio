import { useEffect, useMemo, useState } from 'react';
import { staticFile, delayRender, continueRender } from 'remotion';
import * as THREE from 'three';
// @ts-ignore three example module
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Box, Solid } from './World';
import { paint } from './paint';

// Stage kit (keynote / concert / event hall). Props built the Ricks way (references/ricks/reports/materials.md + ricks-props.png):
// every prop = a real object of 4-6 parts (body, insets, trim, hardware, a label), rounded edges, a painted
// 2-tone face with ink seams and +-6% noise, a sheen streak, and it sits in an AO pool. Never a bare box.
type V3 = [number, number, number];
const INK = '#261a22';
const rnd = (s: number) => () => ((s = (s * 16807) % 2147483647) / 2147483647);
const tint = (hex: string, k: number) => { const c = new THREE.Color(hex).multiplyScalar(k); return '#' + c.getHexString(); };

// Painted face: base colour, value noise, ink border, a soft top sheen, then the prop's own detail.
export const face = (w: number, h: number, color: string, draw?: (g: CanvasRenderingContext2D) => void, seed = 3) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d')!;
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  const r = rnd(seed); g.globalAlpha = 0.5;
  for (let i = 0; i < (w * h) / 300; i++) { g.fillStyle = tint(color, 0.94 + r() * 0.12); const s = 4 + r() * 18; g.fillRect(r() * w, r() * h, s, s * 0.6); }
  g.globalAlpha = 1;
  const sh = g.createLinearGradient(0, 0, 0, h * 0.35); sh.addColorStop(0, 'rgba(255,255,255,0.18)'); sh.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = sh; g.fillRect(0, 0, w, h * 0.35);
  draw?.(g);
  g.strokeStyle = INK; g.lineWidth = Math.max(3, w / 90); g.strokeRect(0, 0, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const inset = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, r = 10) => {
  g.fillStyle = fill; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.22)'; g.fillRect(x + 6, y + 5, w - 12, 5);
};
const rbox = (s: V3, r = 0.03) => new RoundedBoxGeometry(s[0], s[1], s[2], 3, Math.min(r, Math.min(...s) / 2.2));

// Flight case (road case): body with panel seams, aluminium rails on every edge, 8 ball corners, 2 latches,
// a side handle, and two stickers. Size w x h x d, origin on the floor.
export const FlightCase = ({ pos, rot = [0, 0, 0], size = [0.9, 0.7, 0.6], color = '#5b4aa8', logo }:
  { pos: V3; rot?: V3; size?: V3; color?: string; logo?: HTMLImageElement }) => {
  const [w, h, d] = size;
  const p = useMemo(() => {
    const body = rbox([w, h, d], 0.025);
    const map = face(512, 400, color, (g) => {
      g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 130); g.lineTo(512, 130); g.stroke();   // lid seam
      g.fillStyle = '#76b900'; g.fillRect(0, 300, 512, 30); g.strokeRect(-4, 300, 520, 30);                   // green tape
      g.save(); g.translate(330, 205); g.rotate(-0.08);                                                        // sticker
      inset(g, -90, -42, 180, 84, '#f4efe6', 8);
      if (logo) g.drawImage(logo, -80, -32, 64, 64);
      g.fillStyle = INK; g.font = '900 30px Arial Black, Arial'; g.fillText('NVIDIA', -12, 10); g.restore();
      g.save(); g.translate(110, 220); g.rotate(0.1); inset(g, -64, -24, 128, 48, '#e8473c', 6);
      g.fillStyle = '#fff4e0'; g.font = '900 26px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('FRAGILE', 0, 10); g.restore();
    });
    const railX = new THREE.BoxGeometry(w + 0.012, 0.035, 0.035), railY = new THREE.BoxGeometry(0.035, h + 0.012, 0.035), railZ = new THREE.BoxGeometry(0.035, 0.035, d + 0.012);
    const ball = new THREE.SphereGeometry(0.045, 14, 10);
    const latch = rbox([0.11, 0.08, 0.03], 0.012);
    const handle = new THREE.TorusGeometry(0.07, 0.016, 8, 16, Math.PI);
    return { body, map, railX, railY, railZ, ball, latch, handle };
  }, [w, h, d, color, logo]);
  const X = w / 2, Y = h / 2, Z = d / 2, metal = '#d9d6e2';
  return (
    <group position={pos} rotation={rot}>
      <group position={[0, Y, 0]}>
        <Solid geo={p.body} role="prop" map={p.map} color="#ffffff" />
        {[-Y, Y].flatMap((y) => [-Z, Z].map((z) => <Solid key={`x${y}${z}`} geo={p.railX} role="prop" color={metal} position={[0, y, z]} />))}
        {[-X, X].flatMap((x) => [-Z, Z].map((z) => <Solid key={`y${x}${z}`} geo={p.railY} role="prop" color={metal} position={[x, 0, z]} />))}
        {[-X, X].flatMap((x) => [-Y, Y].map((y) => <Solid key={`z${x}${y}`} geo={p.railZ} role="prop" color={metal} position={[x, y, 0]} />))}
        {[-X, X].flatMap((x) => [-Y, Y].flatMap((y) => [-Z, Z].map((z) => <Solid key={`b${x}${y}${z}`} geo={p.ball} role="prop" color="#f2f0f6" position={[x, y, z]} />)))}
        {[-w * 0.28, w * 0.28].map((x) => <Solid key={x} geo={p.latch} role="prop" color={metal} position={[x, Y - h * 0.32, Z + 0.015]} />)}
        <Solid geo={p.handle} role="prop" color="#2c2a34" position={[X + 0.02, Y * 0.3, 0]} rotation={[0, Math.PI / 2, 0]} />
      </group>
    </group>
  );
};

// Stage monitor wedge: extruded slanted profile, grille face with a logo plate, rubber feet, a cable to the floor.
export const Wedge = ({ pos, rot = [0, 0, 0], color = '#3d3478' }: { pos: V3; rot?: V3; color?: string }) => {
  const p = useMemo(() => {
    const s = new THREE.Shape(); s.moveTo(-0.24, 0); s.lineTo(0.24, 0); s.lineTo(0.24, 0.12); s.lineTo(-0.1, 0.36); s.lineTo(-0.24, 0.36); s.lineTo(-0.24, 0);
    const body = new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 });
    body.translate(0, 0, -0.35); body.rotateY(-Math.PI / 2);
    const grille = face(512, 256, '#2a2440', (g) => {
      g.fillStyle = '#4a4268'; for (let y = 16; y < 256; y += 18) for (let x = 14 + ((y / 18) % 2) * 9; x < 512; x += 18) { g.beginPath(); g.arc(x, y, 4.5, 0, 7); g.fill(); }
      inset(g, 196, 200, 120, 34, '#c9c4d8', 6); g.fillStyle = INK; g.font = '700 22px Arial'; g.textAlign = 'center'; g.fillText('MON 2', 256, 225);
    }, 9);
    const front = new THREE.PlaneGeometry(0.66, 0.4);
    const foot = new THREE.CylinderGeometry(0.03, 0.035, 0.03, 10);
    const cable = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.3, 0.04, -0.2), new THREE.Vector3(0.55, 0.012, -0.05), new THREE.Vector3(0.9, 0.012, -0.3), new THREE.Vector3(1.3, 0.012, -0.1)]), 30, 0.014, 6);
    const side = face(256, 256, color, (g) => { inset(g, 30, 60, 196, 150, tint(color, 0.82), 12); g.fillStyle = '#76b900'; g.fillRect(30, 225, 196, 10); }, 4);
    side.wrapS = side.wrapT = THREE.RepeatWrapping; side.repeat.set(2.2, 2.6);
    return { body, grille, front, foot, cable, side };
  }, []);
  return (
    <group position={pos} rotation={rot}>
      <Solid geo={p.body} role="prop" color="#ffffff" map={p.side} />
      {/* grille sits on the slanted face (from (z .24, y .12) up to (z -.1, y .36)) */}
      <mesh geometry={p.front} position={[0, 0.265, 0.088]} rotation={[-Math.atan2(0.34, 0.24), 0, 0]}><meshToonMaterial map={p.grille} emissive="#3a2a6e" emissiveIntensity={0.4} /></mesh>
      {[-0.28, 0.28].flatMap((x) => [-0.18, 0.18].map((z) => <Solid key={`${x}${z}`} geo={p.foot} role="prop" color="#1e1a28" position={[x, -0.01, z]} />))}
      <Solid geo={p.cable} role="prop" color="#1e1a28" />
    </group>
  );
};

// Speaker stack cabinet: rounded box, painted grille cloth with 2 woofers + a horn, corner protectors, a top handle.
export const Speaker = ({ pos, rot = [0, 0, 0], size = [0.9, 1.8, 0.8], color = '#40357e' }: { pos: V3; rot?: V3; size?: V3; color?: string }) => {
  const [w, h, d] = size;
  const p = useMemo(() => {
    const body = rbox([w, h, d], 0.04);
    const side = face(256, 512, color, (g) => { inset(g, 40, 60, 176, 392, tint(color, 0.85), 14); }, 5);
    const grille = face(360, 720, '#2a2446', (g) => {
      const ring = (y: number, r: number) => { for (let i = 0; i < 4; i++) { g.fillStyle = ['#3a3360', '#575080', '#2a2446', '#8a84b0'][i]; g.beginPath(); g.arc(180, y, r * (1 - i * 0.24), 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); } g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.ellipse(150, y - r * 0.45, r * 0.3, r * 0.1, -0.4, 0, 7); g.fill(); };
      inset(g, 90, 50, 180, 90, '#3a3360', 30); g.fillStyle = '#1a1630'; g.beginPath(); g.ellipse(180, 95, 60, 22, 0, 0, 7); g.fill();   // horn
      ring(300, 120); ring(560, 120);
      g.fillStyle = '#c9c4d8'; g.font = '900 28px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('SNEL', 180, 700);
    }, 11);
    const front = new THREE.PlaneGeometry(w * 0.9, h * 0.94);
    const corner = rbox([0.1, 0.1, 0.1], 0.03);
    const handle = rbox([0.3, 0.05, 0.08], 0.02);
    return { body, side, grille, front, corner, handle };
  }, [w, h, d, color]);
  return (
    <group position={pos} rotation={rot}>
      <group position={[0, h / 2, 0]}>
        <Solid geo={p.body} role="prop" map={p.side} color="#ffffff" />
        <mesh geometry={p.front} position={[0, 0, d / 2 + 0.003]}><meshToonMaterial map={p.grille} emissive="#3a2a6e" emissiveIntensity={0.4} /></mesh>
        {[-1, 1].flatMap((sx) => [-1, 1].map((sy) => <Solid key={`${sx}${sy}`} geo={p.corner} role="prop" color="#d9d6e2" position={[sx * w / 2, sy * h / 2, d / 2]} />))}
        <Solid geo={p.handle} role="prop" color="#1e1a28" position={[0, h / 2 + 0.02, 0]} />
      </group>
    </group>
  );
};

// Lectern: tapered body with a front panel + logo plate, slanted desk top, gooseneck mic, a water glass.
export const Lectern = ({ pos, rot = [0, 0, 0], logo }: { pos: V3; rot?: V3; logo?: HTMLImageElement }) => {
  const p = useMemo(() => {
    const body = new THREE.CylinderGeometry(0.36, 0.3, 1.05, 4, 1); body.rotateY(Math.PI / 4); body.scale(1, 1, 0.75);
    const top = rbox([0.82, 0.07, 0.58], 0.025);
    const front = face(400, 520, '#ebe6f4', (g) => {
      inset(g, 40, 40, 320, 440, '#d8d2e8', 18);
      inset(g, 90, 150, 220, 140, '#1d1f26', 12); if (logo) { g.shadowColor = '#9dff3a'; g.shadowBlur = 24; g.drawImage(logo, 135, 165, 130, 110); g.shadowBlur = 0; }
      g.fillStyle = '#76b900'; g.fillRect(40, 420, 320, 22); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(40, 420, 320, 22);
    }, 13);
    const panel = new THREE.PlaneGeometry(0.5, 0.9);
    const neck = new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.12, 0.02), new THREE.Vector3(0.03, 0.24, 0.1), new THREE.Vector3(0.06, 0.3, 0.2)]), 20, 0.012, 6);
    const mic = new THREE.CapsuleGeometry(0.03, 0.05, 4, 10);
    const glass = new THREE.CylinderGeometry(0.04, 0.034, 0.12, 14);
    return { body, top, front, panel, neck, mic, glass };
  }, [logo]);
  return (
    <group position={pos} rotation={rot}>
      <Solid geo={p.body} role="prop" color="#ebe6f4" position={[0, 0.525, 0]} />
      <mesh geometry={p.panel} position={[0, 0.5, 0.235]} rotation={[0.055, 0, 0]}><meshToonMaterial map={p.front} emissive="#3a2a6e" emissiveIntensity={0.3} /></mesh>
      <Solid geo={p.top} role="prop" color="#2c2a34" position={[0, 1.08, 0.02]} rotation={[0.22, 0, 0]} />
      <group position={[0.22, 1.12, 0.12]}>
        <Solid geo={p.neck} role="prop" color="#1e1a28" />
        <Solid geo={p.mic} role="prop" color="#2c2a34" position={[0.06, 0.32, 0.22]} rotation={[1.1, 0, 0]} />
      </group>
      <Solid geo={p.glass} role="prop" color="#bfe6ff" position={[-0.26, 1.18, 0.08]} />
    </group>
  );
};

// Truss: square box truss (4 chords + zigzag diagonals) instead of one bar.
export const TrussBeam = ({ pos, len = 6.6 }: { pos: V3; len?: number }) => {
  const p = useMemo(() => {
    const chord = new THREE.CylinderGeometry(0.03, 0.03, len, 8); chord.rotateZ(Math.PI / 2);
    const n = Math.round(len / 0.32), diag = new THREE.CylinderGeometry(0.014, 0.014, 0.3, 6);
    return { chord, diag, n };
  }, [len]);
  const c = '#e9e4f2', s = 0.14;
  return (
    <group position={pos}>
      {[-s, s].flatMap((y) => [-s, s].map((z) => <Solid key={`${y}${z}`} geo={p.chord} role="prop" color={c} position={[0, y, z]} />))}
      {Array.from({ length: p.n }, (_, i) => [-s, s].map((z) => <Solid key={`${i}${z}`} geo={p.diag} role="set" color={c} position={[-len / 2 + (i + 0.5) * (len / p.n), 0, z]} rotation={[0, 0, i % 2 ? 0.75 : -0.75]} />))}
    </group>
  );
};

// Stage spot can with a yoke and 4 barn doors (lens/cone handled by the caller).
export const SpotCan = ({ color = '#5a4ab0' }: { color?: string }) => {
  const p = useMemo(() => ({
    can: new THREE.CylinderGeometry(0.2, 0.26, 0.48, 20),
    ring: new THREE.TorusGeometry(0.26, 0.03, 8, 24),
    yoke: new THREE.TorusGeometry(0.3, 0.025, 6, 20, Math.PI),
    door: new THREE.BoxGeometry(0.3, 0.14, 0.012),
    clamp: rbox([0.1, 0.16, 0.1], 0.02),
  }), []);
  return (
    <group>
      <Solid geo={p.clamp} role="prop" color="#2c2a34" position={[0, 0.28, 0]} />
      <Solid geo={p.yoke} role="prop" color="#2c2a34" position={[0, 0.0, 0]} rotation={[0, 0, Math.PI]} />
      <group rotation={[0.35, 0, 0]}>
        <Solid geo={p.can} role="prop" color={color} />
        <Solid geo={p.ring} role="prop" color="#d9d6e2" position={[0, -0.24, 0]} rotation={[Math.PI / 2, 0, 0]} />
        {[0, 1, 2, 3].map((i) => <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}><Solid geo={p.door} role="prop" color="#2c2a34" position={[0, -0.3, 0.27]} rotation={[0.5, 0, 0]} /></group>)}
      </group>
    </group>
  );
};

// A logo from public/logos (Expansion symlink, never in git), recoloured, as an <img> for canvas textures.
export const useLogo = (file: string, fill: string) => {
  const [img, set] = useState<HTMLImageElement | null>(null);
  const [h] = useState(() => delayRender('logo ' + file));
  useEffect(() => {
    fetch(staticFile('logos/' + file)).then((r) => r.text()).then((svg) => {
      const i = new Image(); i.onload = () => set(i);
      i.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.replace('<path ', `<path fill="${fill}" `));
    });
  }, [file, fill]);
  useEffect(() => { if (img) requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); }, [img, h]);
  return img;
};

export const canvasTex = (w: number, h: number, paint: (g: CanvasRenderingContext2D) => void, rep?: [number, number]) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t;
};
export const Curtain = ({ x, w = 3, h = 9, color = '#c2306f' }: { x: number; w?: number; h?: number; color?: string }) => {
  const fold = useMemo(() => new THREE.CylinderGeometry(0.2, 0.2, h, 12, 1, false, 0, Math.PI), [h]);
  const n = Math.round(w / 0.34);
  return <group>{Array.from({ length: n }, (_, i) =>
    <Solid key={i} geo={fold} color={i % 2 ? color : '#a8245c'} position={[x - w / 2 + i * (w / n) + 0.17, h / 2 - 0.4, -3.3 + (i % 2) * 0.12]} rotation={[0, -Math.PI / 2, 0]} />)}</group>;
};
const AO_TEX = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(64, 64, 8, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
})();
// AO at the base (Ricks: every object sits in a soft dark pool, never floats)
export const AO = ({ pos, size }: { pos: V3; size: [number, number] }) =>
  <mesh position={[pos[0], pos[1] + 0.005, pos[2]]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}><planeGeometry args={size} /><meshBasicMaterial map={AO_TEX} color="#2a1c52" transparent opacity={0.55} depthWrite={false} /></mesh>;

// Lighting rig: box truss + spot cans; on[i] 0..1 per can (lens + cone fade with it).
export const StageRig = ({ on, xs = [-2.4, -1.2, 0, 1.2, 2.4], y = 6.2, z = 0.6 }: { on: number[]; xs?: number[]; y?: number; z?: number }) => {
  return (
    <group>
      <TrussBeam pos={[0, y, z]} />
      {xs.map((x, i) => (
        <group key={i} position={[x, y - 0.35, z]}>
          <SpotCan />
          <mesh position={[0, -0.27, 0.09]} rotation={[0.35, 0, 0]}><circleGeometry args={[0.24, 24]} /><meshBasicMaterial color={on[i] ? '#fff4d6' : '#3b3644'} side={THREE.DoubleSide} /></mesh>
          {on[i] > 0 && <mesh position={[0, -2.9, 0.95]} rotation={[0.33, 0, 0]}><coneGeometry args={[1.0, 5.6, 32, 1, true]} /><meshBasicMaterial color="#ffd9a0" transparent opacity={0.05 * on[i]} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
        </group>
      ))}
    </group>
  );
};

// Keynote hall: stage with painted boards + skirt + footlights, LED wall (pass the slide as `screen`), slatted
// back wall, curtains, speaker stacks, lectern, carpet and seat rows with heads. Origin = stage front centre at y 0.
export const StageSet = ({ screen, logo }: { screen: THREE.Texture; logo?: HTMLImageElement }) => {
  const floor = useMemo(() => paint('planks', '#f2b98e', 4), []);                       // painted stage boards (Ricks: grain + seams)
  const panels = useMemo(() => canvasTex(256, 256, (g) => { g.fillStyle = '#8f7cd8'; g.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 32) { g.fillStyle = '#a593e6'; g.fillRect(x + 4, 0, 22, 256); g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(x + 4, 0, 4, 256); g.fillStyle = '#261a22'; g.fillRect(x + 28, 0, 2, 256); } }, [8, 1]), []);   // vertical acoustic slats (not brick)
  const skirt = useMemo(() => canvasTex(512, 128, (g) => { g.fillStyle = '#2e9a9a'; g.fillRect(0, 0, 512, 128); for (let i = 0; i < 4; i++) { g.fillStyle = '#48c0bc'; g.fillRect(14 + i * 128, 18, 100, 92); g.strokeStyle = '#ffb070'; g.lineWidth = 3; g.strokeRect(14 + i * 128, 18, 100, 92); } }, [3, 1]), []);
  const carpet = useMemo(() => canvasTex(128, 128, (g) => { g.fillStyle = '#7a4ab8'; g.fillRect(0, 0, 128, 128); g.fillStyle = '#8a5ac8'; for (let i = 0; i < 8; i++) g.fillRect(0, i * 16, 128, 6); }, [20, 15]), []);
  const seat = useMemo(() => new THREE.BoxGeometry(0.62, 0.9, 0.5), []);
  const head = useMemo(() => new THREE.SphereGeometry(0.2, 18, 12), []);
  const hair = ['#2a1f2a', '#5a3a2a', '#c9a24a', '#1a1a22', '#7a4a3a', '#d8d4e0'];
  return (
    <group>
      {/* stage: tiled top, panelled front skirt, footlights on the edge */}
      <Box size={[12, 0.8, 6]} pos={[0, -0.4, -1]} map={floor} rep={[5, 2.5]} />
      <mesh position={[0, -0.4, 2.01]}><planeGeometry args={[12, 0.8]} /><meshStandardMaterial map={skirt} roughness={0.7} /></mesh>
      <Box size={[12.1, 0.06, 0.1]} pos={[0, 0.0, 2.0]} color="#ffb070" />
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-4.8 + i * 1.2, 0.06, 1.85]}><boxGeometry args={[0.3, 0.1, 0.14]} /><meshBasicMaterial color="#ffe6b0" /></mesh>)}
      {/* LED wall with the keynote slide, frame around it */}
      <mesh position={[0, 3.6, -3.55]}><planeGeometry args={[7.6, 4.75]} /><meshBasicMaterial map={screen} /></mesh>
      <Box size={[8.0, 0.25, 0.3]} pos={[0, 6.05, -3.5]} color="#f3e6d8" /><Box size={[8.0, 0.25, 0.3]} pos={[0, 1.15, -3.5]} color="#f3e6d8" />
      <Box size={[0.25, 5.1, 0.3]} pos={[-3.9, 3.6, -3.5]} color="#f3e6d8" /><Box size={[0.25, 5.1, 0.3]} pos={[3.9, 3.6, -3.5]} color="#f3e6d8" />
      <Box size={[20, 12, 0.2]} pos={[0, 5, -3.9]} map={panels} rep={[8, 5]} />
      {/* curtains both sides + valance */}
      <Curtain x={-5.6} /><Curtain x={5.6} />
      <Box size={[14, 0.9, 0.4]} pos={[0, 7.4, -3.1]} color="#a8245c" />
      {/* speaker stacks */}
      <Speaker pos={[-4.4, 0, 0.6]} rot={[0, 0.25, 0]} /><Speaker pos={[4.4, 0, 0.6]} rot={[0, -0.25, 0]} />
      <AO pos={[-1.6, 0, 0.2]} size={[1.4, 1.1]} /><AO pos={[-4.4, 0, 0.6]} size={[1.6, 1.4]} /><AO pos={[4.4, 0, 0.6]} size={[1.6, 1.4]} />
      {/* lectern stage left */}
      <Lectern pos={[-1.6, 0, 0.2]} rot={[0, 0.3, 0]} logo={logo} />
      {/* audience: carpet, seat rows with heads (back rows), aisle lights */}
      <Box size={[40, 0.1, 30]} pos={[0, -0.85, 10]} map={carpet} />
      {[4.2, 5.4, 6.6].map((z, r) => Array.from({ length: 13 }, (_, i) => {
        const x = -6 + i, filled = (i * 7 + r * 3) % 5 !== 0;
        return <group key={`${r}-${i}`}>
          <Solid geo={seat} color={r % 2 ? '#b02a5e' : '#c2306f'} position={[x, -0.35, z]} />
          {filled && <Solid geo={head} color={hair[(i + r * 2) % hair.length]} position={[x, 0.35, z - 0.05]} />}
        </group>;
      }))}
    </group>
  );
};

