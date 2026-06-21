'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './flow-field.module.css';
export default function FlowField({ params }: { params: { count: number } }) {
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
    type P = { x: number; y: number };
    const ps: P[] = [];
    for (let i = 0; i < params.count; i++) ps.push({ x: Math.random() * c.width, y: Math.random() * c.height });
    let t = 0;
    const noise = (x: number, y: number) => Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.7);
    const tick = () => {
      ctx.fillStyle = 'rgba(10,10,30,0.05)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = 'hsl(280 90% 70%)';
      for (const p of ps) {
        const a = noise(p.x, p.y) * 6.28;
        p.x += Math.cos(a) * 1.5; p.y += Math.sin(a) * 1.5;
        if (p.x < 0 || p.x > c.width || p.y < 0 || p.y > c.height) { p.x = Math.random() * c.width; p.y = Math.random() * c.height; }
        ctx.fillRect(p.x, p.y, 1.5, 1.5);
      }
      t += 0.01;
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
