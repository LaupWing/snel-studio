import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

// Post pass ported from Open Design (proven in ~all toon-2d shots, harvest #3):
// depth-of-field gather (golden angle, 48 taps) + grade: cool blue-violet shadows, saturation +14%,
// soft highlight rolloff, vignette, sRGB encode, light grain, lifted black point (never pure black).
// Renders on every frame Remotion advances (useFrame priority 1 takes over the default render).
export type PostOpts = { focus: number; k?: number; max?: number; expo?: number; grain?: number };

const QV = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }';

export const Post = ({ focus, k = 18, max = 14, expo = 1.0, grain = 0.016 }: PostOpts) => {
  const { gl, scene, camera, size } = useThree();
  const W = Math.round(size.width * gl.getPixelRatio()), H = Math.round(size.height * gl.getPixelRatio());
  const p = useMemo(() => {
    const rtScene = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4, depthTexture: new THREE.DepthTexture(W, H) });
    rtScene.depthTexture!.type = THREE.UnsignedIntType;
    const rtC = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    const cam = camera as THREE.PerspectiveCamera;
    const coc = new THREE.ShaderMaterial({
      uniforms: { tCol: { value: rtScene.texture }, tDep: { value: rtScene.depthTexture }, uNear: { value: cam.near }, uFar: { value: cam.far } },
      vertexShader: QV,
      fragmentShader: `uniform sampler2D tCol; uniform sampler2D tDep; uniform float uNear, uFar; varying vec2 vUv;
        float lin(float d){ return uNear * uFar / (uFar - d * (uFar - uNear)); }
        void main(){ gl_FragColor = vec4(texture2D(tCol, vUv).rgb, lin(texture2D(tDep, vUv).x)); }`,
    });
    const post = new THREE.ShaderMaterial({
      uniforms: { tC: { value: rtC.texture }, uPx: { value: new THREE.Vector2(1 / W, 1 / H) }, uFocus: { value: focus }, uK: { value: k },
        uMax: { value: max * W / 1080 }, uTime: { value: 0 }, uExpo: { value: expo }, uGrain: { value: grain } },
      vertexShader: QV,
      fragmentShader: `uniform sampler2D tC; uniform vec2 uPx; uniform float uFocus, uK, uMax, uTime, uExpo, uGrain; varying vec2 vUv;
        float coc(float z){ return min(uMax, uK * abs(1.0 / uFocus - 1.0 / z)); }
        void main(){
          vec4 c0 = texture2D(tC, vUv); float cz = c0.a; float cc = coc(cz);
          vec3 sum = c0.rgb; float ws = 1.0;
          for (int i = 0; i < 48; i++) {
            float fi = float(i); float r = uMax * sqrt((fi + 0.5) / 48.0); float a = fi * 2.39996323;
            vec4 s = texture2D(tC, vUv + vec2(cos(a), sin(a)) * r * uPx);
            float cover = clamp(coc(s.a) - r + 1.0, 0.0, 1.0);
            float behind = step(cz * 1.04 + 0.002, s.a);
            float w = cover * mix(1.0, clamp(cc - r + 1.0, 0.0, 1.0), behind);
            sum += s.rgb * w; ws += w;
          }
          vec3 col = sum / ws * uExpo;
          float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
          float sh = 1.0 - smoothstep(0.02, 0.30, l);
          col = mix(col, col * vec3(0.82, 0.86, 1.24) + vec3(0.012, 0.008, 0.036), sh * 0.75);
          col = mix(vec3(l), col, 1.14);
          col = max(col, 0.0);
          vec3 over = max(col - 0.72, 0.0);
          col = min(col, 0.72) + over / (1.0 + over / 0.3);
          vec2 q = vUv - 0.5; col *= 1.0 - dot(q * vec2(1.1, 0.75), q * vec2(1.1, 0.75)) * 0.5;
          col = mix(col * 12.92, 1.055 * pow(col, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), col));
          float n = fract(sin(dot(gl_FragCoord.xy + uTime * 61.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
          col += n * uGrain;
          col = max(col, vec3(0.055, 0.045, 0.10));
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), coc); quad.frustumCulled = false;
    const qs = new THREE.Scene(); qs.add(quad);
    return { rtScene, rtC, coc, post, quad, qs, qc: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, [gl, camera, W, H]);
  useEffect(() => { p.post.uniforms.uFocus.value = focus; }, [p, focus]);
  useEffect(() => () => { p.rtScene.dispose(); p.rtC.dispose(); }, [p]);
  useFrame((state) => {
    gl.toneMapping = THREE.NoToneMapping;
    p.post.uniforms.uTime.value = state.clock.elapsedTime;
    gl.setRenderTarget(p.rtScene); gl.render(scene, camera);
    p.quad.material = p.coc; gl.setRenderTarget(p.rtC); gl.render(p.qs, p.qc);
    p.quad.material = p.post; gl.setRenderTarget(null); gl.render(p.qs, p.qc);
  }, 1);
  return null;
};
