import { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { useThree } from '@react-three/fiber';
import { MascotCard } from '../../../src/templates/toon-2d/Card';
import { paint } from '../2026-11-16-style-guide/paint';
import { Post } from '../../../src/templates/toon-2d/Post';
// @ts-ignore plain js
import { drawSide } from '../2026-11-17-side-chars/sidekit.js';
// @ts-ignore plain js
import { drawWojak } from './wojakbody.js';
import { staticFile, delayRender, continueRender } from 'remotion';
import { useEffect, useState } from 'react';
// @ts-ignore plain js
import { MASCOT_ARMS } from '../../../src/templates/toon-2d/mascot2d.js';

// Lab test 11: wojak bodies that match the meme heads (wojakbody.js), next to our own drawn side characters.
// Lab test 10: real wojak heads (PNGs from Expansion via public/memes symlink, not in git), focus follows the mascot
// in every camera mode (Post focusOn), ink on the set is a knob: ink = 'none' | 'props' | 'all'.
// Lab test 9: side characters (flat cards from our Open Design kit, drawn faces) around the mascot card,
// a white house in the sun for whites, and a close-up (mode 'close').
// Lab test 8: the mascot as a real 3D model (Mascot3D.tsx) instead of the flat card; he turns and waves every frame.
// mode 'close' = close-up camera, 'card' = the same close-up with the old flat card, for the comparison.
// Lab test 7: set exposure up for whites (key 2.2->2.9, hemi 0.75->1.0), white trims really white,
// hero ink 3x thicker (inverted hull 0.035->0.10). (from test 6)
// Lab test 6: ink split like Ricks (scan 2026-11-17): only the mascot + one hero prop get toon + ink,
// the set is plain lit 3D (standard material, soft specular, no outline). Palette between test 4 and 5.
// (from test 5) mascot self-lit like Ricks' characters, less orange, high camera back.
// mode 'flat' renders only the mascot as the plain drawing on green: the target for lab/mascot.py.
// (from test 4) palette + post knobs. Test 3 measured 84% orange, 0% white, sat 0.62 (Ricks: 55-66%, 3-21%, 0.32-0.53).
// Changes: cream/white + blue surfaces next to the warm ones, sky in frame, whiter key, post sat 0.95, knee 0.92.
const G = {
  skyTop: '#2f5fc8', skyHorizon: '#b8cdea', ink: '#261a22',
  key: '#fff1dc', keyI: 2.9, hemiSky: '#8c7bb8', hemiGround: '#5a4a52', hemiI: 1.0, rim: '#ffb070', rimI: 0.8,
};

// 3-step toon ramp 1.0 / 0.82 / 0.62
const ramp = (() => {
  const t = new THREE.DataTexture(new Uint8Array([158, 209, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
const Toon = ({ color = '#ffffff', map }: { color?: string; map?: THREE.Texture }) =>
  <meshToonMaterial color={color} map={map} gradientMap={ramp} />;
// The set: plain lit 3D, no ink (Ricks: sets, machines, metal, far things).
const Set3D = ({ color = '#ffffff', map, metal = 0 }: { color?: string; map?: THREE.Texture; metal?: number }) =>
  <meshStandardMaterial color={color} map={map} roughness={metal ? 0.35 : 0.72} metalness={metal} />;

// Silhouette (inverted hull) + crease lines.
const Ink = ({ geo, w = 0.035 }: { geo: THREE.BufferGeometry; w?: number }) => {
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 30), [geo]);
  return (
    <>
      <mesh geometry={geo} scale={1 + w}><meshBasicMaterial color={G.ink} side={THREE.BackSide} /></mesh>
      <lineSegments geometry={edges}><lineBasicMaterial color={G.ink} /></lineSegments>
    </>
  );
};

// Set ink knob, set once per render by the composition.
let INK: 'none' | 'props' | 'all' = 'none';
const Box = ({ size, pos, map, color, rep = [1, 1], hero = false }: { size: [number, number, number]; pos: [number, number, number]; map?: THREE.Texture; color?: string; rep?: [number, number]; hero?: boolean }) => {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size.join()]);
  const m = useMemo(() => { if (!map) return undefined; const t = map.clone(); t.repeat.set(...rep); t.needsUpdate = true; return t; }, [map, rep.join()]);
  return (
    <group position={pos}>
      <mesh geometry={geo} castShadow receiveShadow>{hero ? <Toon map={m} color={color} /> : <Set3D map={m} color={color} />}</mesh>
      {hero ? <Ink geo={geo} w={0.10} /> : INK === 'all' && <Ink geo={geo} />}
    </group>
  );
};

const Window = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    <Box size={[0.8, 1.0, 0.08]} pos={[0, 0, 0]} color="#ffffff" />
    <Box size={[0.62, 0.82, 0.06]} pos={[0, 0, 0.03]} color="#2c4f8a" />
    <Box size={[0.06, 0.82, 0.08]} pos={[0, 0, 0.05]} color="#ffffff" />
    <Box size={[0.62, 0.06, 0.08]} pos={[0, 0, 0.05]} color="#ffffff" />
  </group>
);

const House = ({ x, h, wall, kind, roofColor = '#b5523b', door = '#6d4f51' }: { x: number; h: number; wall: string; kind: 'planks' | 'brick' | 'plaster'; roofColor?: string; door?: string }) => {
  const wallTex = useMemo(() => paint(kind, wall, Math.round(x * 10 + 50)), [kind, wall, x]);
  const roofTex = useMemo(() => paint('tiles', roofColor, 11), [roofColor]);
  const roof = useMemo(() => { const g = new THREE.ConeGeometry(2.75, 1.7, 4); g.rotateY(Math.PI / 4); return g; }, []);
  const rt = useMemo(() => { const t = roofTex.clone(); t.repeat.set(3, 2); t.needsUpdate = true; return t; }, [roofTex]);
  return (
    <group position={[x, 0, -6]}>
      <Box size={[3.2, h, 3]} pos={[0, h / 2, 0]} map={wallTex} rep={[2, h / 2]} />
      <Box size={[3.5, 0.18, 3.3]} pos={[0, h + 0.05, 0]} color="#ffffff" />
      <group position={[0, h + 0.95, 0]}>
        <mesh geometry={roof} castShadow><Set3D map={rt} /></mesh>
      </group>
      <Box size={[0.9, 1.7, 0.1]} pos={[0.6, 0.85, 1.52]} map={paint('planks', door, 3)} rep={[1, 2]} />
      <Window pos={[-0.8, 1.6, 1.52]} />
      <Window pos={[-0.8, h - 1.1, 1.52]} />
      <Window pos={[0.7, h - 1.1, 1.52]} />
      <Box size={[3.3, 0.35, 3.1]} pos={[0, 0.17, 0]} color="#8a8a96" />
    </group>
  );
};

const Barrel = ({ pos, s = 1 }: { pos: [number, number, number]; s?: number }) => {
  const geo = useMemo(() => new THREE.CylinderGeometry(0.42 * s, 0.38 * s, 1.0 * s, 16), [s]);
  const tex = useMemo(() => paint('planks', '#8f542c', 5), []);
  return <group position={pos}><mesh geometry={geo} castShadow><Set3D map={tex} /></mesh>{INK !== 'none' && <Ink geo={geo} w={0.05} />}</group>;
};

const Lamp = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    <mesh position={[0, 1.6, 0]} castShadow><cylinderGeometry args={[0.06, 0.07, 3.2, 12]} /><Set3D color="#3a3d48" metal={0.8} /></mesh>
    <mesh position={[0, 3.35, 0]}><sphereGeometry args={[0.22, 16, 12]} /><meshStandardMaterial color="#ffc870" emissive="#ffc870" emissiveIntensity={2} toneMapped={false} /></mesh>
  </group>
);

