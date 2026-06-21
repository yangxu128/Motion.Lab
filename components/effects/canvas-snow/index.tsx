'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-snow.module.css';
export default function CanvasSnow({ params }: { params: { count: number } }) {
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
    type F = { x: number; y: number; r: number; s: number; w: number };
    const flakes: F[] = [];
    for (let i = 0; i < params.count; i++) flakes.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: 1 + Math.random() * 3, s: 0.5 + Math.random() * 1.5, w: Math.random() * 2 - 1 });
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = 'white';
      for (const f of flakes) {
        f.y += f.s; f.x += f.w;
        if (f.y > c.height) f.y = 0;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, 7);
        ctx.fill();
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
