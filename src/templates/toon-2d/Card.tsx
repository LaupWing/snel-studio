import { useMemo } from 'react';
import type { ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';
// @ts-ignore plain js, the approved drawing
import { drawMascot2D, MASCOT_ARMS } from './mascot2d.js';

// Our mascot as a flat card standing in the 3D world, lit by the scene light.
export const MascotCard = ({ height = 1.8, arms = 'down', ...p }: { height?: number; arms?: string } & ThreeElements['group']) => {
  const tex = useMemo(() => {
    const S = 0.5, c = document.createElement('canvas'); c.width = 1000 * S; c.height = 1650 * S;
    const g = c.getContext('2d')!; g.setTransform(S, 0, 0, S, 0, 0);
    drawMascot2D(g, { arms: (MASCOT_ARMS as any)[arms], legs: true });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [arms]);
  const w = height * 1000 / 1650;
  return (
    <group {...p}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[w, height]} />
        <meshLambertMaterial map={tex} transparent alphaTest={0.5} />
      </mesh>
    </group>
  );
};
