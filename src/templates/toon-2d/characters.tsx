import { useEffect, useState } from 'react';
import { staticFile, delayRender, continueRender } from 'remotion';
import { MascotCard } from './Card';
// @ts-ignore plain js
import { MASCOT_ARMS } from './mascot2d.js';
// @ts-ignore plain js
import { drawSide } from './sidekit.js';
// @ts-ignore plain js
import { drawWojak } from './wojakbody.js';
import { LOOK } from './look';

// Every character is a flat lit card (Loc 2026-11-17: flat beats 3D), thick arms on all of them.
// Mascot: the approved drawing. Side: our own drawn people (suit/hoodie, faces smug/doomer/shock).
// useMemes: load BEFORE the ToonScene mounts (return null until ready): the canvas does not redraw on late state.
// Meme: a real wojak head (PNG from Expansion via public/memes, never in git) on a body drawn in its own style.
type V3 = [number, number, number];
export const ARMS = MASCOT_ARMS as Record<'down' | 'wave' | 'point' | 'up' | 'type' | 'cover' | 'head' | 'cuff', any>;
export const MEMES = ['wojak', 'npc-wojak', 'chad', 'doomer', 'soyjak', 'crying-wojak'] as const;
export type Meme = typeof MEMES[number];

export const useMemes = () => {
  const [imgs, set] = useState<Record<string, HTMLImageElement> | null>(null);
  const [h] = useState(() => delayRender('memes'));
  useEffect(() => {
    Promise.all(MEMES.map((n) => new Promise<[string, HTMLImageElement]>((ok) => { const i = new Image(); i.onload = () => ok([n, i]); i.onerror = () => ok([n, i]); i.src = staticFile(`memes/${n}.png`); })))
      .then((a) => set(Object.fromEntries(a)));
  }, []);
  // release the frame only after the cards that use the memes have committed and drawn (two animation frames),
  // otherwise a still can be captured before the meme characters exist
  useEffect(() => { if (imgs) requestAnimationFrame(() => requestAnimationFrame(() => continueRender(h))); }, [imgs, h]);
  return imgs;
};

export const Mascot = ({ pos, arms = 'down', height = 1.7 }: { pos: V3; arms?: keyof typeof ARMS; height?: number }) =>
  <MascotCard position={pos} height={height} arms={arms} self={LOOK.character.self} />;

export const Side = ({ pos, outfit = 'suit', face = 'smug', arms = 'down', tie = '#d8443c', mark, height = 1.75 }:
  { pos: V3; outfit?: 'suit' | 'hoodie' | 'police'; face?: 'smug' | 'doomer' | 'shock'; arms?: keyof typeof ARMS; tie?: string; mark?: string; height?: number }) =>
  <MascotCard position={pos} height={height} self={LOOK.character.self} drawKey={`side-${outfit}-${face}-${arms}-${tie}-${mark}`}
    draw={(g) => drawSide(g, { outfit, face, tie, arms: ARMS[arms], mark })} />;

export const MemeGuy = ({ pos, img, name, arms = 'down', legs, mark, height = 1.75 }:
  { pos: V3; img: HTMLImageElement; name: string; arms?: keyof typeof ARMS; legs?: string; mark?: string; height?: number }) =>
  <MascotCard position={pos} height={height} self={LOOK.character.self} drawKey={`meme-${name}-${arms}-${mark}`}
    draw={(g) => drawWojak(g, img, { arms: ARMS[arms], legs, mark })} />;
