'use client';
import { useRef } from 'react';
import { useWebGL } from '@/lib/use-webgl';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './shader-fireball.module.css';

const VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv - 0.5;
  float r = length(p);
  float n = hash(p * 8.0 + u_time);
  // 多层噪声叠加 → 火球纹理
  float n2 = hash(p * 16.0 - u_time * 1.3);
  float heat = exp(-r * 4.0) * (0.7 + 0.3 * sin(u_time * 2.0 + r * 12.0));
  vec3 col = mix(vec3(1.0, 0.4, 0.05), vec3(0.9, 0.05, 0.0), uv.y);
  col += vec3(1.0, 0.85, 0.3) * n * 0.5;
  col += vec3(0.5, 0.1, 0.0) * n2;
  col *= 0.4 + heat * 1.4;
  gl_FragColor = vec4(col, 1.0);
}`;

export default function ShaderFireball({ params }: { params: { speed: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useWebGL(
    ref,
    VERT,
    FRAG,
    ({ gl, program }) => {
      const uTime = gl.getUniformLocation(program, 'u_time');
      const uRes = gl.getUniformLocation(program, 'u_resolution');
      return {
        onTick: (t, w, h) => {
          gl.uniform1f(uTime, t * params.speed);
          gl.uniform2f(uRes, w, h);
        },
      };
    }
  );
  return (
    <PreviewFrame category="advanced">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
