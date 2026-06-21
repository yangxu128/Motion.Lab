'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fractal-mandelbrot.module.css';
export default function FractalMandelbrot({ params }: { params: { iterations: number } }) {
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
        const img = ctx.createImageData(c.width, c.height);
        const d = img.data;
        for (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) {
          let x = 0, y = 0, i = 0;
          const cx = (px - c.width / 2) / 120 - 0.5, cy = (py - c.height / 2) / 120;
          while (x * x + y * y < 4 && i < params.iterations) { const xt = x * x - y * y + cx; y = 2 * x * y + cy; x = xt; i++; }
          const idx = (py * c.width + px) * 4;
          const v = i === params.iterations ? 0 : (i * 8 % 256);
          d[idx] = v; d[idx + 1] = v * 0.5; d[idx + 2] = 255 - v; d[idx + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [params.iterations]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
