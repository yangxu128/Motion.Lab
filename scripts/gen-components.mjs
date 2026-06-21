import fs from 'fs';
import path from 'path';

const EFFECTS_DIR = path.join(process.cwd(), 'components/effects');

const pascal = (id) => {
  const name = id.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('');
  return /^[0-9]/.test(name) ? '_' + name : name;
};

// Split CSS content into properties (inside class) and at-rules/nested selectors (top level)
function splitCss(cssContent, className) {
  const lines = cssContent.split('\n').map(l => l.trim()).filter(l => l);
  const props = [];
  const top = [];
  for (const line of lines) {
    if (line.startsWith('@') || line.startsWith('.') || line.startsWith('&')) {
      top.push(line);
    } else {
      props.push(line);
    }
  }
  return { props, top };
}

function genCssBasic(className, cssContent) {
  const { props, top } = splitCss(cssContent, className);
  let css = `.box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 32px 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%));
  color: hsl(0 0% 100%);
  font-size: 28px;
  font-weight: 800;
  font-family: var(--font-display);
  letter-spacing: -0.02em;
  box-shadow: 0 8px 24px hsl(280 40% 30% / 0.3);
}
.${className} {
${props.map(p => '  ' + p).join('\n')}
}`;
  if (top.length > 0) css += '\n' + top.join('\n');
  return css;
}

function genCssText(className, cssContent) {
  const { props, top } = splitCss(cssContent, className);
  let css = `.panel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 32px;
  border-radius: 12px;
  background: linear-gradient(135deg, hsl(250 60% 12%), hsl(280 50% 15%));
  overflow: hidden;
}
.${className} {
  font-size: 64px;
  font-weight: 900;
  font-family: var(--font-display);
  letter-spacing: -0.02em;
  margin: 0;
  position: relative;
${props.map(p => '  ' + p).join('\n')}
}`;
  if (top.length > 0) css += '\n' + top.join('\n');
  return css;
}

function genCssCanvas() {
  return `.canvas {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 12px;
}`;
}

// ============= COMPONENT TEMPLATES (using bracket notation) =============

function tplCssBasic(id, className, paramsDef, content, cssVars) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  const styleVars = cssVars.length > 0
    ? ` style={{ ${cssVars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}`
    : '';
  return `'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['${className}']}${styleVars}>${content}</div>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplCssText(id, className, paramsDef, content, cssVars, extraAttrs = '') {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  const styleVars = cssVars.length > 0
    ? ` style={{ ${cssVars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}${extraAttrs}`
    : extraAttrs;
  return `'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['${className}']}${styleVars}>${content}</h1>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplCssTextData(id, className, paramsDef, content, cssVars) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  return `'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
const TEXT = '${content}';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['${className}']} data-text={TEXT} style={{ ${cssVars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}>{TEXT}</h1>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplCssChars(id, className, paramsDef, text, cssVars, delayStep) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  const styleVars = cssVars.length > 0
    ? ` style={{ ${cssVars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}`
    : '';
  return `'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
const TEXT = '${text}';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['${className}']}${styleVars}>
          {[...TEXT].map((ch, i) => (
            <span key={i} style={{ animationDelay: \`${delayStep}s * \${i}\` }}>{ch}</span>
          ))}
        </h1>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplCssWords(id, className, paramsDef, words, cssVars) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  return `'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
const WORDS = ${JSON.stringify(words)};
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['${className}']} style={{ ${cssVars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}>
          {WORDS.map((w, i) => <span key={i}>{w}</span>)}
        </h1>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplTypewriter(id, className, paramsDef, text, multi = false) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  if (multi) {
    return `'use client';
import { useEffect, useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
const LINES = ${JSON.stringify(text)};
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let li = 0, ci = 0, del = false;
    setOut('');
    const id = setInterval(() => {
      const t = LINES[li];
      ci += del ? -1 : 1;
      setOut(t.slice(0, ci));
      if (!del && ci >= t.length) { del = true; }
      else if (del && ci <= 0) { del = false; li = (li + 1) % LINES.length; }
    }, params.speed);
    return () => clearInterval(id);
  }, [params.speed]);
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <span className={styles['${className}']}>{out}</span>
      </div>
    </PreviewFrame>
  );
}
`;
  }
  return `'use client';
import { useEffect, useState } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
const TEXT = '${text}';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0;
    setOut('');
    const id = setInterval(() => {
      i++;
      setOut(TEXT.slice(0, i));
      if (i >= TEXT.length) { i = 0; setOut(''); }
    }, params.speed);
    return () => clearInterval(id);
  }, [params.speed]);
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <span className={styles['${className}']}>{out}</span>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplCanvas(id, paramsDef, logicFn) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  const depList = paramsDef.map(p => `params.${p.key}`).join(', ');
  return `'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      c.width = Math.floor(c.offsetWidth * dpr);
      c.height = Math.floor(c.offsetHeight * dpr);
    };
    resize();
    window.addEventListener('resize', resize);
    let raf = 0;
${logicFn}
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [${depList}]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
`;
}

function tplThree(id, paramsDef, setupFn, animFn) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  const depList = paramsDef.map(p => `params.${p.key}`).join(', ');
  return `'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;
${setupFn}
    const resize = () => {
      const w = c.offsetWidth, h = c.offsetHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);
    let raf = 0;
    const tick = () => {
${animFn}
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [${depList}]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
`;
}

function tplWebgl(id, paramsDef, fragShader) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  const depList = paramsDef.map(p => `params.${p.key}`).join(', ');
  return `'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
const VERT = \`attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }\`;
const FRAG = \`${fragShader}\`;
function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { gl.deleteShader(sh); return null; }
  return sh;
}
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const gl = c.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(c.offsetWidth * dpr);
      c.height = Math.floor(c.offsetHeight * dpr);
      gl.viewport(0, 0, c.width, c.height);
    };
    resize();
    window.addEventListener('resize', resize);
    const start = performance.now();
    let raf = 0;
    const render = () => {
      const t = ((performance.now() - start) / 1000) * params.speed;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, c.width, c.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [${depList}]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
`;
}

function tplGsap(id, paramsDef, gsapLogic, content) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  const depList = paramsDef.map(p => `params.${p.key}`).join(', ');
  return `'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    let tl: any = null;
    (async () => {
      const gsapMod = await import('gsap');
      if (cancelled || !ref.current) return;
      const gsap = gsapMod.default;
${gsapLogic}
    })();
    return () => {
      cancelled = true;
      if (tl) tl.kill();
    };
  }, [${depList}]);
  return (
    <PreviewFrame>
      <div ref={ref} className={styles.container}>
        ${content}
      </div>
    </PreviewFrame>
  );
}
`;
}

// ============= INTERACTION TEMPLATES =============

function tplHover(id, className, paramsDef, innerHtml, cssVars, hint) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  const styleVars = cssVars.length > 0
    ? ` style={{ ${cssVars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}`
    : '';
  return `'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['${className}']}${styleVars}>${innerHtml}</div>
        <span className={styles.hint}>${hint}</span>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplClick(id, className, paramsDef, content, clickLogic, hint) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  return `'use client';
import { MouseEvent, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
${clickLogic}
  };
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['${className}']} onClick={handleClick} style={{ ['--duration' as any]: \`\${params.duration}s\` }}>${content}</div>
        <span className={styles.hint}>${hint}</span>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplClickCount(id, className, paramsDef, content, clickLogic, hint) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  return `'use client';
import { MouseEvent, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
${clickLogic}
  };
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['${className}']} onClick={handleClick}>${content}</div>
        <span className={styles.hint}>${hint}</span>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplDrag(id, className, paramsDef, innerHtml, dragLogic, hint) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  return `'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
${dragLogic}
    return () => {
      cleanup();
    };
  }, [${paramsDef.map(p => `params.${p.key}`).join(', ')}]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['${className}']}>${innerHtml}</div>
        <span className={styles.hint}>${hint}</span>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplScroll(id, className, paramsDef, innerHtml, scrollLogic, hint) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  return `'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
${scrollLogic}
    return () => {
      cleanup();
    };
  }, [${paramsDef.map(p => `params.${p.key}`).join(', ')}]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['${className}']}>${innerHtml}</div>
        <span className={styles.hint}>${hint}</span>
      </div>
    </PreviewFrame>
  );
}
`;
}

function tplMouseMove(id, className, paramsDef, innerHtml, mouseLogic, hint) {
  const paramType = `{ ${paramsDef.map(p => `${p.key}: number`).join('; ')} }`;
  return `'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './${id}.module.css';