const Plant = ({ pos }: { pos: [number, number, number] }) => {
  const pot = useMemo(() => new THREE.CylinderGeometry(0.3, 0.22, 0.45, 12), []);
  const bush = useMemo(() => new THREE.IcosahedronGeometry(0.5, 1), []);
  return <group position={pos}>
    <group position={[0, 0.22, 0]}><mesh geometry={pot} castShadow><Set3D color="#c9785a" /></mesh>{INK !== 'none' && <Ink geo={pot} w={0.05} />}</group>
    <group position={[0, 0.8, 0]}><mesh geometry={bush} castShadow><Set3D color="#70aa79" /></mesh>{INK !== 'none' && <Ink geo={bush} w={0.05} />}</group>
  </group>;
};

const Sky = () => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(G.skyTop) }, bottom: { value: new THREE.Color(G.skyHorizon) } },
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 p; void main(){ gl_FragColor = vec4(mix(bottom, top, smoothstep(0., .55, p.y)), 1.); }',
  }), []);
  return <mesh material={mat}><sphereGeometry args={[400, 32, 16]} /></mesh>;
};

const ContactShadow = ({ pos, w = 0.9 }: { pos: [number, number, number]; w?: number }) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(64, 64, 10, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
  }, []);
  return <mesh position={pos} rotation={[-Math.PI / 2, 0, 0]} scale={[w, w * 0.35, 1]}><planeGeometry /><meshBasicMaterial map={tex} transparent depthWrite={false} /></mesh>;
};

const Camera = ({ mode = 'full' }: { mode?: string }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); const cam = useThree((s) => s.camera);
  const t = interpolate(f, [0, durationInFrames - 1], [0, 1], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
  if (mode === 'close' || mode === 'card') { cam.position.set(1.6 - t * 0.5, 1.9 - t * 0.2, 3.4 - t * 0.6); cam.lookAt(0, 1.15, 0); }
  else { cam.position.set(4.6 - t * 1.2, 5.4 - t * 0.6, 9.0 - t * 1.4); cam.lookAt(0.2, 1.7, -2.4); } cam.updateProjectionMatrix();
  return null;
};

