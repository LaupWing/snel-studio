import { createContext, useContext, useMemo } from 'react';
import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LOOK, type InkMode, type Look } from './look';

// Materials + ink for the world. The set is plain lit 3D (Set3D); story props + hero objects can be toon + inked.
// role: 'set' (inked only when ink = all), 'prop' (inked unless ink = none), 'hero' (always toon + thick ink).
export const InkCtx = createContext<InkMode>('props');
export const LookCtx = createContext<Look>(LOOK);   // the look in use (template values + the reel's mood override)
export type Role = 'set' | 'prop' | 'hero';
export const useInked = (role: Role) => { const m = useContext(InkCtx); return role === 'hero' || (role === 'prop' ? m !== 'none' : m === 'all'); };

const ramp = (() => {                                                 // 3-step toon ramp 1.0 / 0.82 / 0.62
  const t = new THREE.DataTexture(new Uint8Array([158, 209, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
export const Toon = ({ color = '#ffffff', map }: { color?: string; map?: THREE.Texture }) =>
  <meshToonMaterial color={color} map={map} gradientMap={ramp} emissive="#3a2a6e" emissiveIntensity={0.5} />;
export const Set3D = ({ color = '#ffffff', map, metal = 0 }: { color?: string; map?: THREE.Texture; metal?: number }) =>
  <meshStandardMaterial color={color} map={map} roughness={metal ? 0.35 : 0.72} metalness={metal} />;

// Ink, Ricks-measured (reports/materials.md): warm ink #261a22, silhouette width in SCREEN pixels
// = clamp(30 / distance, 1.5, 7) px at 1080 wide (thick near, thin far), plus crease lines.
// The hull pushes along smoothed normals in clip space, so boxes get one closed outline (no gaps at corners).
const smoothCache = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
const smoothed = (geo: THREE.BufferGeometry) => {
  let g = smoothCache.get(geo); if (g) return g;
  g = geo.clone(); for (const k of Object.keys(g.attributes)) if (k !== 'position') g.deleteAttribute(k);
  g = mergeVertices(g, 1e-4); g.computeVertexNormals(); smoothCache.set(geo, g); return g;
};
const hullMat = (k: number) => new THREE.ShaderMaterial({
  uniforms: { uColor: { value: new THREE.Color(LOOK.ink.color) }, uK: { value: k }, uRes: { value: new THREE.Vector2(1080, 1920) } },
  vertexShader: `uniform float uK; uniform vec2 uRes;
    void main(){
      vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec4 cn = projectionMatrix * modelViewMatrix * vec4(position + normal * 0.01, 1.0);
      vec2 d = cn.xy / cn.w - c.xy / c.w; float l = length(d); d = l > 1e-6 ? d / l : vec2(0.0);
      float px = clamp(30.0 / c.w, 1.5, 7.0) * uK * (uRes.x / 1080.0);
      c.xy += d * px * 2.0 / uRes * c.w;
      gl_Position = c;
    }`,
  fragmentShader: `uniform vec3 uColor; void main(){ gl_FragColor = vec4(uColor, 1.0); }`,
  side: THREE.BackSide,
});
// k: width multiplier per role (set 0.8, prop 1, hero 1.4); w is accepted for old callers and ignored.
export const Ink = ({ geo, k = 1 }: { geo: THREE.BufferGeometry; k?: number; w?: number }) => {
  const hull = useMemo(() => smoothed(geo), [geo]);
  const mat = useMemo(() => hullMat(k), [k]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 30), [geo]);
  return (
    <>
      <mesh geometry={hull} material={mat} onBeforeRender={(gl) => { const v = gl.getDrawingBufferSize(new THREE.Vector2()); mat.uniforms.uRes.value.copy(v); }} />
      <lineSegments geometry={edges}><lineBasicMaterial color={LOOK.ink.color} transparent opacity={0.8} /></lineSegments>
    </>
  );
};

// One mesh with the right material + ink for its role. Every surface is toon now (Loc 2026-11-17: OD/Ricks
// beat plain 3D): 3-step ramp + a blue-violet emissive floor so shade is never brown or black (OD).
export const Solid = ({ geo, role = 'set', color, map, metal, ...p }:
  { geo: THREE.BufferGeometry; role?: Role; color?: string; map?: THREE.Texture; metal?: number; position?: [number, number, number]; rotation?: [number, number, number] }) => {
  const inked = useInked(role);
  const k = role === 'hero' ? 1.4 : role === 'prop' ? 1 : 0.8;
  return (
    <group {...p}>
      <mesh geometry={geo} castShadow receiveShadow>{metal ? <Set3D color={color} map={map} metal={metal} /> : <Toon color={color} map={map} />}</mesh>
      {inked && <Ink geo={geo} k={k} />}
    </group>
  );
};

export const Box = ({ size, pos, map, color, rep = [1, 1], role = 'set' }:
  { size: [number, number, number]; pos: [number, number, number]; map?: THREE.Texture; color?: string; rep?: [number, number]; role?: Role }) => {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size.join()]);
  const m = useMemo(() => { if (!map) return undefined; const t = map.clone(); t.repeat.set(...rep); t.needsUpdate = true; return t; }, [map, rep.join()]);
  return <Solid geo={geo} role={role} map={m} color={color} position={pos} />;
};

export const Sky = () => {
  const L = useContext(LookCtx);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(L.sky.top) }, bottom: { value: new THREE.Color(L.sky.horizon) } },
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 p; void main(){ gl_FragColor = vec4(mix(bottom, top, smoothstep(0., .55, p.y)), 1.); }',
  }), [L]);
  return <mesh material={mat}><sphereGeometry args={[400, 32, 16]} /></mesh>;
};

export const Lights = () => { const LOOK = useContext(LookCtx); return (
  <>
    <hemisphereLight args={[LOOK.hemi.sky, LOOK.hemi.ground, LOOK.hemi.intensity]} />
    <directionalLight color={LOOK.key.color} intensity={LOOK.key.intensity} position={LOOK.key.position} castShadow
      shadow-mapSize={[2048, 2048]} shadow-radius={1.5} shadow-bias={-0.0004}
      shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
    <directionalLight color={LOOK.rim.color} intensity={LOOK.rim.intensity} position={LOOK.rim.position} />
  </>
); };
