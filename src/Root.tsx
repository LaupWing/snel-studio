import { Composition } from 'remotion';
import { LabStreet } from '../lab/toon-2d/2026-11-16-street/LabStreet';
import { LabStyleGuide } from '../lab/toon-2d/2026-11-16-style-guide/LabStyleGuide';
import { LabOdPost } from '../lab/toon-2d/2026-11-16-od-post/LabOdPost';

const C = { width: 1080, height: 1920, fps: 30, durationInFrames: 90 };
export const Root = () => (
  <>
    <Composition id="LabStreet" component={LabStreet} {...C} />
    <Composition id="LabStyleGuide" component={LabStyleGuide} {...C} />
    <Composition id="LabOdPost" component={LabOdPost} {...C} />
  </>
);
