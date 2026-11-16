import { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { useThree } from '@react-three/fiber';
import { MascotCard } from '../../../src/templates/toon-2d/Card';
import { paint } from '../2026-11-16-style-guide/paint';
import { Post } from '../../../src/templates/toon-2d/Post';

// Lab: the same street with the style guide values (references/toon-2d.md).
const G = {
  skyTop: '#2f5fc8', skyHorizon: '#b8cdea', ink: '#261a22',
  key: '#ffe2b8', keyI: 2.2, hemiSky: '#8c7bb8', hemiGround: '#3a2438', hemiI: 0.6, rim: '#ffb070', rimI: 0.8,
};

// 3-step toon ramp 1.0 / 0.82 / 0.62
const ramp = (() => {
  const t = new THREE.DataTexture(new Uint8Array([158, 209, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
const Toon = ({ color = '#ffffff', map }: { color?: string; map?: THREE.Texture }) =>
  <meshToonMaterial color={color} map={map} gradientMap={ramp} />;

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

const Box = ({ size, pos, map, color, rep = [1, 1] }: { size: [number, number, number]; pos: [number, number, number]; map?: THREE.Texture; color?: string; rep?: [number, number] }) => {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size.join()]);
  const m = useMemo(() => { if (!map) return undefined; const t = map.clone(); t.repeat.set(...rep); t.needsUpdate = true; return t; }, [map, rep.join()]);
  return (
    <group position={pos}>
      <mesh geometry={geo} castShadow receiveShadow><Toon map={m} color={color} /></mesh>
      <Ink geo={geo} />
    </group>
  );
};

const Window = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    <Box size={[0.8, 1.0, 0.08]} pos={[0, 0, 0]} color="#5a3a2a" />
    <Box size={[0.62, 0.82, 0.06]} pos={[0, 0, 0.03]} color="#1c1f52" />
    <Box size={[0.06, 0.82, 0.08]} pos={[0, 0, 0.05]} color="#5a3a2a" />
    <Box size={[0.62, 0.06, 0.08]} pos={[0, 0, 0.05]} color="#5a3a2a" />
  </group>
);

const House = ({ x, h, wall, kind }: { x: number; h: number; wall: string; kind: 'planks' | 'brick' | 'plaster' }) => {
  const wallTex = useMemo(() => paint(kind, wall, Math.round(x * 10 + 50)), [kind, wall, x]);
  const roofTex = useMemo(() => paint('tiles', '#b5523b', 11), []);
  const roof = useMemo(() => { const g = new THREE.ConeGeometry(2.75, 1.7, 4); g.rotateY(Math.PI / 4); return g; }, []);
  const rt = useMemo(() => { const t = roofTex.clone(); t.repeat.set(3, 2); t.needsUpdate = true; return t; }, [roofTex]);
  return (
    <group position={[x, 0, -6]}>
      <Box size={[3.2, h, 3]} pos={[0, h / 2, 0]} map={wallTex} rep={[2, h / 2]} />
      <Box size={[3.5, 0.18, 3.3]} pos={[0, h + 0.05, 0]} color="#5a3a2a" />
      <group position={[0, h + 0.95, 0]}>
        <mesh geometry={roof} castShadow><Toon map={rt} /></mesh><Ink geo={roof} />
      </group>
      <Box size={[0.9, 1.7, 0.1]} pos={[0.6, 0.85, 1.52]} map={paint('planks', '#6d4f51', 3)} rep={[1, 2]} />
      <Window pos={[-0.8, 1.6, 1.52]} />
      <Window pos={[-0.8, h - 1.1, 1.52]} />
      <Window pos={[0.7, h - 1.1, 1.52]} />
      <Box size={[3.3, 0.35, 3.1]} pos={[0, 0.17, 0]} color="#4e2c2d" />
    </group>
  );
};

const Barrel = ({ pos, s = 1 }: { pos: [number, number, number]; s?: number }) => {
  const geo = useMemo(() => new THREE.CylinderGeometry(0.42 * s, 0.38 * s, 1.0 * s, 16), [s]);
  const tex = useMemo(() => paint('planks', '#8f542c', 5), []);
  return <group position={pos}><mesh geometry={geo} castShadow><Toon map={tex} /></mesh><Ink geo={geo} /></group>;
};

const Lamp = ({ pos }: { pos: [number, number, number] }) => (
  <group position={pos}>
    <Box size={[0.12, 3.2, 0.12]} pos={[0, 1.6, 0]} color="#2b2a3a" />
    <mesh position={[0, 3.35, 0]}><sphereGeometry args={[0.22, 16, 12]} /><meshStandardMaterial color="#ffc870" emissive="#ffc870" emissiveIntensity={2} toneMapped={false} /></mesh>
  </group>
);

const Plant = ({ pos }: { pos: [number, number, number] }) => {
  const pot = useMemo(() => new THREE.CylinderGeometry(0.3, 0.22, 0.45, 12), []);
  const bush = useMemo(() => new THREE.IcosahedronGeometry(0.5, 1), []);
  return <group position={pos}>
    <group position={[0, 0.22, 0]}><mesh geometry={pot} castShadow><Toon color="#c9785a" /></mesh><Ink geo={pot} /></group>
    <group position={[0, 0.8, 0]}><mesh geometry={bush} castShadow><Toon color="#70aa79" /></mesh><Ink geo={bush} /></group>
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

const Camera = () => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); const cam = useThree((s) => s.camera);
  const t = interpolate(f, [0, durationInFrames - 1], [0, 1], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
  cam.position.set(4.6 - t * 1.2, 5.2 - t * 0.6, 9.0 - t * 1.4); cam.lookAt(0.2, 1.1, -1.8); cam.updateProjectionMatrix();
  return null;
};

export const LabOdPost = () => {
  const { width, height } = useVideoConfig();
  const cobble = useMemo(() => { const t = paint('cobble', '#b78656', 9); t.repeat.set(110, 110); return t; }, []);
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{ fov: 40, near: 0.1, far: 500 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ scene, gl }) => { scene.fog = new THREE.Fog(G.skyHorizon, 20, 120); gl.toneMapping = THREE.NoToneMapping; }}>
      <Camera />
      <Sky />
      <hemisphereLight args={[G.hemiSky, G.hemiGround, G.hemiI]} />
      <directionalLight color={G.key} intensity={G.keyI} position={[-6, 8, 5]} castShadow
        shadow-mapSize={[2048, 2048]} shadow-radius={1.5} shadow-bias={-0.0004}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
      <directionalLight color={G.rim} intensity={G.rimI} position={[4, 5, -8]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[200, 200]} /><Toon map={cobble} /></mesh>
      <House x={-3.6} h={4.2} wall="#e2cfa6" kind="plaster" />
      <House x={0} h={5} wall="#b5603f" kind="brick" />
      <House x={3.6} h={3.8} wall="#d28930" kind="planks" />
      <Lamp pos={[-1.9, 0, -3.8]} />
      <Barrel pos={[2.2, 0.5, -3.9]} />
      <Plant pos={[1.4, 0, -4.2]} />
      <Barrel pos={[-2.6, 0.5, -3.6]} />
      <Plant pos={[-3.2, 0, -4.0]} />
      <Lamp pos={[2.8, 0, -3.4]} />
      <Barrel pos={[3.4, 0.6, 3.6]} s={1.2} />
      <Plant pos={[2.7, 0, 4.2]} />
      <MascotCard position={[0, 0, 0]} height={1.7} arms="wave" />
      <Post focus={10.2} k={22} max={14} />
    </ThreeCanvas>
  );
};
