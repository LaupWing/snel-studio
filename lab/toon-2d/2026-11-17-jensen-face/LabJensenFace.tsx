import { useEffect, useRef, useState } from 'react';
import { delayRender, continueRender } from 'remotion';
import { ARMS } from '../../../src/templates/toon-2d/characters';
// @ts-ignore plain js
import { drawJensen } from '../../../src/templates/toon-2d/people/jensen.js';

// Check sheet: the traced Jensen drawing (grin + shock) on plain paper, to hold next to the photo.
export const LabJensenFace = () => {
  const a = useRef<HTMLCanvasElement>(null), b = useRef<HTMLCanvasElement>(null);
  const [h] = useState(() => delayRender('face'));
  useEffect(() => {
    drawJensen(a.current!.getContext('2d'), { arms: ARMS.down, face: 'grin' });
    drawJensen(b.current!.getContext('2d'), { arms: ARMS.down, face: 'shock', kiss: 1 });
    continueRender(h);
  }, [h]);
  return <div style={{ display: 'flex', background: '#efe9f6', width: '100%', height: '100%' }}>
    <canvas ref={a} width={1000} height={1650} style={{ width: 1000, height: 1650 }} />
    <canvas ref={b} width={1000} height={1650} style={{ width: 1000, height: 1650 }} />
  </div>;
};
