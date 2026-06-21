'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-fireworks.module.css';
export default function CanvasFireworks({ params }: { params: { count: number } }) {
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
    type P = { x: number; y: number; vx: number; vy: number; c: string; life: number };
    let ps: P[] = [];
    let frame = 0;
    const launch = () => {
      const x = Math.random() * c.width;
      const hue = Math.random() * 360;
      for (let i = 0; i < params.count; i++) {
        const a = (i / params.count) * 6.28;
        ps.push({ x, y: c.height * 0.4, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, c: 'hsl(' + hue + ' 90% 60%)', life: 1 });
      }
    };
    launch();
    const tick = () => {
      frame++;
      if (frame % 72 === 0) launch();
      ctx.fillStyle = 'rgba(0,0,20,0.2)';
      ctx.fillRect(0, 0, c.width, c.height);
      ps = ps.filter(p => p.life > 0);
      for (const p of ps) {
        p.vy += 0.05; p.x += p.vx; p.y += p.vy; p.life -= 0.015;
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
      ctx.globalAlpha = 1;
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
