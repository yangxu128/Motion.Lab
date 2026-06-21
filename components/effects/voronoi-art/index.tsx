'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './voronoi-art.module.css';
export default function VoronoiArt({ params }: { params: { count: number } }) {
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
        type Seed = { x: number; y: number; h: number };
        const seeds: Seed[] = [];
        for (let i = 0; i < params.count; i++) seeds.push({ x: Math.random() * c.width, y: Math.random() * c.height, h: Math.random() * 360 });
        const img = ctx.createImageData(c.width, c.height);
        const d = img.data;
        for (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) {
          let best = 0, bd = Infinity;
          for (let i = 0; i < seeds.length; i++) {
            const dx = px - seeds[i].x, dy = py - seeds[i].y;
            const dist = dx * dx + dy * dy;
            if (dist < bd) { bd = dist; best = i; }
          }
          const idx = (py * c.width + px) * 4;
          const h = seeds[best].h;
          d[idx] = h; d[idx + 1] = 150; d[idx + 2] = 150; d[idx + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [params.count]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
