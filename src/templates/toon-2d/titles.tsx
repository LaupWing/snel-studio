import { useMemo } from 'react';
import * as THREE from 'three';
// @ts-ignore three example module
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
// @ts-ignore three example module
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import fontJson from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { LOOK } from './look';

// Hook titles: a big white 3D word that slams in (TextGeometry + crease ink; no hull, a hull scales badly on
// wide text) and a small tilted yellow sticker that pops under it.
type V3 = [number, number, number];
export const Title3D = ({ text, pos, size = 0.62, color = '#ffffff' }: { text: string; pos: V3; size?: number; color?: string }) => {
  const geo = useMemo(() => {
    const font = new FontLoader().parse(fontJson as any);
    const g = new TextGeometry(text, { font, size, depth: size * 0.45, curveSegments: 6, bevelEnabled: true, bevelThickness: size * 0.03, bevelSize: size * 0.024, bevelSegments: 2 });
    g.center(); return g;
  }, [text, size]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 30), [geo]);
  return (
    <group position={pos}>
      <mesh geometry={geo} castShadow><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.55} /></mesh>
      <lineSegments geometry={edges}><lineBasicMaterial color={LOOK.ink.color} /></lineSegments>
    </group>
  );
};

export const StickerTag = ({ text, pos, s = 1, tilt = -0.12, w = 0.9, bg = '#ffd23a' }: { text: string; pos: V3; s?: number; tilt?: number; w?: number; bg?: string }) => {
  const map = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 220; const g = c.getContext('2d')!;
    g.fillStyle = '#261a22'; g.beginPath(); g.roundRect(0, 0, 512, 220, 36); g.fill();
    g.fillStyle = bg; g.beginPath(); g.roundRect(12, 12, 488, 196, 28); g.fill();
    g.fillStyle = '#261a22'; let fs = 150; g.font = `900 ${fs}px "Arial Black", Arial, sans-serif`;
    while (g.measureText(text).width > 450) { fs -= 6; g.font = `900 ${fs}px "Arial Black", Arial, sans-serif`; }
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 118);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [text, bg]);
  return <mesh position={pos} rotation={[0, 0, tilt]} scale={s}><planeGeometry args={[w, w * 0.43]} /><meshBasicMaterial map={map} transparent /></mesh>;
};
