import { Composition } from 'remotion';
import { LabStreet } from '../lab/toon-2d/2026-11-16-street/LabStreet';
import { LabStyleGuide } from '../lab/toon-2d/2026-11-16-style-guide/LabStyleGuide';

export const Root = () => (
  <>
    <Composition id="LabStreet" component={LabStreet} width={1080} height={1920} fps={30} durationInFrames={90} />
    <Composition id="LabStyleGuide" component={LabStyleGuide} width={1080} height={1920} fps={30} durationInFrames={90} />
  </>
);
