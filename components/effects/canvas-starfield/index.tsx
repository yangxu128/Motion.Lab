'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-starfield.module.css';
export default function CanvasStarfield({ params }: { params: { count: number } }) {
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
    type S = { x: number; y: number; z: number };
    const stars: S[] = [];
    for (let i = 0; i < params.count; i++) stars.push({ x: (Math.random() - 0.5) * c.width, y: (Math.random() - 0.5) * c.height, z: Math.random() * c.width });
    const tick = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = 'white';
      for (const s of stars) {
        s.z -= 4;
        if (s.z <= 0) s.z = c.width;
        const k = 128 / s.z;
        const x = s.x * k + c.width / 2;
        const y = s.y * k + c.height / 2;
        const r = (1 - s.z / c.width) * 2;
        ctx.fillRect(x, y, r, r);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
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
