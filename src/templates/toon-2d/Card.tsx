import { useMemo } from 'react';
import * as THREE from 'three';
import { useThree, type ThreeElements } from '@react-three/fiber';
// @ts-ignore plain js, the approved drawing
import { drawMascot2D, MASCOT_ARMS } from './mascot2d.js';

// Our mascot as a flat card in the 3D world (pattern from Open Design makeCard/poseCard, harvest #8):
// lit by the scene light with a violet emissive floor (never flat), casts a real shadow, blob contact shadow,
// always turned to the camera. The drawing itself is the approved mascot2d.js, never redrawn.
// self (0..1): how much the drawing lights itself, like Ricks' characters (always the brightest thing in frame).
// Not set = the old lit-by-scene card (test 3/4). 1 = the flat drawing, no scene light at all.
const BLOB = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c);
})();

export const MascotCard = ({ height = 1.8, arms = 'down', position = [0, 0, 0] as [number, number, number], self, ...p }:
  { height?: number; arms?: string; position?: [number, number, number]; self?: number } & Omit<ThreeElements['group'], 'position'>) => {
  const camera = useThree((s) => s.camera);
  const { mat, depth } = useMemo(() => {
    const S = 0.6, c = document.createElement('canvas'); c.width = 1000 * S; c.height = 1650 * S;
    const g = c.getContext('2d')!; g.setTransform(S, 0, 0, S, 0, 0);
    drawMascot2D(g, { arms: (MASCOT_ARMS as any)[arms], legs: true });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    return {
      mat: self === undefined
        ? new THREE.MeshLambertMaterial({ map: t, emissiveMap: t, emissive: new THREE.Color('#4a3c6a'), color: new THREE.Color(0.95, 0.95, 0.95), transparent: true, alphaTest: 0.04 })
        : new THREE.MeshLambertMaterial({ map: t, emissiveMap: t, emissive: new THREE.Color('#ffffff'), emissiveIntensity: self, color: new THREE.Color(1 - self, 1 - self, 1 - self), transparent: true, alphaTest: 0.04 }),
      depth: new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: t, alphaTest: 0.5 }),
    };
  }, [arms, self]);
  const w = height * 1000 / 1650;
  const yaw = Math.atan2(camera.position.x - position[0], camera.position.z - position[2]);
  return (
    <group position={position} {...p}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.06, 0.008, -0.04]} renderOrder={2}>
        <planeGeometry args={[w * 1.1, 0.34]} />
        <meshBasicMaterial map={BLOB} color="#2a1c52" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh position={[0, height / 2, 0]} rotation={[0, yaw, 0]} castShadow material={mat} customDepthMaterial={depth} renderOrder={3}>
        <planeGeometry args={[w, height]} />
      </mesh>
    </group>
  );
};
