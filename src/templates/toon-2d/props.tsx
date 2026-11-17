import { useMemo } from 'react';
import * as THREE from 'three';
import { Box, Solid, Set3D, type Role } from './World';
import { paint } from './paint';

// Building blocks for a street set (from lab tests 2-11). Houses are set, small things are props.
type V3 = [number, number, number];
const Window = ({ pos }: { pos: V3 }) => (
  <group position={pos}>
    <Box size={[0.8, 1.0, 0.08]} pos={[0, 0, 0]} color="#ffffff" />
    <Box size={[0.62, 0.82, 0.06]} pos={[0, 0, 0.03]} color="#2c4f8a" />
    <Box size={[0.06, 0.82, 0.08]} pos={[0, 0, 0.05]} color="#ffffff" />
    <Box size={[0.62, 0.06, 0.08]} pos={[0, 0, 0.05]} color="#ffffff" />
  </group>
);

export const House = ({ x, z = -6, h, wall, kind, roof = '#b5523b', door = '#6d4f51' }:
  { x: number; z?: number; h: number; wall: string; kind: 'planks' | 'brick' | 'plaster'; roof?: string; door?: string }) => {
  const wallTex = useMemo(() => paint(kind, wall, Math.round(x * 10 + 50)), [kind, wall, x]);
  const rt = useMemo(() => { const t = paint('tiles', roof, 11); t.repeat.set(3, 2); t.needsUpdate = true; return t; }, [roof]);
  const doorTex = useMemo(() => paint('planks', door, 3), [door]);
  const cone = useMemo(() => { const g = new THREE.ConeGeometry(2.75, 1.7, 4); g.rotateY(Math.PI / 4); return g; }, []);
  return (
    <group position={[x, 0, z]}>
      <Box size={[3.2, h, 3]} pos={[0, h / 2, 0]} map={wallTex} rep={[2, h / 2]} />
      <Box size={[3.5, 0.18, 3.3]} pos={[0, h + 0.05, 0]} color="#ffffff" />
      <Solid geo={cone} map={rt} position={[0, h + 0.95, 0]} />
      <Box size={[0.9, 1.7, 0.1]} pos={[0.6, 0.85, 1.52]} map={doorTex} rep={[1, 2]} />
      <Window pos={[-0.8, 1.6, 1.52]} />
      <Window pos={[-0.8, h - 1.1, 1.52]} />
      <Window pos={[0.7, h - 1.1, 1.52]} />
      <Box size={[3.3, 0.35, 3.1]} pos={[0, 0.17, 0]} color="#8a8a96" />
    </group>
  );
};

export const Barrel = ({ pos, s = 1, role = 'prop' }: { pos: V3; s?: number; role?: Role }) => {
  const geo = useMemo(() => new THREE.CylinderGeometry(0.42 * s, 0.38 * s, 1.0 * s, 16), [s]);
  const tex = useMemo(() => paint('planks', '#8f542c', 5), []);
  return <Solid geo={geo} map={tex} role={role} position={pos} />;
};

export const Plant = ({ pos, role = 'prop' }: { pos: V3; role?: Role }) => {
  const pot = useMemo(() => new THREE.CylinderGeometry(0.3, 0.22, 0.45, 12), []);
  const bush = useMemo(() => new THREE.IcosahedronGeometry(0.5, 1), []);
  return <group position={pos}>
    <Solid geo={pot} color="#c9785a" role={role} position={[0, 0.22, 0]} />
    <Solid geo={bush} color="#70aa79" role={role} position={[0, 0.8, 0]} />
  </group>;
};

export const Lamp = ({ pos }: { pos: V3 }) => (                       // metal: plain 3D, never inked
  <group position={pos}>
    <mesh position={[0, 1.6, 0]} castShadow><cylinderGeometry args={[0.06, 0.07, 3.2, 12]} /><Set3D color="#3a3d48" metal={0.8} /></mesh>
    <mesh position={[0, 3.35, 0]}><sphereGeometry args={[0.22, 16, 12]} /><meshStandardMaterial color="#ffc870" emissive="#ffc870" emissiveIntensity={2} toneMapped={false} /></mesh>
  </group>
);

export const Ground = ({ color = '#c4c3c0' }: { color?: string }) => {
  const tex = useMemo(() => { const t = paint('cobble', color, 9); t.repeat.set(110, 110); return t; }, [color]);
  return <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[200, 200]} /><Set3D map={tex} /></mesh>;
};
