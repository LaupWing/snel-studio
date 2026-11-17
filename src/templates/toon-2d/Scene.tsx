import { useMemo, type ReactNode } from 'react';
import * as THREE from 'three';
import { ThreeCanvas } from '@remotion/three';
import { useVideoConfig } from 'remotion';
import { LOOK, withMood, type InkMode, type Mood } from './look';
import { InkCtx, LookCtx, Sky, Lights } from './World';
import { Post } from './Post';

// The toon-2d frame: canvas, sky, fog, lights, ink mode and the post pass. A set only adds its camera + objects.
// focusOn = the main character's position (focus follows it in every camera move).
// post: override the post knobs (e.g. { k: 0 } = no depth blur, for the catalog).
// mood: the reel's override of light/sky/fog (night, indoor); the rest of the look stays the template's.
export const ToonScene = ({ children, focusOn, ink = 'props', post, mood }: { children: ReactNode; focusOn: [number, number, number]; ink?: InkMode; post?: Partial<typeof LOOK.post>; mood?: Mood }) => {
  const L = useMemo(() => withMood(mood), [JSON.stringify(mood)]); const P = { ...L.post, ...post };
  const { width, height } = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows camera={L.camera} gl={{ antialias: true, preserveDrawingBuffer: true }}
      onCreated={({ scene, gl }) => { scene.fog = new THREE.Fog(L.sky.horizon, L.fog.near, L.fog.far); gl.toneMapping = THREE.NoToneMapping; }}>
      <LookCtx.Provider value={L}><InkCtx.Provider value={ink}>
        <Sky />
        <Lights />
        {children}
      </InkCtx.Provider></LookCtx.Provider>
      <Post focusOn={focusOn} focus={10} k={P.k} max={P.max} sat={P.sat} knee={P.knee} />
    </ThreeCanvas>
  );
};
