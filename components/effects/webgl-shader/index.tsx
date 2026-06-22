'use client';
import { useRef } from 'react';
import { useWebGL } from '@/lib/use-webgl';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './webgl-shader.module.css';

const VERT = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;  // 修正宽高比
  float r = length(p) * 1.4;
  float a = atan(p.y, p.x);
  float wave = 0.5 + 0.5 * sin(r * 12.0 - u_time * 2.0 + a * 3.0);
  vec3 col = 0.5 + 0.5 * cos(u_time * 0.4 + vec3(0.0, 2.0, 4.0) + r * 4.0);
  col = mix(col, vec3(uv.x, uv.y, wave), 0.55);
  // 中心辉光
  col += vec3(0.4, 0.2, 0.6) * exp(-r * 4.0) * 0.3;
  gl_FragColor = vec4(col, 1.0);
}`;

export default function WebglShader({ params }: { params: { speed: number } }) {
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
