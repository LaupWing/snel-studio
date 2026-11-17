// The knobs of the toon-2d look, measured against Ricks in the lab (lab/toon-2d/README.md, tests 3-11).
// One place to change light, colour, ink and post. Defaults = what the lab proved; a reel overrides per set.
export const LOOK = {
  sky: { top: '#2f5fc8', horizon: '#b8cdea' },
  fog: { near: 20, far: 120 },
  key: { color: '#fff1dc', intensity: 2.9, position: [-6, 8, 5] as [number, number, number] },
  hemi: { sky: '#8c7bb8', ground: '#5a4a52', intensity: 1.0 },
  rim: { color: '#ffb070', intensity: 0.8, position: [4, 5, -8] as [number, number, number] },
  ink: { color: '#261a22', set: 0.035, prop: 0.05, hero: 0.10 },   // inverted hull, fraction of the object size
  post: { k: 30, max: 14, sat: 0.95, knee: 0.92 },                  // DOF strength + grade (test 4)
  character: { self: 0.8 },                                         // cards light themselves (test 5)
  camera: { fov: 40, near: 0.1, far: 500 },
};
export type Look = typeof LOOK;
// A mood = a partial override per group (e.g. night: darker sky, low key, a spotlight added by the set).
export type Mood = { [K in keyof Look]?: Partial<Look[K]> };
export const withMood = (m: Mood = {}): Look => Object.fromEntries(Object.entries(LOOK).map(([k, v]) => [k, { ...v, ...(m as any)[k] }])) as Look;
// Which objects get ink, per reel or per set (scan 2026-11-17: characters always; story props usually, often several;
// the whole set in ~4 of 17 videos). Characters are always inked, they are drawn.
export type InkMode = 'none' | 'props' | 'all';
