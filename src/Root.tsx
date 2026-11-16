import { Composition } from 'remotion';
import { LabStreet } from '../lab/2026-11-16-street/LabStreet';

export const Root = () => (
  <Composition id="LabStreet" component={LabStreet} width={1080} height={1920} fps={30} durationInFrames={90} />
);
