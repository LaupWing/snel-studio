import { useMemo } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
import { LOOK } from './look';

// Two-tone toon ramp: lit or shade, nothing in between.
const ramp = (() => {
  const t = new THREE.DataTexture(new Uint8Array([90, 255]), 2, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();

export const Toon = ({ color }: { color: string }) => <meshToonMaterial color={color} gradientMap={ramp} />;

// Ink: a slightly bigger copy, back faces only, flat ink colour.
export const Inked = ({ geometry, color, ...p }: { geometry: THREE.BufferGeometry; color: string } & ThreeElements['group']) => (
  <group {...p}>
    <mesh geometry={geometry}><Toon color={color} /></mesh>
    <mesh geometry={geometry} scale={1 + LOOK.inkWidth}>
      <meshBasicMaterial color={LOOK.inkColor} side={THREE.BackSide} />
    </mesh>
  </group>
);

export const Sky = () => {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(LOOK.skyTop) }, bottom: { value: new THREE.Color(LOOK.skyHorizon) } },
    vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
    fragmentShader: 'uniform vec3 top; uniform vec3 bottom; varying vec3 p; void main(){ gl_FragColor = vec4(mix(bottom, top, smoothstep(0., .6, p.y)), 1.); }',
  }), []);
  return <mesh material={mat}><sphereGeometry args={[400, 32, 16]} /></mesh>;
};

export const Lights = () => (
  <>
    <hemisphereLight args={[LOOK.skyHorizon, LOOK.shadeColor, LOOK.shadeIntensity]} />
    <directionalLight color={LOOK.keyColor} intensity={LOOK.keyIntensity} position={[8, 14, 10]} />
  </>
);