const MEMES = ['wojak', 'npc-wojak', 'chad', 'doomer'];
const useMemes = () => {
  const [imgs, set] = useState<Record<string, HTMLImageElement> | null>(null);
  const [h] = useState(() => delayRender('memes'));
  useEffect(() => { Promise.all(MEMES.map((n) => new Promise<[string, HTMLImageElement]>((ok) => { const i = new Image(); i.onload = () => ok([n, i]); i.src = staticFile(`memes/${n}.png`); })))
    .then((a) => { set(Object.fromEntries(a)); continueRender(h); }); }, [h]);
  return imgs;
};

export const LabWojakBody = ({ mode = 'full', ink = 'none' }: { mode?: 'full' | 'flat' | 'close' | 'card'; ink?: 'none' | 'props' | 'all' }) => {
  INK = ink; const memes = useMemes(); if (!memes) return null;
  const { width, height } = useVideoConfig();
  const cobble = useMemo(() => { const t = paint('cobble', '#c4c3c0', 9); t.repeat.set(110, 110); return t; }, []);
  if (mode === 'flat') return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 40, near: 0.1, far: 500 }} gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ scene, gl }) => { scene.background = new THREE.Color('#00ff00'); gl.toneMapping = THREE.NoToneMapping; }}>
      <Camera /><MascotCard position={[0, 0, 0]} height={1.7} arms="wave" self={1} />
    </ThreeCanvas>
  );
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{ fov: 40, near: 0.1, far: 500 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ scene, gl }) => { scene.fog = new THREE.Fog(G.skyHorizon, 20, 120); gl.toneMapping = THREE.NoToneMapping; }}>
      <Camera mode={mode} />
      <Sky />
      <hemisphereLight args={[G.hemiSky, G.hemiGround, G.hemiI]} />
      <directionalLight color={G.key} intensity={G.keyI} position={[-6, 8, 5]} castShadow
        shadow-mapSize={[2048, 2048]} shadow-radius={1.5} shadow-bias={-0.0004}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
      <directionalLight color={G.rim} intensity={G.rimI} position={[4, 5, -8]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[200, 200]} /><Set3D map={cobble} /></mesh>
      <House x={-3.6} h={4.2} wall="#ffffff" kind="plaster" door="#3f6fb0" />
      <House x={0} h={5} wall="#b5603f" kind="brick" />
      <House x={3.6} h={3.8} wall="#5b8fcc" kind="planks" roofColor="#40587e" door="#f3ead6" />
      <Lamp pos={[-1.9, 0, -3.8]} />
      <Barrel pos={[2.2, 0.5, -3.9]} />
      <Plant pos={[1.4, 0, -4.2]} />
      <Barrel pos={[-2.6, 0.5, -3.6]} />
      <Plant pos={[-3.2, 0, -4.0]} />
      <Lamp pos={[2.8, 0, -3.4]} />
      <Box size={[1.3, 1.1, 1.1]} pos={[3.4, 0.55, 3.6]} color="#4a7fc0" />
      <Plant pos={[2.7, 0, 4.2]} />
      <MascotCard position={[0, 0, 0]} height={1.7} arms="wave" self={0.8} />
      {memes && <>
        <MascotCard position={[-1.5, 0, -0.9]} height={1.75} self={0.8} drawKey="smug" draw={(g) => drawSide(g, { outfit: 'suit', face: 'smug', tie: '#d8443c', arms: MASCOT_ARMS.point })} />
        <MascotCard position={[1.9, 0, -1.3]} height={1.7} self={0.8} drawKey="wb-doomer" draw={(g) => drawWojak(g, memes.doomer, { arms: MASCOT_ARMS.down, legs: '#2a2a30' })} />
        <MascotCard position={[-0.4, 0, -2.4]} height={1.75} self={0.8} drawKey="wb-wojak" draw={(g) => drawWojak(g, memes.wojak, { arms: MASCOT_ARMS.up, mark: '!' })} />
        <MascotCard position={[2.6, 0, -3.2]} height={1.7} self={0.8} drawKey="wb-npc" draw={(g) => drawWojak(g, memes['npc-wojak'], { arms: MASCOT_ARMS.down, legs: '#6a6a6a' })} />
        <MascotCard position={[-2.6, 0, -2.0]} height={1.8} self={0.8} drawKey="wb-chad" draw={(g) => drawWojak(g, memes.chad, { arms: MASCOT_ARMS.down, legs: '#30364a' })} />
        <MascotCard position={[0.9, 0, -0.6]} height={1.7} self={0.8} drawKey="shock" draw={(g) => drawSide(g, { outfit: 'hoodie', face: 'shock', arms: MASCOT_ARMS.up })} />
      </>}
      <Box size={[0.7, 0.5, 0.5]} pos={[0.85, 0.25, 0.2]} color="#e8a23a" hero />
      <Post focusOn={[0, 1.2, 0]} focus={9.8} k={30} max={14} sat={0.95} knee={0.92} />
    </ThreeCanvas>
  );
};
