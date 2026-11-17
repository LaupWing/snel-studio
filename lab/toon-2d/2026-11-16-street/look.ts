// The knobs of the toon-2d look. One place to change light, colour and camera feel.
// Values are first guesses; the style guide (references/toon-2d.md) will replace them with measured targets.
export const LOOK = {
  skyTop: '#5e93d9',
  skyHorizon: '#b8d0ec',
  fogNear: 25,
  fogFar: 300,
  keyColor: '#ffe2b8',
  keyIntensity: 2.4,
  shadeColor: '#5a5fa8', // cool blue-violet shade, never brown
  shadeIntensity: 1.1,
  inkColor: '#0b0a0c',
  inkWidth: 0.04, // world units, inverted-hull outline
  cameraPushPerFrame: 0.0025, // slow creep on every hold
};
