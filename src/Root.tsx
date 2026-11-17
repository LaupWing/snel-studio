import { Composition } from 'remotion';
import { ToonDemo } from './templates/toon-2d/Demo';
import { ToonCatalog } from './templates/toon-2d/Catalog';
import { LabStreet } from '../lab/toon-2d/2026-11-16-street/LabStreet';
import { LabStyleGuide } from '../lab/toon-2d/2026-11-16-style-guide/LabStyleGuide';
import { LabOdPost } from '../lab/toon-2d/2026-11-16-od-post/LabOdPost';
import { LabPalette } from '../lab/toon-2d/2026-11-16-palette/LabPalette';
import { LabWojakBody } from '../lab/toon-2d/2026-11-17-wojak-body/LabWojakBody';
import { LabMemeFocusInk } from '../lab/toon-2d/2026-11-17-meme-focus-ink/LabMemeFocusInk';
import { LabSideChars } from '../lab/toon-2d/2026-11-17-side-chars/LabSideChars';
import { LabMascot3DTest } from '../lab/toon-2d/2026-11-17-mascot-3d/LabMascot3D';
import { LabSetLight } from '../lab/toon-2d/2026-11-17-set-light/LabSetLight';
import { LabInkSplit } from '../lab/toon-2d/2026-11-17-ink-split/LabInkSplit';
import { LabJensenFace } from '../lab/toon-2d/2026-11-17-jensen-face/LabJensenFace';
import { LabMascotLight } from '../lab/toon-2d/2026-11-16-mascot-light/LabMascotLight';

// Videos live next to their script (writing repo) and are linked in as src/videos/<slug> -> .../<slug>/scenes
// (gitignored). Each one exports `compositions` from index.tsx; a fresh clone simply has none.
declare const require: any;
const ctx = require.context('./videos', true, /^\.\/[^/]+\/index\.tsx$/);
const VIDEOS: any[] = ctx.keys().flatMap((k: string) => ctx(k).compositions ?? []);

const C = { width: 1080, height: 1920, fps: 30, durationInFrames: 90 };
export const Root = () => (
  <>
    <Composition id="ToonCatalog" component={ToonCatalog} width={1920} height={1080} fps={30} durationInFrames={1} />
    <Composition id="LabJensenFace" component={LabJensenFace} width={2000} height={1650} fps={30} durationInFrames={1} />
    {VIDEOS.map((c) => <Composition key={c.id} {...c} />)}
    <Composition id="ToonDemo" component={ToonDemo} {...C} defaultProps={{ mode: 'full' as const, ink: 'props' as const }} />
    <Composition id="LabStreet" component={LabStreet} {...C} />
    <Composition id="LabStyleGuide" component={LabStyleGuide} {...C} />
    <Composition id="LabOdPost" component={LabOdPost} {...C} />
    <Composition id="LabPalette" component={LabPalette} {...C} />
    <Composition id="LabMascotLight" component={LabMascotLight} {...C} defaultProps={{ mode: 'full' as const }} />
    <Composition id="LabWojakBody" component={LabWojakBody} {...C} defaultProps={{ mode: 'full' as const, ink: 'none' as const }} />
    <Composition id="LabMemeFocusInk" component={LabMemeFocusInk} {...C} defaultProps={{ mode: 'full' as const, ink: 'none' as const }} />
    <Composition id="LabSideChars" component={LabSideChars} {...C} defaultProps={{ mode: 'full' as const }} />
    <Composition id="LabMascot3D" component={LabMascot3DTest} {...C} defaultProps={{ mode: 'full' as const }} />
    <Composition id="LabSetLight" component={LabSetLight} {...C} defaultProps={{ mode: 'full' as const }} />
    <Composition id="LabInkSplit" component={LabInkSplit} {...C} defaultProps={{ mode: 'full' as const }} />
  </>
);
