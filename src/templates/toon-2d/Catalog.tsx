import { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { ToonScene } from './Scene';
import { House, Barrel, Plant, Lamp, Ground } from './props';
import { Box } from './World';
import { Mascot, Side, MemeGuy, useMemes, MEMES } from './characters';

// Catalog: every building block of the toon-2d kit in one frame, labelled, no depth blur. Re-render when the kit
// changes: `npx remotion still src/index.ts ToonCatalog out/catalog/toon-2d.png --gl=angle`.
type V3 = [number, number, number];
const Label = ({ pos, text }: { pos: V3; text: string }) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 96; const g = c.getContext('2d')!;
    g.fillStyle = 'rgba(20,16,30,0.78)'; g.beginPath(); g.roundRect(4, 8, 504, 80, 24); g.fill();
    g.fillStyle = '#ffffff'; g.font = '600 44px Helvetica, Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 50);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [text]);
  const cam = useThree((s) => s.camera);
  const yaw = Math.atan2(cam.position.x - pos[0], cam.position.z - pos[2]);
  return <mesh position={pos} rotation={[-0.45, yaw, 0]}><planeGeometry args={[1.5, 0.28]} /><meshBasicMaterial map={tex} transparent toneMapped={false} fog={false} /></mesh>;
};
const Cam = () => { const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera; cam.fov = 30; cam.position.set(0, 9.5, 15.5); cam.lookAt(0, 0.9, -3.2); cam.updateProjectionMatrix(); return null; };
const row = (n: number, gap: number) => Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * gap);

export const ToonCatalog = () => {
  const m = useMemes();
  if (!m) return null;
  const poses = ['down', 'wave', 'point', 'up', 'type'] as const;
  const sides = [['suit', 'smug'], ['suit', 'doomer'], ['suit', 'shock'], ['hoodie', 'smug'], ['hoodie', 'doomer'], ['hoodie', 'shock']] as const;
  return (
    <ToonScene focusOn={[0, 1, 0]} ink="props" post={{ k: 0 }}>
      <Cam />
      <Ground />
      {/* set: houses (plain 3D, inked only with ink = all) */}
      <House x={-4.2} z={-13.5} h={4.2} wall="#ffffff" kind="plaster" door="#3f6fb0" />
      <House x={0} z={-13.5} h={5} wall="#b5603f" kind="brick" />
      <House x={4.2} z={-13.5} h={3.8} wall="#5b8fcc" kind="planks" roof="#40587e" door="#f3ead6" />
      {[['plaster house', -4.2], ['brick house', 0], ['plank house', 4.2]].map(([t, x]) => <Label key={t as string} text={t as string} pos={[x as number, 0.2, -11.7]} />)}
      {/* props */}
      {row(5, 2).map((x, i) => [
        <Barrel pos={[x, 0.5, -8.4]} />, <Plant pos={[x, 0, -8.4]} />, <Lamp pos={[x, 0, -8.4]} />,
        <Box size={[1.1, 0.9, 0.9]} pos={[x, 0.45, -7]} color="#4a7fc0" role="prop" />,
        <Box size={[0.8, 0.6, 0.6]} pos={[x, 0.3, -7]} color="#e8a23a" role="hero" />,
      ][i]).map((el, i) => <group key={'p' + i}>{el}</group>)}
      {row(5, 2).map((x, i) => <Label key={'pl' + i} text={['barrel (prop)', 'plant (prop)', 'lamp (metal)', 'crate (prop)', 'crate (hero)'][i]} pos={[x, 0.15, -7.1]} />)}
      {/* mascot poses */}
      {row(5, 1.9).map((x, i) => <group key={'m' + i}><Mascot pos={[x, 0, -3.8]} arms={poses[i]} /><Label text={`mascot ${poses[i]}`} pos={[x, 0.12, -3.0]} /></group>)}
      {/* own side characters */}
      {row(6, 1.7).map((x, i) => <group key={'s' + i}><Side pos={[x, 0, -0.6]} outfit={sides[i][0]} face={sides[i][1]} /><Label text={`${sides[i][0]} ${sides[i][1]}`} pos={[x, 0.12, 0.2]} /></group>)}
      {/* memes with matching bodies */}
      {row(MEMES.length, 1.7).map((x, i) => <group key={'w' + i}><MemeGuy pos={[x, 0, 2.6]} img={m[MEMES[i]]} name={MEMES[i]} /><Label text={MEMES[i]} pos={[x, 0.12, 3.4]} /></group>)}
    </ToonScene>
  );
};