export default function ${pascal(id)}({ params }: { params: ${paramType} }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
${mouseLogic}
    return () => {
      cleanup();
    };
  }, [${paramsDef.map(p => `params.${p.key}`).join(', ')}]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['${className}']}>${innerHtml}</div>
        <span className={styles.hint}>${hint}</span>
      </div>
    </PreviewFrame>
  );
}
`;
}

// ============= EFFECT DEFINITIONS =============

const effects = [];
const P = (k) => ({ key: k });

// ---- BASIC 20 ----
effects.push({ id: 'fade-in-down', type: 'css-basic', cn: 'fade-in-down', params: [P('duration'),P('distance')], content: 'Hello', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--distance',v:`${'${params.distance}'}px`}], css: `animation: fadeInDown var(--duration, 0.8s) ease-out both;\n@keyframes fadeInDown { from { opacity: 0; transform: translateY(calc(var(--distance, 20px) * -1)); } to { opacity: 1; transform: translateY(0); } }` });
effects.push({ id: 'fade-in-left', type: 'css-basic', cn: 'fade-in-left', params: [P('duration'),P('distance')], content: 'Hello', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--distance',v:`${'${params.distance}'}px`}], css: `animation: fadeInLeft var(--duration, 0.8s) ease-out both;\n@keyframes fadeInLeft { from { opacity: 0; transform: translateX(calc(var(--distance, 24px) * -1)); } to { opacity: 1; transform: translateX(0); } }` });
effects.push({ id: 'fade-in-right', type: 'css-basic', cn: 'fade-in-right', params: [P('duration'),P('distance')], content: 'Hello', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--distance',v:`${'${params.distance}'}px`}], css: `animation: fadeInRight var(--duration, 0.8s) ease-out both;\n@keyframes fadeInRight { from { opacity: 0; transform: translateX(var(--distance, 24px)); } to { opacity: 1; transform: translateX(0); } }` });
effects.push({ id: 'scale-in', type: 'css-basic', cn: 'scale-in', params: [P('duration'),P('from')], content: 'Scale', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--from',v:`${'${params.from}'}`}], css: `animation: scaleIn var(--duration, 0.6s) cubic-bezier(0.34, 1.56, 0.64, 1) both;\n@keyframes scaleIn { from { opacity: 0; transform: scale(var(--from, 0.5)); } to { opacity: 1; transform: scale(1); } }` });
effects.push({ id: 'scale-out', type: 'css-basic', cn: 'scale-out', params: [P('duration'),P('from')], content: 'Scale', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--from',v:`${'${params.from}'}`}], css: `animation: scaleOut var(--duration, 0.6s) cubic-bezier(0.34, 1.56, 0.64, 1) both;\n@keyframes scaleOut { from { opacity: 0; transform: scale(var(--from, 1.2)); } to { opacity: 1; transform: scale(1); } }` });
effects.push({ id: 'flip-y', type: 'css-basic', cn: 'flip-y', params: [P('duration')], content: '↻', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `animation: flipY var(--duration, 0.8s) ease-out both;\ntransform-origin: center;\n@keyframes flipY { from { transform: perspective(600px) rotateY(-90deg); opacity: 0; } to { transform: perspective(600px) rotateY(0); opacity: 1; } }` });
effects.push({ id: 'flip-in-3d', type: 'css-basic', cn: 'flip-in-3d', params: [P('duration')], content: '3D', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `animation: flipIn3d var(--duration, 0.9s) ease-out both;\ntransform-origin: center;\n@keyframes flipIn3d { from { transform: perspective(800px) rotateX(-90deg) rotateY(-30deg) scale(0.6); opacity: 0; } to { transform: perspective(800px) rotateX(0) rotateY(0) scale(1); opacity: 1; } }` });
effects.push({ id: 'wobble', type: 'css-basic', cn: 'wobble', params: [P('duration')], content: 'Wobble', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `display: inline-block;\nanimation: wobble var(--duration, 1s) ease-in-out infinite;\ntransform-origin: center;\n@keyframes wobble { 0%, 100% { transform: translateX(0) rotate(0); } 15% { transform: translateX(-12%) rotate(-5deg); } 30% { transform: translateX(10%) rotate(3deg); } 45% { transform: translateX(-8%) rotate(-3deg); } 60% { transform: translateX(6%) rotate(2deg); } 75% { transform: translateX(-3%) rotate(-1deg); } }` });
effects.push({ id: 'tada', type: 'css-basic', cn: 'tada', params: [P('duration')], content: 'Tada!', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `display: inline-block;\nanimation: tada var(--duration, 1s) ease-in-out infinite;\ntransform-origin: center;\n@keyframes tada { 0%, 100% { transform: scale(1) rotate(0); } 10%, 20% { transform: scale(0.9) rotate(-3deg); } 30%, 50%, 70%, 90% { transform: scale(1.15) rotate(3deg); } 40%, 60%, 80% { transform: scale(1.15) rotate(-3deg); } }` });
effects.push({ id: 'bounce-down', type: 'css-basic', cn: 'bounce-down', params: [P('duration'),P('distance')], content: 'Bounce', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--distance',v:`${'${params.distance}'}px`}], css: `animation: bounceDown var(--duration, 1s) cubic-bezier(0.34, 1.56, 0.64, 1) both;\n@keyframes bounceDown { 0% { transform: translateY(calc(var(--distance, 60px) * -1)); opacity: 0; } 60% { transform: translateY(8px); opacity: 1; } 80% { transform: translateY(-4px); } 100% { transform: translateY(0); } }` });
effects.push({ id: 'slide-fade-corner', type: 'css-basic', cn: 'corner-slide', params: [P('duration')], content: 'Corner', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `animation: cornerSlide var(--duration, 0.8s) cubic-bezier(0.34, 1.56, 0.64, 1) both;\n@keyframes cornerSlide { from { opacity: 0; transform: translate(-40px, -40px) scale(0.8); } to { opacity: 1; transform: translate(0, 0) scale(1); } }` });
effects.push({ id: 'skew-in', type: 'css-basic', cn: 'skew-in', params: [P('duration'),P('angle')], content: 'Skew', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--angle',v:`${'${params.angle}'}deg`}], css: `animation: skewIn var(--duration, 0.7s) ease-out both;\n@keyframes skewIn { from { opacity: 0; transform: skewX(calc(var(--angle, 15deg) * -1)) translateX(-30px); } to { opacity: 1; transform: skewX(0) translateX(0); } }` });
effects.push({ id: 'blur-in', type: 'css-basic', cn: 'blur-in', params: [P('duration'),P('blur')], content: 'Blur', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--blur',v:`${'${params.blur}'}px`}], css: `animation: blurIn var(--duration, 0.8s) ease-out both;\n@keyframes blurIn { from { opacity: 0; filter: blur(var(--blur, 14px)); transform: scale(1.05); } to { opacity: 1; filter: blur(0); transform: scale(1); } }` });
effects.push({ id: 'blur-out', type: 'css-basic', cn: 'blur-out', params: [P('duration'),P('blur')], content: 'Pulse', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--blur',v:`${'${params.blur}'}px`}], css: `animation: blurOut var(--duration, 2.4s) ease-in-out infinite;\n@keyframes blurOut { 0%, 100% { filter: blur(0); opacity: 1; } 50% { filter: blur(var(--blur, 8px)); opacity: 0.6; } }` });
effects.push({ id: 'grayscale-in', type: 'css-basic', cn: 'grayscale-in', params: [P('duration')], content: 'Color', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `animation: grayscaleIn var(--duration, 1.2s) ease-out both;\n@keyframes grayscaleIn { from { filter: grayscale(1) brightness(1.2); opacity: 0.4; } to { filter: grayscale(0) brightness(1); opacity: 1; } }` });
effects.push({ id: 'color-cycle', type: 'css-basic', cn: 'color-cycle', params: [P('duration')], content: 'Cycle', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `animation: colorCycle var(--duration, 3s) linear infinite;\n@keyframes colorCycle { 0% { background: hsl(0 90% 60%); } 25% { background: hsl(90 90% 55%); } 50% { background: hsl(180 90% 55%); } 75% { background: hsl(270 90% 60%); } 100% { background: hsl(360 90% 60%); } }` });
effects.push({ id: 'border-draw', type: 'css-basic', cn: 'border-draw', params: [P('duration')], content: 'Draw', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `position: relative;\npadding: 24px 32px;\n@keyframes borderDraw { to { background-position: 100% 100%; } }\n.border-draw::before { content: ""; position: absolute; inset: 0; padding: 2px; border-radius: 12px; background: linear-gradient(90deg, hsl(280 90% 60%), hsl(200 90% 60%)); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; background-size: 300% 300%; animation: borderDraw var(--duration, 1.4s) ease-in-out infinite alternate; }` });
effects.push({ id: 'shadow-grow', type: 'css-basic', cn: 'shadow-grow', params: [P('duration')], content: 'Float', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `animation: shadowGrow var(--duration, 2s) ease-in-out infinite;\n@keyframes shadowGrow { 0%, 100% { box-shadow: 0 4px 10px rgba(0,0,0,0.1); transform: translateY(0); } 50% { box-shadow: 0 24px 40px rgba(0,0,0,0.25); transform: translateY(-6px); } }` });
effects.push({ id: 'gradient-shift', type: 'css-basic', cn: 'gradient-shift', params: [P('duration')], content: 'Flow', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `background: linear-gradient(120deg, hsl(280 90% 60%), hsl(200 90% 60%), hsl(320 90% 60%), hsl(280 90% 60%));\nbackground-size: 300% 300%;\nanimation: gradientShift var(--duration, 5s) ease infinite;\n@keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }` });
effects.push({ id: 'typewriter-cursor', type: 'typewriter', cn: 'tw', params: [P('speed')], text: 'Typing...', multi: false, css: `font-family: monospace; font-weight: 800; font-size: 24px; color: hsl(0 0% 100%);\n.tw::after { content: "▌"; margin-left: 2px; animation: blink 0.8s step-end infinite; }\n@keyframes blink { 50% { opacity: 0; } }` });

// ---- TEXT 20 ----
effects.push({ id: 'text-fade-up', type: 'css-text', cn: 'text-fade-up', params: [P('duration'),P('distance')], content: 'MOTION', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--distance',v:`${'${params.distance}'}px`}], css: `animation: textFadeUp var(--duration, 0.9s) cubic-bezier(0.22, 1, 0.36, 1) both;\n@keyframes textFadeUp { from { opacity: 0; transform: translateY(var(--distance, 24px)); } to { opacity: 1; transform: translateY(0); } }` });
effects.push({ id: 'text-slide-left', type: 'css-text', cn: 'text-slide-left', params: [P('duration'),P('distance')], content: 'SLIDE', vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--distance',v:`${'${params.distance}'}px`}], css: `animation: textSlideLeft var(--duration, 0.8s) cubic-bezier(0.22, 1, 0.36, 1) both;\n@keyframes textSlideLeft { from { opacity: 0; transform: translateX(var(--distance, 40px)); } to { opacity: 1; transform: translateX(0); } }` });
effects.push({ id: 'text-zoom-in', type: 'css-text', cn: 'text-zoom-in', params: [P('duration')], content: 'ZOOM', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `animation: textZoomIn var(--duration, 0.8s) cubic-bezier(0.34, 1.56, 0.64, 1) both;\n@keyframes textZoomIn { from { opacity: 0; transform: scale(0.3); letter-spacing: 0.3em; } to { opacity: 1; transform: scale(1); letter-spacing: -0.02em; } }` });
effects.push({ id: 'text-blur-reveal', type: 'css-text', cn: 'text-blur-reveal', params: [P('duration')], content: 'REVEAL', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `animation: textBlurReveal var(--duration, 1.2s) ease-out both;\n@keyframes textBlurReveal { from { opacity: 0; filter: blur(20px); letter-spacing: 0.4em; } to { opacity: 1; filter: blur(0); letter-spacing: -0.02em; } }` });
effects.push({ id: 'text-glitch-rgb', type: 'css-text-data', cn: 'rgb-glitch', params: [P('duration')], content: 'RGB', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `.rgb-glitch::before, .rgb-glitch::after { content: attr(data-text); position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; mix-blend-mode: screen; }\n.rgb-glitch::before { color: hsl(0 100% 55%); animation: rgbR var(--duration, 2s) infinite; }\n.rgb-glitch::after { color: hsl(180 100% 55%); animation: rgbB var(--duration, 2s) infinite; }\n@keyframes rgbR { 0%, 100% { transform: translate(0); } 20% { transform: translate(-3px, 1px); } 40% { transform: translate(2px, -2px); } 60% { transform: translate(-1px, 2px); } }\n@keyframes rgbB { 0%, 100% { transform: translate(0); } 20% { transform: translate(3px, -1px); } 40% { transform: translate(-2px, 2px); } 60% { transform: translate(1px, -2px); } }` });
effects.push({ id: 'text-neon', type: 'css-text', cn: 'text-neon', params: [P('duration')], content: 'NEON', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `color: hsl(320 100% 70%);\ntext-shadow: 0 0 6px hsl(320 100% 60%), 0 0 14px hsl(320 100% 55%), 0 0 28px hsl(320 100% 50%), 0 0 50px hsl(320 100% 45%);\nanimation: neonFlicker var(--duration, 2s) ease-in-out infinite;\n@keyframes neonFlicker { 0%, 100% { opacity: 1; } 92% { opacity: 1; } 93% { opacity: 0.4; } 94% { opacity: 1; } 96% { opacity: 0.6; } 97% { opacity: 1; } }` });
effects.push({ id: 'text-fire', type: 'css-text', cn: 'text-fire', params: [P('duration')], content: 'FIRE', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `background: linear-gradient(0deg, hsl(0 90% 50%), hsl(20 100% 55%), hsl(45 100% 60%), hsl(0 90% 50%));\nbackground-size: 100% 200%;\n-webkit-background-clip: text;\nbackground-clip: text;\ncolor: transparent;\nfilter: drop-shadow(0 -2px 6px hsl(20 100% 50%));\nanimation: fireFlicker var(--duration, 2s) ease-in-out infinite;\n@keyframes fireFlicker { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 0% 100%; } }` });
effects.push({ id: 'text-ice', type: 'css-text', cn: 'text-ice', params: [P('duration')], content: 'ICE', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `background: linear-gradient(135deg, hsl(190 90% 80%), hsl(210 80% 95%), hsl(200 90% 70%), hsl(220 60% 85%));\nbackground-size: 200% 200%;\n-webkit-background-clip: text;\nbackground-clip: text;\ncolor: transparent;\ntext-shadow: 0 0 12px hsl(200 100% 80%);\nanimation: iceShimmer var(--duration, 2.5s) ease-in-out infinite;\n@keyframes iceShimmer { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } }` });
effects.push({ id: 'text-metallic', type: 'css-text', cn: 'text-metallic', params: [P('duration')], content: 'METAL', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `background: linear-gradient(180deg, hsl(0 0% 85%) 0%, hsl(0 0% 35%) 45%, hsl(0 0% 75%) 50%, hsl(0 0% 30%) 55%, hsl(0 0% 80%) 100%);\nbackground-size: 100% 200%;\n-webkit-background-clip: text;\nbackground-clip: text;\ncolor: transparent;\nanimation: metalShine var(--duration, 2.5s) ease-in-out infinite;\n@keyframes metalShine { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 0% 100%; } }` });
effects.push({ id: 'text-outline', type: 'css-text', cn: 'text-outline', params: [P('duration')], content: 'OUTLINE', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `color: transparent;\n-webkit-text-stroke: 2px hsl(280 90% 60%);\nanimation: outlinePulse var(--duration, 2s) ease-in-out infinite;\n@keyframes outlinePulse { 0%, 100% { -webkit-text-stroke-color: hsl(280 90% 60%); } 50% { -webkit-text-stroke-color: hsl(200 90% 60%); } }` });
effects.push({ id: 'text-typewriter-multi', type: 'typewriter', cn: 'tw', params: [P('speed')], text: ['Hello.', 'I am Motion.', 'Built for effects.'], multi: true, css: `font-family: monospace; font-weight: 800; font-size: 24px; color: hsl(0 0% 100%);\n.tw::after { content: "▌"; animation: blink 0.8s step-end infinite; }\n@keyframes blink { 50% { opacity: 0; } }` });
effects.push({ id: 'text-delete-retype', type: 'typewriter', cn: 'tw', params: [P('speed')], text: 'DELETE & RETYPE', multi: false, css: `font-family: monospace; font-weight: 800; font-size: 24px; color: hsl(0 0% 100%);\n.tw::after { content: "▌"; animation: blink 0.8s step-end infinite; }\n@keyframes blink { 50% { opacity: 0; } }` });
effects.push({ id: 'text-wave-3d', type: 'css-chars', cn: 'wave-3d', params: [P('duration')], text: 'WAVE', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], delay: 0.08, css: `perspective: 400px;\n.wave-3d span { display: inline-block; animation: wave3d var(--duration, 2s) ease-in-out infinite; }\n@keyframes wave3d { 0%, 100% { transform: translateY(0) rotateX(0); } 50% { transform: translateY(-14px) rotateX(60deg); } }` });
effects.push({ id: 'text-bounce', type: 'css-chars', cn: 'text-bounce', params: [P('duration')], text: 'BOUNCE', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], delay: 0.1, css: `.text-bounce span { display: inline-block; animation: textBounce var(--duration, 1.6s) ease-in-out infinite; }\n@keyframes textBounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-18px); } }` });
effects.push({ id: 'text-rainbow-shift', type: 'css-text', cn: 'rainbow-shift', params: [P('duration')], content: 'RAINBOW', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `background: linear-gradient(90deg, hsl(0 90% 60%), hsl(60 90% 60%), hsl(120 90% 60%), hsl(180 90% 60%), hsl(240 90% 60%), hsl(300 90% 60%), hsl(360 90% 60%));\nbackground-size: 300% auto;\n-webkit-background-clip: text;\nbackground-clip: text;\ncolor: transparent;\nanimation: rbShift var(--duration, 3s) linear infinite;\n@keyframes rbShift { to { background-position: 300% 0; } }` });
effects.push({ id: 'text-shadow-long', type: 'css-text', cn: 'long-shadow', params: [P('depth')], content: 'SHADOW', vars: [], css: `color: hsl(0 0% 100%);\ntext-shadow: 1px 1px 0 hsl(280 60% 40%), 2px 2px 0 hsl(280 60% 38%), 3px 3px 0 hsl(280 60% 36%), 4px 4px 0 hsl(280 60% 34%), 5px 5px 0 hsl(280 60% 32%), 6px 6px 0 hsl(280 60% 30%), 7px 7px 0 hsl(280 60% 28%), 8px 8px 0 hsl(280 60% 26%), 9px 9px 0 hsl(280 60% 24%), 10px 10px 12px hsl(280 80% 10%);` });
effects.push({ id: 'text-stroke-animate', type: 'svg-text', cn: 'stroke-text', params: [P('duration')], content: 'STROKE', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `font-size: 56px; font-weight: 900; fill: transparent; stroke: hsl(280 90% 60%); stroke-width: 2; stroke-dasharray: 600; stroke-dashoffset: 600; animation: strokeDraw var(--duration, 2.5s) ease-out infinite alternate;\n@keyframes strokeDraw { to { stroke-dashoffset: 0; } }` });
effects.push({ id: 'text-split-reveal', type: 'css-text-data', cn: 'split-reveal', params: [P('duration')], content: 'SPLIT', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], css: `overflow: hidden;\n.split-reveal::before { content: attr(data-text); position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; clip-path: inset(0 0 50% 0); transform: translateY(-100%); animation: splitTop var(--duration, 1.2s) cubic-bezier(0.65, 0, 0.35, 1) forwards; }\n@keyframes splitTop { to { transform: translateY(0); } }` });
effects.push({ id: 'text-char-fall', type: 'css-chars', cn: 'char-fall', params: [P('duration')], text: 'FALL', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], delay: 0.1, css: `.char-fall span { display: inline-block; opacity: 0; animation: charFall var(--duration, 1.2s) cubic-bezier(0.34, 1.56, 0.64, 1) both; }\n@keyframes charFall { from { opacity: 0; transform: translateY(-60px) rotate(-20deg); } to { opacity: 1; transform: translateY(0) rotate(0); } }` });
effects.push({ id: 'text-word-fly', type: 'css-words', cn: 'word-fly', params: [P('duration'),P('stagger')], words: ['Motion','Lab','Effects'], vars: [{n:'--duration',v:`${'${params.duration}'}s`},{n:'--stagger',v:`${'${params.stagger}'}s`}], css: `.word-fly span { display: inline-block; opacity: 0; animation: wordFly var(--duration, 0.7s) cubic-bezier(0.22, 1, 0.36, 1) forwards; margin: 0 8px; }\n.word-fly span:nth-child(1) { animation-delay: 0s; }\n.word-fly span:nth-child(2) { animation-delay: var(--stagger, 0.12s); }\n.word-fly span:nth-child(3) { animation-delay: calc(var(--stagger, 0.12s) * 2); }\n@keyframes wordFly { from { opacity: 0; transform: translateZ(-200px) rotateY(40deg); } to { opacity: 1; transform: translateZ(0) rotateY(0); } }` });

// ---- INTERACTION 20 ----
effects.push({ id: 'hover-scale', type: 'hover', cn: 'hover-scale', params: [P('scale')], inner: 'HOVER', vars: [{n:'--scale',v:`${'${params.scale}'}`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.hover-scale { padding: 24px 48px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; cursor: pointer; transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }\n.hover-scale:hover { transform: scale(var(--scale, 1.15)); }` });
effects.push({ id: 'hover-rotate', type: 'hover', cn: 'hover-rotate', params: [P('angle')], inner: 'ROTATE', vars: [{n:'--angle',v:`${'${params.angle}'}deg`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.hover-rotate { padding: 24px 48px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; cursor: pointer; transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }\n.hover-rotate:hover { transform: rotate(var(--angle, 30deg)); }` });
effects.push({ id: 'hover-skew', type: 'hover', cn: 'hover-skew', params: [P('angle')], inner: 'SKEW', vars: [{n:'--angle',v:`${'${params.angle}'}deg`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.hover-skew { padding: 24px 48px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; cursor: pointer; transition: transform 0.3s ease; }\n.hover-skew:hover { transform: skewX(calc(var(--angle, 15deg) * -1)); }` });
effects.push({ id: 'hover-blur', type: 'hover-multi', cn: 'hover-blur', params: [P('blur')], inner: '<div className={styles.bg}></div><div className={styles.fg}>HOVER</div>', vars: [{n:'--blur',v:`${'${params.blur}'}px`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.hover-blur { position: relative; cursor: pointer; width: 200px; height: 100px; border-radius: 12px; overflow: hidden; }\n.bg { width: 100%; height: 100%; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); transition: filter 0.3s; }\n.fg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px; }\n.hover-blur:hover .bg { filter: blur(var(--blur, 6px)); }` });
effects.push({ id: 'hover-color-change', type: 'hover', cn: 'hover-color', params: [P('duration')], inner: 'CHANGE', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.hover-color { padding: 24px 48px; border-radius: 12px; background: hsl(280 90% 60%); color: white; font-weight: 800; font-size: 20px; cursor: pointer; transition: background var(--duration, 0.3s) ease, transform var(--duration, 0.3s) ease; }\n.hover-color:hover { background: hsl(200 90% 55%); transform: translateY(-2px); }` });
effects.push({ id: 'hover-border-expand', type: 'hover', cn: 'border-expand', params: [P('duration')], inner: 'EXPAND', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.border-expand { position: relative; padding: 24px 48px; color: hsl(280 90% 60%); font-weight: 800; font-size: 20px; cursor: pointer; }\n.border-expand::before { content: ""; position: absolute; inset: 50% 50%; border: 2px solid hsl(280 90% 60%); border-radius: 12px; transition: inset var(--duration, 0.4s) cubic-bezier(0.2, 0.8, 0.2, 1); }\n.border-expand:hover::before { inset: 0; }` });
effects.push({ id: 'hover-text-reveal', type: 'hover-multi', cn: 'text-reveal', params: [P('duration')], inner: 'HOVER<div className={styles.hidden}>REVEALED</div>', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.text-reveal { position: relative; overflow: hidden; width: 200px; height: 80px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; }\n.hidden { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: hsl(200 90% 55%); color: white; font-weight: 800; transform: translateY(100%); transition: transform var(--duration, 0.4s) cubic-bezier(0.2, 0.8, 0.2, 1); }\n.text-reveal:hover .hidden { transform: translateY(0); }` });
effects.push({ id: 'hover-image-zoom', type: 'hover-multi', cn: 'img-zoom', params: [P('scale')], inner: '<div className={styles.img}></div>', vars: [{n:'--scale',v:`${'${params.scale}'}`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.img-zoom { overflow: hidden; width: 200px; height: 120px; border-radius: 12px; cursor: pointer; }\n.img { width: 100%; height: 100%; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }\n.img-zoom:hover .img { transform: scale(var(--scale, 1.3)); }` });
effects.push({ id: 'hover-flip-card', type: 'hover-multi', cn: 'flip-card', params: [P('duration')], inner: '<div className={styles.flipInner}><div className={styles.front}>FRONT</div><div className={styles.back}>BACK</div></div>', vars: [{n:'--duration',v:`${'${params.duration}'}s`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; perspective: 800px; }\n.flip-card { width: 160px; height: 100px; cursor: pointer; perspective: 800px; }\n.flipInner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform var(--duration, 0.6s); }\n.flip-card:hover .flipInner { transform: rotateY(180deg); }\n.front { position: absolute; inset: 0; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: white; font-weight: 800; font-size: 20px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); }\n.back { position: absolute; inset: 0; backface-visibility: hidden; display: flex; align-items: center; justify-content: center; border-radius: 12px; color: white; font-weight: 800; font-size: 20px; background: linear-gradient(135deg, hsl(200 90% 60%), hsl(320 90% 60%)); transform: rotateY(180deg); }` });
effects.push({ id: 'hover-glow', type: 'hover', cn: 'hover-glow', params: [P('intensity')], inner: 'GLOW', vars: [{n:'--intensity',v:`${'${params.intensity}'}px`}], hint: 'Hover', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.hover-glow { padding: 24px 48px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; cursor: pointer; transition: box-shadow 0.3s ease, transform 0.3s ease; }\n.hover-glow:hover { box-shadow: 0 0 var(--intensity, 28px) hsl(280 90% 60%); transform: translateY(-2px); }` });

effects.push({ id: 'click-ripple-material', type: 'click', cn: 'mat-ripple', params: [P('duration')], content: 'CLICK', hint: 'Click', clickLogic: `    const rip = document.createElement('span');\n    rip.className = styles.ripple;\n    rip.style.left = (e.clientX - r.left) + 'px';\n    rip.style.top = (e.clientY - r.top) + 'px';\n    rip.style.width = rip.style.height = '20px';\n    el.appendChild(rip);\n    setTimeout(() => rip.remove(), params.duration * 1000);`, css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.mat-ripple { position: relative; overflow: hidden; padding: 24px 48px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; cursor: pointer; }\n.ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5); transform: translate(-50%, -50%) scale(0); animation: matRipple var(--duration, 0.6s) ease-out forwards; pointer-events: none; }\n@keyframes matRipple { to { transform: translate(-50%, -50%) scale(10); opacity: 0; } }` });
effects.push({ id: 'click-shockwave', type: 'click', cn: 'shockwave', params: [P('duration')], content: 'CLICK', hint: 'Click', clickLogic: `    const w = document.createElement('span');\n    w.className = styles.wave;\n    w.style.left = (e.clientX - r.left) + 'px';\n    w.style.top = (e.clientY - r.top) + 'px';\n    w.style.width = w.style.height = '20px';\n    el.appendChild(w);\n    setTimeout(() => w.remove(), params.duration * 1000);`, css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.shockwave { position: relative; padding: 24px 48px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; cursor: pointer; overflow: hidden; }\n.wave { position: absolute; border: 3px solid hsl(280 90% 60%); border-radius: 50%; transform: translate(-50%, -50%) scale(0); animation: shock var(--duration, 0.8s) ease-out forwards; pointer-events: none; }\n@keyframes shock { to { transform: translate(-50%, -50%) scale(8); opacity: 0; border-width: 1px; } }` });
effects.push({ id: 'click-emoji-burst', type: 'click-count', cn: 'emoji-burst', params: [P('count')], content: 'CLICK', hint: 'Click', clickLogic: `    const emojis = ['🎉','✨','⭐','💫','🌟','🎊'];\n    const x = e.clientX - r.left, y = e.clientY - r.top;\n    for (let i = 0; i < params.count; i++) {\n      const s = document.createElement('span');\n      s.className = styles.e;\n      s.textContent = emojis[i % emojis.length];\n      s.style.left = x + 'px';\n      s.style.top = y + 'px';\n      el.appendChild(s);\n      const ang = (i / params.count) * Math.PI * 2;\n      const dist = 50 + Math.random() * 30;\n      requestAnimationFrame(() => {\n        s.style.transform = 'translate(' + Math.cos(ang) * dist + 'px, ' + Math.sin(ang) * dist + 'px) scale(0)';\n        s.style.opacity = '0';\n      });\n      setTimeout(() => s.remove(), 750);\n    }`, css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.emoji-burst { position: relative; padding: 24px 48px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; cursor: pointer; overflow: hidden; }\n.e { position: absolute; font-size: 24px; pointer-events: none; transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s; }` });

effects.push({ id: 'drag-to-reveal', type: 'drag', cn: 'drag-reveal', params: [P('duration')], hint: 'Drag', dragLogic: `    let dragging = false, startX = 0, startPct = 0;\n    const cover = el.querySelector('[data-cover]') as HTMLElement;\n    const pct = () => { const m = cover.style.clipPath.match(/inset\\(0 (\\d+)%/); return m ? +m[1] : 0; };\n    const onDown = (e: MouseEvent) => { dragging = true; startX = e.clientX; startPct = pct(); };\n    const onMove = (e: MouseEvent) => {\n      if (!dragging) return;\n      const w = el.offsetWidth;\n      let p = startPct + ((e.clientX - startX) / w) * 100;\n      p = Math.max(0, Math.min(100, p));\n      cover.style.clipPath = 'inset(0 ' + p + '% 0 0)';\n    };\n    const onUp = () => { dragging = false; };\n    el.addEventListener('mousedown', onDown);\n    window.addEventListener('mousemove', onMove);\n    window.addEventListener('mouseup', onUp);\n    const cleanup = () => {\n      el.removeEventListener('mousedown', onDown);\n      window.removeEventListener('mousemove', onMove);\n      window.removeEventListener('mouseup', onUp);\n    };`, inner: '<div className={styles.under}>REVEALED</div><div data-cover className={styles.cover}>DRAG ME</div>', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.drag-reveal { position: relative; width: 200px; height: 100px; border-radius: 12px; cursor: ew-resize; user-select: none; overflow: hidden; }\n.under { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: linear-gradient(135deg, hsl(140 80% 50%), hsl(160 80% 50%)); color: white; font-weight: 800; font-size: 18px; }\n.cover { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 18px; transition: clip-path var(--duration, 0.2s); clip-path: inset(0 0 0 0); }` });
effects.push({ id: 'drag-rotate', type: 'drag', cn: 'drag-rotate', params: [P('sensitivity')], hint: 'Drag', dragLogic: `    let rx = -20, ry = 20, dragging = false, lx = 0, ly = 0;\n    const onDown = (e: MouseEvent) => { dragging = true; lx = e.clientX; ly = e.clientY; };\n    const onMove = (e: MouseEvent) => {\n      if (!dragging) return;\n      ry += (e.clientX - lx) * params.sensitivity;\n      rx -= (e.clientY - ly) * params.sensitivity;\n      lx = e.clientX; ly = e.clientY;\n      el.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';\n    };\n    const onUp = () => { dragging = false; };\n    el.addEventListener('mousedown', onDown);\n    window.addEventListener('mousemove', onMove);\n    window.addEventListener('mouseup', onUp);\n    el.style.transform = 'perspective(600px) rotateX(-20deg) rotateY(20deg)';\n    const cleanup = () => {\n      el.removeEventListener('mousedown', onDown);\n      window.removeEventListener('mousemove', onMove);\n      window.removeEventListener('mouseup', onUp);\n    };`, inner: 'DRAG', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.drag-rotate { width: 120px; height: 120px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 20px; display: flex; align-items: center; justify-content: center; transform-style: preserve-3d; cursor: grab; user-select: none; }\n.drag-rotate:active { cursor: grabbing; }` });

effects.push({ id: 'scroll-progress', type: 'scroll', cn: 'scroll-progress', params: [P('height')], hint: 'Scroll', scrollLogic: `    const bar = el.querySelector('[data-bar]') as HTMLElement;\n    bar.style.height = params.height + 'px';\n    const scroller = el.parentElement!;\n    const onScroll = () => {\n      const p = scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight || 1);\n      bar.style.width = (p * 100) + '%';\n    };\n    scroller.addEventListener('scroll', onScroll);\n    const cleanup = () => { scroller.removeEventListener('scroll', onScroll); };`, inner: '<div data-bar className={styles.bar}></div><div className={styles.spacer}>Scroll Me ↓</div><div className={styles.spacer}>Keep Going ↓</div><div className={styles.spacer}>End</div>', css: `.wrap { position: relative; width: 100%; height: 100%; overflow-y: auto; }\n.scroll-progress { position: sticky; top: 0; left: 0; right: 0; height: 4px; background: rgba(0,0,0,0.1); z-index: 100; }\n.bar { height: 100%; width: 0; background: linear-gradient(90deg, hsl(280 90% 60%), hsl(200 90% 60%)); transition: width 0.1s; }\n.spacer { height: 120px; display: flex; align-items: center; justify-content: center; color: hsl(280 40% 50%); font-weight: 800; font-size: 18px; }` });
effects.push({ id: 'scroll-reveal', type: 'scroll', cn: 'scroll-reveal', params: [P('distance')], hint: 'Scroll', scrollLogic: `    el.style.transform = 'translateY(' + params.distance + 'px)';\n    const io = new IntersectionObserver((es) => es.forEach(e => {\n      if (e.isIntersecting) {\n        el.classList.add(styles.in);\n        el.style.transform = '';\n      }\n    }), { threshold: 0.2 });\n    io.observe(el);\n    const cleanup = () => { io.disconnect(); };`, inner: 'REVEAL ON SCROLL', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.scroll-reveal { padding: 24px 48px; border-radius: 12px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; font-weight: 800; font-size: 18px; opacity: 0; transition: opacity 0.6s, transform 0.6s; }\n.in { opacity: 1 !important; transform: translateY(0) !important; }` });
effects.push({ id: 'scroll-parallax', type: 'scroll', cn: 'scroll-parallax', params: [P('speed')], hint: 'Scroll', scrollLogic: `    const layers = el.querySelectorAll('[data-d]');\n    const onScroll = () => {\n      const r = el.getBoundingClientRect();\n      const y = r.top;\n      layers.forEach(l => {\n        const d = parseFloat(l.getAttribute('data-d') || '0.5');\n        (l as HTMLElement).style.transform = 'translateY(' + (y * d * params.speed) + 'px)';\n      });\n    };\n    window.addEventListener('scroll', onScroll);\n    onScroll();\n    const cleanup = () => { window.removeEventListener('scroll', onScroll); };`, inner: '<div data-d="0.3" className={styles.layer}>BACK</div><div data-d="0.6" className={styles.layer}>MID</div><div data-d="1" className={styles.layer}>FRONT</div>', css: `.wrap { position: relative; width: 100%; height: 100%; overflow: hidden; }\n.scroll-parallax { position: relative; width: 100%; height: 100%; }\n.layer { position: absolute; left: 50%; transform: translateX(-50%); padding: 16px 32px; border-radius: 8px; color: white; font-weight: 800; font-size: 18px; white-space: nowrap; transition: transform 0.1s; }\n.layer:nth-child(1) { top: 10%; background: hsl(280 90% 60% / 0.7); }\n.layer:nth-child(2) { top: 40%; background: hsl(200 90% 60% / 0.7); }\n.layer:nth-child(3) { top: 70%; background: hsl(320 90% 60% / 0.7); }` });

effects.push({ id: 'hover-magnetic-text', type: 'mousemove', cn: 'mag-text', params: [P('strength')], hint: 'Hover', mouseLogic: `    const spans = el.querySelectorAll('span');\n    const onMove = (e: MouseEvent) => {\n      spans.forEach(s => {\n        const r = s.getBoundingClientRect();\n        const dx = e.clientX - (r.left + r.width / 2);\n        const dy = e.clientY - (r.top + r.height / 2);\n        const d = Math.hypot(dx, dy);\n        if (d < 100) (s as HTMLElement).style.transform = 'translate(' + (dx * params.strength) + 'px, ' + (dy * params.strength) + 'px)';\n        else (s as HTMLElement).style.transform = '';\n      });\n    };\n    el.addEventListener('mousemove', onMove);\n    const cleanup = () => { el.removeEventListener('mousemove', onMove); };`, inner: '<span>M</span><span>A</span><span>G</span><span>N</span><span>E</span><span>T</span><span>I</span><span>C</span>', css: `.wrap { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }\n.mag-text { font-size: 48px; font-weight: 900; color: hsl(280 90% 60%); font-family: var(--font-display); cursor: pointer; }\n.mag-text span { display: inline-block; transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); }` });
effects.push({ id: 'hover-follow-cursor', type: 'mousemove', cn: 'follow-zone', params: [P('speed')], hint: 'Move', mouseLogic: `    const dot = el.querySelector('[data-dot]') as HTMLElement;\n    let tx = 0, ty = 0, x = 0, y = 0;\n    const onMove = (e: MouseEvent) => {\n      const r = el.getBoundingClientRect();\n      tx = e.clientX - r.left;\n      ty = e.clientY - r.top;\n    };\n    el.addEventListener('mousemove', onMove);\n    let raf = 0;\n    const tick = () => {\n      x += (tx - x) * params.speed;\n      y += (ty - y) * params.speed;\n      dot.style.left = x + 'px';\n      dot.style.top = y + 'px';\n      raf = requestAnimationFrame(tick);\n    };\n    tick();\n    const cleanup = () => {\n      el.removeEventListener('mousemove', onMove);\n      cancelAnimationFrame(raf);\n    };`, inner: '<div data-dot className={styles.dot}></div>', css: `.wrap { position: relative; width: 100%; height: 100%; }\n.follow-zone { position: relative; width: 100%; height: 100%; cursor: none; }\n.dot { position: absolute; width: 24px; height: 24px; border-radius: 50%; background: hsl(280 90% 60%); pointer-events: none; transform: translate(-50%, -50%); box-shadow: 0 0 20px hsl(280 90% 60%); }` });

// ---- ADVANCED 20 ----
effects.push({ id: 'particle-fountain', type: 'canvas', params: [P('count')], logic: `    type P = { x: number; y: number; vx: number; vy: number; c: string; s: number };\n    const ps: P[] = [];\n    const spawn = (): P => ({ x: c.width / 2, y: c.height, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 10 - 4, c: 'hsl(' + Math.random() * 360 + ' 90% 60%)', s: 3 + Math.random() * 3 });\n    for (let i = 0; i < params.count; i++) ps.push(spawn());\n    const tick = () => {\n      ctx.fillStyle = 'rgba(10,10,30,0.2)';\n      ctx.fillRect(0, 0, c.width, c.height);\n      for (let i = 0; i < ps.length; i++) {\n        const p = ps[i];\n        p.vy += 0.2; p.x += p.vx; p.y += p.vy;\n        if (p.y > c.height) ps[i] = spawn();\n        ctx.fillStyle = p.c;\n        ctx.fillRect(p.x, p.y, p.s, p.s);\n      }\n      raf = requestAnimationFrame(tick);\n    };\n    tick();` });
effects.push({ id: 'particle-galaxy', type: 'three', params: [P('count')], setup: `    const positions = new Float32Array(params.count * 3);\n    const colors = new Float32Array(params.count * 3);\n    for (let i = 0; i < params.count; i++) {\n      const r = Math.random() * 5;\n      const a = i * 0.3;\n      positions[i * 3] = Math.cos(a) * r;\n      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;\n      positions[i * 3 + 2] = Math.sin(a) * r;\n      const hue = i / params.count;\n      colors[i * 3] = hue;\n      colors[i * 3 + 1] = 0.5;\n      colors[i * 3 + 2] = 1;\n    }\n    const geometry = new THREE.BufferGeometry();\n    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));\n    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));\n    const material = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.9 });\n    const points = new THREE.Points(geometry, material);\n    scene.add(points);`, anim: `      points.rotation.y += 0.002;` });
effects.push({ id: 'shader-plasma', type: 'webgl', params: [P('speed')], frag: `precision mediump float;\nuniform float u_time;\nuniform vec2 u_resolution;\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / u_resolution;\n  float v = sin(uv.x * 10.0 + u_time) + sin(uv.y * 10.0 + u_time * 1.3) + sin((uv.x + uv.y) * 8.0);\n  v = v / 3.0;\n  gl_FragColor = vec4(0.5 + 0.5 * sin(v * 3.14), 0.5 + 0.5 * sin(v * 3.14 + 2.0), 0.5 + 0.5 * sin(v * 3.14 + 4.0), 1.0);\n}` });
effects.push({ id: 'shader-fireball', type: 'webgl', params: [P('speed')], frag: `precision mediump float;\nuniform float u_time;\nuniform vec2 u_resolution;\nfloat hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / u_resolution;\n  float n = hash(uv * 10.0 + u_time);\n  vec3 col = mix(vec3(1.0, 0.8, 0.1), vec3(0.8, 0.1, 0.0), uv.y);\n  gl_FragColor = vec4(col * n * 1.5, 1.0);\n}` });
effects.push({ id: 'canvas-snow', type: 'canvas', params: [P('count')], logic: `    type F = { x: number; y: number; r: number; s: number; w: number };\n    const flakes: F[] = [];\n    for (let i = 0; i < params.count; i++) flakes.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: 1 + Math.random() * 3, s: 0.5 + Math.random() * 1.5, w: Math.random() * 2 - 1 });\n    const tick = () => {\n      ctx.clearRect(0, 0, c.width, c.height);\n      ctx.fillStyle = 'white';\n      for (const f of flakes) {\n        f.y += f.s; f.x += f.w;\n        if (f.y > c.height) f.y = 0;\n        ctx.beginPath();\n        ctx.arc(f.x, f.y, f.r, 0, 7);\n        ctx.fill();\n      }\n      raf = requestAnimationFrame(tick);\n    };\n    tick();` });
effects.push({ id: 'canvas-fireworks', type: 'canvas', params: [P('count')], logic: `    type P = { x: number; y: number; vx: number; vy: number; c: string; life: number };\n    let ps: P[] = [];\n    let frame = 0;\n    const launch = () => {\n      const x = Math.random() * c.width;\n      const hue = Math.random() * 360;\n      for (let i = 0; i < params.count; i++) {\n        const a = (i / params.count) * 6.28;\n        ps.push({ x, y: c.height * 0.4, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, c: 'hsl(' + hue + ' 90% 60%)', life: 1 });\n      }\n    };\n    launch();\n    const tick = () => {\n      frame++;\n      if (frame % 72 === 0) launch();\n      ctx.fillStyle = 'rgba(0,0,20,0.2)';\n      ctx.fillRect(0, 0, c.width, c.height);\n      ps = ps.filter(p => p.life > 0);\n      for (const p of ps) {\n        p.vy += 0.05; p.x += p.vx; p.y += p.vy; p.life -= 0.015;\n        ctx.fillStyle = p.c;\n        ctx.globalAlpha = p.life;\n        ctx.fillRect(p.x, p.y, 3, 3);\n      }\n      ctx.globalAlpha = 1;\n      raf = requestAnimationFrame(tick);\n    };\n    tick();` });
effects.push({ id: 'canvas-starfield', type: 'canvas', params: [P('count')], logic: `    type S = { x: number; y: number; z: number };\n    const stars: S[] = [];\n    for (let i = 0; i < params.count; i++) stars.push({ x: (Math.random() - 0.5) * c.width, y: (Math.random() - 0.5) * c.height, z: Math.random() * c.width });\n    const tick = () => {\n      ctx.fillStyle = 'black';\n      ctx.fillRect(0, 0, c.width, c.height);\n      ctx.fillStyle = 'white';\n      for (const s of stars) {\n        s.z -= 4;\n        if (s.z <= 0) s.z = c.width;\n        const k = 128 / s.z;\n        const x = s.x * k + c.width / 2;\n        const y = s.y * k + c.height / 2;\n        const r = (1 - s.z / c.width) * 2;\n        ctx.fillRect(x, y, r, r);\n      }\n      raf = requestAnimationFrame(tick);\n    };\n    tick();` });
effects.push({ id: 'canvas-ocean', type: 'canvas', params: [P('speed')], logic: `    let t = 0;\n    const wave = (y: number, amp: number, freq: number, color: string) => {\n      ctx.beginPath();\n      ctx.moveTo(0, y);\n      for (let x = 0; x <= c.width; x += 4) ctx.lineTo(x, y + Math.sin(x * freq + t) * amp);\n      ctx.lineTo(c.width, c.height);\n      ctx.lineTo(0, c.height);\n      ctx.fillStyle = color;\n      ctx.fill();\n    };\n    const tick = () => {\n      ctx.fillStyle = '#0a1a3a';\n      ctx.fillRect(0, 0, c.width, c.height);\n      wave(c.height * 0.5, 16, 0.02, 'hsl(200 80% 40%)');\n      wave(c.height * 0.62, 12, 0.03, 'hsl(210 80% 50%)');\n      wave(c.height * 0.74, 8, 0.04, 'hsl(200 90% 60%)');\n      t += params.speed;\n      raf = requestAnimationFrame(tick);\n    };\n    tick();` });
effects.push({ id: 'svg-draw-path', type: 'svg', params: [P('duration')], vars: [{n:'--duration',v:`${'${params.duration}'}s`}], svgContent: '<svg viewBox="0 0 200 100" className={styles.svg}><path className={styles.p} d="M10,80 C40,10 70,90 100,40 S160,90 190,30" fill="none" stroke="hsl(280 90% 60%)" strokeWidth="3"/></svg>', css: `.panel { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; box-sizing: border-box; padding: 32px; border-radius: 12px; background: linear-gradient(135deg, hsl(250 60% 12%), hsl(280 50% 15%)); }\n.svg { width: 100%; height: auto; max-height: 100%; }\n.p { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw var(--duration, 3s) ease-in-out infinite alternate; }\n@keyframes draw { to { stroke-dashoffset: 0; } }` });
effects.push({ id: 'svg-dash-animate', type: 'svg', params: [P('duration')], vars: [{n:'--duration',v:`${'${params.duration}'}s`}], svgContent: '<svg viewBox="0 0 200 100" className={styles.svg}><path className={styles.p} d="M10,50 L60,20 L110,80 L160,30 L190,60" fill="none" stroke="hsl(200 90% 55%)" strokeWidth="3" strokeDasharray="8 6"/></svg>', css: `.panel { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; box-sizing: border-box; padding: 32px; border-radius: 12px; background: linear-gradient(135deg, hsl(250 60% 12%), hsl(280 50% 15%)); }\n.svg { width: 100%; height: auto; max-height: 100%; }\n.p { animation: dash var(--duration, 1.5s) linear infinite; }\n@keyframes dash { to { stroke-dashoffset: -28; } }` });
effects.push({ id: '3d-sphere', type: 'three', params: [P('detail')], setup: `    const geometry = new THREE.IcosahedronGeometry(1.5, 2);\n    const material = new THREE.MeshBasicMaterial({ color: 0xaa66ff, wireframe: true });\n    const mesh = new THREE.Mesh(geometry, material);\n    scene.add(mesh);`, anim: `      mesh.rotation.y += 0.005;\n      mesh.rotation.x += 0.002;` });
effects.push({ id: '3d-torus', type: 'three', params: [P('duration')], setup: `    const geometry = new THREE.TorusGeometry(1.2, 0.4, 16, 60);\n    const material = new THREE.MeshNormalMaterial();\n    const mesh = new THREE.Mesh(geometry, material);\n    scene.add(mesh);`, anim: `      mesh.rotation.x += 0.01;\n      mesh.rotation.y += 0.006;` });
effects.push({ id: 'gsap-timeline', type: 'gsap', params: [P('duration')], gsapLogic: `      const boxes = ref.current.querySelectorAll('[data-b]');\n      tl = gsap.timeline({ repeat: -1 });\n      tl.to(boxes[0], { x: 60, duration: params.duration / 4 })\n        .to(boxes[1], { x: 60, duration: params.duration / 4 }, '<0.2')\n        .to(boxes[2], { x: 60, duration: params.duration / 4 }, '<0.2')\n        .to(boxes, { x: 0, duration: params.duration / 4 }, '+=0.3');`, content: '<div data-b className={styles.b1}>1</div><div data-b className={styles.b2}>2</div><div data-b className={styles.b3}>3</div>', css: `.container { display: flex; flex-direction: column; gap: 8px; width: 100%; height: 100%; align-items: flex-start; justify-content: center; padding: 24px; box-sizing: border-box; }\n.b1, .b2, .b3 { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; }\n.b1 { background: hsl(280 90% 60%); }\n.b2 { background: hsl(200 90% 60%); }\n.b3 { background: hsl(320 90% 60%); }` });
effects.push({ id: 'gsap-stagger', type: 'gsap', params: [P('stagger')], gsapLogic: `      const items = ref.current.querySelectorAll('[data-item]');\n      tl = gsap.fromTo(items, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: params.stagger, repeat: -1, repeatDelay: 1 });`, content: '<div data-item className={styles.item}>A</div><div data-item className={styles.item}>B</div><div data-item className={styles.item}>C</div><div data-item className={styles.item}>D</div><div data-item className={styles.item}>E</div>', css: `.container { display: flex; gap: 8px; width: 100%; height: 100%; align-items: center; justify-content: center; }\n.item { width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(135deg, hsl(280 90% 60%), hsl(200 90% 60%)); color: white; display: flex; align-items: center; justify-content: center; font-weight: 900; }` });
effects.push({ id: 'lottie-checkmark', type: 'svg', params: [P('duration')], vars: [{n:'--duration',v:`${'${params.duration}'}s`}], svgContent: '<svg viewBox="0 0 100 100" className={styles.check}><circle className={styles.c} cx="50" cy="50" r="44" fill="none" stroke="hsl(140 80% 50%)" strokeWidth="4"/><path className={styles.mark} d="M30 52 L45 66 L72 36" fill="none" stroke="hsl(140 80% 50%)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></svg>', css: `.panel { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; box-sizing: border-box; padding: 32px; border-radius: 12px; background: linear-gradient(135deg, hsl(250 60% 12%), hsl(280 50% 15%)); }\n.check { width: 120px; height: 120px; }\n.c { stroke-dasharray: 276; stroke-dashoffset: 276; animation: drawC var(--duration, 0.8s) ease-out forwards; }\n.mark { stroke-dasharray: 60; stroke-dashoffset: 60; animation: drawM var(--duration, 0.8s) ease-out var(--duration, 0.8s) forwards; }\n@keyframes drawC { to { stroke-dashoffset: 0; } }\n@keyframes drawM { to { stroke-dashoffset: 0; } }` });
effects.push({ id: 'physics-gravity', type: 'canvas', params: [P('gravity')], logic: `    type B = { x: number; y: number; vx: number; vy: number; r: number; c: string };\n    const balls: B[] = [];\n    for (let i = 0; i < 8; i++) balls.push({ x: Math.random() * c.width, y: 50, vx: (Math.random() - 0.5) * 4, vy: 0, r: 12 + Math.random() * 8, c: 'hsl(' + Math.random() * 360 + ' 90% 60%)' });\n    const tick = () => {\n      ctx.clearRect(0, 0, c.width, c.height);\n      for (const b of balls) {\n        b.vy += params.gravity; b.x += b.vx; b.y += b.vy;\n        if (b.y + b.r > c.height) { b.y = c.height - b.r; b.vy *= -0.8; }\n        if (b.x < b.r || b.x > c.width - b.r) b.vx *= -1;\n        ctx.fillStyle = b.c;\n        ctx.beginPath();\n        ctx.arc(b.x, b.y, b.r, 0, 7);\n        ctx.fill();\n      }\n      raf = requestAnimationFrame(tick);\n    };\n    tick();` });
effects.push({ id: 'physics-cloth', type: 'canvas', params: [P('resolution')], logic: `    const cols = params.resolution, rows = params.resolution, gap = 16;\n    type Pt = { x: number; y: number; px: number; py: number; pin: boolean };\n    const pts: Pt[] = [];\n    for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) pts.push({ x: col * gap, y: r * gap, px: col * gap, py: r * gap, pin: r === 0 });\n    const tick = () => {\n      ctx.clearRect(0, 0, c.width, c.height);\n      for (const p of pts) {\n        if (p.pin) continue;\n        const vx = (p.x - p.px) * 0.99, vy = (p.y - p.py) * 0.99;\n        p.px = p.x; p.py = p.y;\n        p.x += vx; p.y += vy + 0.3;\n      }\n      ctx.strokeStyle = 'hsl(280 90% 60%)';\n      for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {\n        const p = pts[r * cols + col];\n        if (col < cols - 1) { const q = pts[r * cols + col + 1]; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }\n        if (r < rows - 1) { const q = pts[(r + 1) * cols + col]; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }\n      }\n      raf = requestAnimationFrame(tick);\n    };\n    tick();` });
effects.push({ id: 'fractal-mandelbrot', type: 'canvas-static', params: [P('iterations')], logic: `    const img = ctx.createImageData(c.width, c.height);\n    const d = img.data;\n    for (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) {\n      let x = 0, y = 0, i = 0;\n      const cx = (px - c.width / 2) / 120 - 0.5, cy = (py - c.height / 2) / 120;\n      while (x * x + y * y < 4 && i < params.iterations) { const xt = x * x - y * y + cx; y = 2 * x * y + cy; x = xt; i++; }\n      const idx = (py * c.width + px) * 4;\n      const v = i === params.iterations ? 0 : (i * 8 % 256);\n      d[idx] = v; d[idx + 1] = v * 0.5; d[idx + 2] = 255 - v; d[idx + 3] = 255;\n    }\n    ctx.putImageData(img, 0, 0);` });
effects.push({ id: 'flow-field', type: 'canvas', params: [P('count')], logic: `    type P = { x: number; y: number };\n    const ps: P[] = [];\n    for (let i = 0; i < params.count; i++) ps.push({ x: Math.random() * c.width, y: Math.random() * c.height });\n    let t = 0;\n    const noise = (x: number, y: number) => Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.7);\n    const tick = () => {\n      ctx.fillStyle = 'rgba(10,10,30,0.05)';\n      ctx.fillRect(0, 0, c.width, c.height);\n      ctx.fillStyle = 'hsl(280 90% 70%)';\n      for (const p of ps) {\n        const a = noise(p.x, p.y) * 6.28;\n        p.x += Math.cos(a) * 1.5; p.y += Math.sin(a) * 1.5;\n        if (p.x < 0 || p.x > c.width || p.y < 0 || p.y > c.height) { p.x = Math.random() * c.width; p.y = Math.random() * c.height; }\n        ctx.fillRect(p.x, p.y, 1.5, 1.5);\n      }\n      t += 0.01;\n      raf = requestAnimationFrame(tick);\n    };\n    tick();` });
effects.push({ id: 'voronoi-art', type: 'canvas-static', params: [P('count')], logic: `    type Seed = { x: number; y: number; h: number };\n    const seeds: Seed[] = [];\n    for (let i = 0; i < params.count; i++) seeds.push({ x: Math.random() * c.width, y: Math.random() * c.height, h: Math.random() * 360 });\n    const img = ctx.createImageData(c.width, c.height);\n    const d = img.data;\n    for (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) {\n      let best = 0, bd = Infinity;\n      for (let i = 0; i < seeds.length; i++) {\n        const dx = px - seeds[i].x, dy = py - seeds[i].y;\n        const dist = dx * dx + dy * dy;\n        if (dist < bd) { bd = dist; best = i; }\n      }\n      const idx = (py * c.width + px) * 4;\n      const h = seeds[best].h;\n      d[idx] = h; d[idx + 1] = 150; d[idx + 2] = 150; d[idx + 3] = 255;\n    }\n    ctx.putImageData(img, 0, 0);` });

// ============= GENERATION =============

let count = 0;
for (const e of effects) {
  const dir = path.join(EFFECTS_DIR, e.id);
  fs.mkdirSync(dir, { recursive: true });

  let tsx = '';
  let css = '';

  switch (e.type) {
    case 'css-basic':
      tsx = tplCssBasic(e.id, e.cn, e.params, e.content, e.vars);
      css = genCssBasic(e.cn, e.css);
      break;
    case 'css-text':
      tsx = tplCssText(e.id, e.cn, e.params, e.content, e.vars);
      css = genCssText(e.cn, e.css);
      break;
    case 'css-text-data':
      tsx = tplCssTextData(e.id, e.cn, e.params, e.content, e.vars);
      css = genCssText(e.cn, e.css);
      break;
    case 'css-chars':
      tsx = tplCssChars(e.id, e.cn, e.params, e.text, e.vars, e.delay);
      css = genCssText(e.cn, e.css);
      break;
    case 'css-words':
      tsx = tplCssWords(e.id, e.cn, e.params, e.words, e.vars);
      css = genCssText(e.cn, e.css);
      break;
    case 'typewriter':
      tsx = tplTypewriter(e.id, e.cn, e.params, e.text, e.multi);
      css = `.panel {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n  padding: 32px;\n  border-radius: 12px;\n  background: linear-gradient(135deg, hsl(250 60% 12%), hsl(280 50% 15%));\n}\n.${e.cn} {\n${e.css.split('\n').map(l => '  ' + l).join('\n')}\n}`;
      break;
    case 'svg-text':
      tsx = `'use client';\nimport { PreviewFrame } from '../_shared/PreviewFrame';\nimport styles from './${e.id}.module.css';\nexport default function ${pascal(e.id)}({ params }: { params: { ${e.params.map(p => `${p.key}: number`).join('; ')} } }) {\n  return (\n    <PreviewFrame>\n      <div className={styles.panel}>\n        <svg viewBox="0 0 300 80" style={{ width: '100%', maxWidth: 400 }}>\n          <text className={styles['${e.cn}']} x="150" y="60" textAnchor="middle" style={{ ${e.vars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}>${e.content}</text>\n        </svg>\n      </div>\n    </PreviewFrame>\n  );\n}\n`;
      css = `.panel {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  box-sizing: border-box;\n  padding: 32px;\n  border-radius: 12px;\n  background: linear-gradient(135deg, hsl(250 60% 12%), hsl(280 50% 15%));\n}\n.${e.cn} {\n${e.css.split('\n').map(l => '  ' + l).join('\n')}\n}`;
      break;
    case 'svg':
      tsx = `'use client';\nimport { PreviewFrame } from '../_shared/PreviewFrame';\nimport styles from './${e.id}.module.css';\nexport default function ${pascal(e.id)}({ params }: { params: { ${e.params.map(p => `${p.key}: number`).join('; ')} } }) {\n  return (\n    <PreviewFrame>\n      <div className={styles.panel} style={{ ${e.vars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}>\n        ${e.svgContent}\n      </div>\n    </PreviewFrame>\n  );\n}\n`;
      css = e.css;
      break;
    case 'hover':
      tsx = tplHover(e.id, e.cn, e.params, e.inner, e.vars, e.hint);
      css = e.css;
      break;
    case 'hover-multi':
      tsx = `'use client';\nimport { PreviewFrame } from '../_shared/PreviewFrame';\nimport styles from './${e.id}.module.css';\nexport default function ${pascal(e.id)}({ params }: { params: { ${e.params.map(p => `${p.key}: number`).join('; ')} } }) {\n  return (\n    <PreviewFrame>\n      <div className={styles.wrap}>\n        <div className={styles['${e.cn}']} style={{ ${e.vars.map(v => `['${v.n}' as any]: \`${v.v}\``).join(', ')} }}>\n          ${e.inner || ''}\n        </div>\n        <span className={styles.hint}>${e.hint}</span>\n      </div>\n    </PreviewFrame>\n  );\n}\n`;
      css = e.css;
      break;
    case 'click':
      tsx = tplClick(e.id, e.cn, e.params, e.content, e.clickLogic, e.hint);
      css = e.css;
      break;
    case 'click-count':
      tsx = tplClickCount(e.id, e.cn, e.params, e.content, e.clickLogic, e.hint);
      css = e.css;
      break;
    case 'drag':
      tsx = tplDrag(e.id, e.cn, e.params, e.inner, e.dragLogic, e.hint);
      css = e.css;
      break;
    case 'scroll':
      tsx = tplScroll(e.id, e.cn, e.params, e.inner, e.scrollLogic, e.hint);
      css = e.css;
      break;
    case 'mousemove':
      tsx = tplMouseMove(e.id, e.cn, e.params, e.inner, e.mouseLogic, e.hint);
      css = e.css;
      break;
    case 'canvas':
      tsx = tplCanvas(e.id, e.params, e.logic);
      css = genCssCanvas();
      break;
    case 'canvas-static':
      tsx = tplCanvas(e.id, e.params, '    ' + e.logic.split('\n').join('\n    '));
      css = genCssCanvas();
      break;
    case 'three':
      tsx = tplThree(e.id, e.params, e.setup, e.anim);
      css = genCssCanvas();
      break;
    case 'webgl':
      tsx = tplWebgl(e.id, e.params, e.frag);
      css = genCssCanvas();
      break;
    case 'gsap':
      tsx = tplGsap(e.id, e.params, e.gsapLogic, e.content);
      css = e.css;
      break;
  }

  fs.writeFileSync(path.join(dir, 'index.tsx'), tsx);
  fs.writeFileSync(path.join(dir, `${e.id}.module.css`), css);
  count++;
}

console.log(`Generated ${count} effect components.`);
