'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './particle-fountain.module.css';
export default function ParticleFountain({ params }: { params: { count: number } }) {
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
    type P = { x: number; y: number; vx: number; vy: number; c: string; s: number };
    const ps: P[] = [];
    const spawn = (): P => ({ x: c.width / 2, y: c.height, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 10 - 4, c: 'hsl(' + Math.random() * 360 + ' 90% 60%)', s: 3 + Math.random() * 3 });
    for (let i = 0; i < params.count; i++) ps.push(spawn());
    const tick = () => {
      ctx.fillStyle = 'rgba(10,10,30,0.2)';
      ctx.fillRect(0, 0, c.width, c.height);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.vy += 0.2; p.x += p.vx; p.y += p.vy;
        if (p.y > c.height) ps[i] = spawn();
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.s, p.s);
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
