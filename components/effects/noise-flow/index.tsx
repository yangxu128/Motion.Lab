'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './noise-flow.module.css';
export default function NoiseFlow({ params }: { params: { speed: number; scale: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const resize = () => {
      c.width = Math.floor(c.offsetWidth);
      c.height = Math.floor(c.offsetHeight);
    };
    resize();
    window.addEventListener('resize', resize);
    const noise = (x: number, y: number) => {
      const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return s - Math.floor(s);
    };
    const smoothNoise = (x: number, y: number) => {
      const ix = Math.floor(x);
      const iy = Math.floor(y);
      const fx = x - ix;
      const fy = y - iy;
      const a = noise(ix, iy);
      const b = noise(ix + 1, iy);
      const e = noise(ix, iy + 1);
      const d = noise(ix + 1, iy + 1);
      const u = fx * fx * (3 - 2 * fx);
      const v = fy * fy * (3 - 2 * fy);
      return a + (b - a) * u + (e - a) * v + (a - b - e + d) * u * v;
    };
    let t = 0;
    let raf = 0;
    const draw = () => {
      const w = c.width;
      const h = c.height;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const n = smoothNoise(x * params.scale + t, y * params.scale - t);
          const idx = (y * w + x) * 4;
          const v = Math.floor(n * 255);
          d[idx] = v < 128 ? 255 - v * 2 : 0;
          d[idx + 1] = v;
          d[idx + 2] = 255 - v;
          d[idx + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      t += params.speed * 10;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [params.speed, params.scale]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
