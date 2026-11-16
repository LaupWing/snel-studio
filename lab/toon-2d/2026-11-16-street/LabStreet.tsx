import { useMemo } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { useThree } from '@react-three/fiber';
import { LOOK } from '../../../src/templates/toon-2d/look';
import { Sky, Lights, Inked, Toon } from '../../../src/templates/toon-2d/World';
import { MascotCard } from '../../../src/templates/toon-2d/Card';

// Lab test: a small street, front-on, mascot in the middle, slow push-in.
const House = ({ x, h, color }: { x: number; h: number; color: string }) => {
  const body = useMemo(() => new THREE.BoxGeometry(3.2, h, 3), [h]);
  const roof = useMemo(() => { const g = new THREE.ConeGeometry(2.6, 1.6, 4); g.rotateY(Math.PI / 4); return g; }, []);
  return (
    <group position={[x, 0, -6]}>
      <Inked geometry={body} color={color} position={[0, h / 2, 0]} />
      <Inked geometry={roof} color="#b5523b" position={[0, h + 0.8, 0]} />
    </group>
  );
};

const Camera = () => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); const cam = useThree((s) => s.camera);
  const t = interpolate(f, [0, durationInFrames - 1], [0, 1], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
  cam.position.set(0, 1.6, 12 - t * 3); cam.lookAt(0, 1.6, -2); cam.updateProjectionMatrix();
  return null;
};

export const LabStreet = () => {
  const { width, height } = useVideoConfig();
  const ground = useMemo(() => new THREE.PlaneGeometry(200, 200), []);
  return (
    <ThreeCanvas width={width} height={height} camera={{ fov: 40, near: 0.1, far: 500 }} gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ scene }) => { scene.fog = new THREE.Fog(LOOK.skyHorizon, LOOK.fogNear, LOOK.fogFar); }}>
      <Camera />
      <Sky />
      <Lights />
      <mesh geometry={ground} rotation={[-Math.PI / 2, 0, 0]}><Toon color="#7cbf5a" /></mesh>
      <House x={-3.6} h={4.2} color="#e8d6b0" />
      <House x={0} h={5} color="#c9785a" />
      <House x={3.6} h={3.8} color="#e2b04a" />
      <MascotCard position={[0, 0, 0]} arms="wave" />
    </ThreeCanvas>
  );
};
