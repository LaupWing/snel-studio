import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { useThree } from '@react-three/fiber';
import { ToonScene } from './Scene';
import { House, Barrel, Plant, Lamp, Ground } from './props';
import { Box } from './World';
import { Mascot, Side, MemeGuy, useMemes } from './characters';
import type { InkMode } from './look';

// Template check: the lab street (test 11) built ONLY from template pieces. If this still matches the lab, the
// template holds. mode 'close' = close-up camera.
const Camera = ({ mode }: { mode: string }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); const cam = useThree((s) => s.camera);
  const t = interpolate(f, [0, durationInFrames - 1], [0, 1], { easing: Easing.bezier(0.45, 0, 0.55, 1) });
  if (mode === 'close') { cam.position.set(1.6 - t * 0.5, 1.9 - t * 0.2, 3.4 - t * 0.6); cam.lookAt(0, 1.15, 0); }
  else { cam.position.set(4.6 - t * 1.2, 5.4 - t * 0.6, 9.0 - t * 1.4); cam.lookAt(0.2, 1.7, -2.4); }
  cam.updateProjectionMatrix(); return null;
};

export const ToonDemo = ({ mode = 'full', ink = 'props' }: { mode?: 'full' | 'close'; ink?: InkMode }) => {
  const m = useMemes();
  if (!m) return null;   // mount the canvas only once the memes are loaded (Remotion's canvas does not redraw on a late state change)
  return (
    <ToonScene focusOn={[0, 1.2, 0]} ink={ink}>
      <Camera mode={mode} />
      <Ground />
      <House x={-3.6} h={4.2} wall="#ffffff" kind="plaster" door="#3f6fb0" />
      <House x={0} h={5} wall="#b5603f" kind="brick" />
      <House x={3.6} h={3.8} wall="#5b8fcc" kind="planks" roof="#40587e" door="#f3ead6" />
      <Lamp pos={[-1.9, 0, -3.8]} /><Lamp pos={[2.8, 0, -3.4]} />
      <Barrel pos={[2.2, 0.5, -3.9]} /><Barrel pos={[-3.2, 0.5, -3.0]} />
      <Plant pos={[1.4, 0, -4.2]} /><Plant pos={[-3.2, 0, -4.4]} /><Plant pos={[2.7, 0, 4.2]} />
      <Box size={[1.3, 1.1, 1.1]} pos={[3.4, 0.55, 3.6]} color="#4a7fc0" role="prop" />
      <Box size={[0.7, 0.5, 0.5]} pos={[0.85, 0.25, 0.2]} color="#e8a23a" role="hero" />
      <Mascot pos={[0, 0, 0]} arms="wave" />
      <Side pos={[-1.5, 0, -0.9]} outfit="suit" face="smug" arms="point" />
      <Side pos={[0.9, 0, -0.6]} outfit="hoodie" face="shock" arms="up" />
      <>
        <MemeGuy pos={[1.9, 0, -1.3]} img={m.doomer} name="doomer" legs="#2a2a30" />
        <MemeGuy pos={[-0.4, 0, -2.4]} img={m.wojak} name="wojak" arms="up" mark="!" />
        <MemeGuy pos={[2.6, 0, -3.2]} img={m['npc-wojak']} name="npc" legs="#6a6a6a" />
        <MemeGuy pos={[-2.4, 0, -1.6]} img={m.chad} name="chad" legs="#30364a" />
      </>
    </ToonScene>
  );
};
