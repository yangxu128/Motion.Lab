'use client';
import { useRef } from 'react';
import { useWebGL } from '@/lib/use-webgl';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './shader-plasma.module.css';

const VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv - 0.5;
  float r = length(p);
  // 多层 sin 叠加 → 等离子
  float v = sin(uv.x * 12.0 + u_time) +
            sin(uv.y * 10.0 + u_time * 1.3) +
            sin((uv.x + uv.y) * 9.0 - u_time * 0.7) +
            sin(r * 18.0 - u_time * 2.0);
  v = v / 4.0;
  vec3 col = 0.5 + 0.5 * cos(u_time * 0.5 + vec3(0.0, 2.0, 4.0) + v * 3.5);
  // 中心稍亮、边缘稍暗，增加层次
  col *= 0.7 + 0.3 * (1.0 - r * 1.4);
  gl_FragColor = vec4(col, 1.0);
}`;

export default function ShaderPlasma({ params }: { params: { speed: number } }) {
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
