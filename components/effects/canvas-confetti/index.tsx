'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-confetti.module.css';

type P = { x: number; y: number; vx: number; vy: number; g: number; c: string; w: number; h: number };

export default function CanvasConfetti({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(c.offsetWidth * dpr);
      c.height = Math.floor(c.offsetHeight * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const make = (): P => ({
      x: c.width / 2 + (Math.random() - 0.5) * 40,
      y: c.height * 0.4,
      vx: (Math.random() - 0.5) * 8 * (c.width / 400),
      vy: Math.random() * -10 - 4,
      g: 0.35,
      c: `hsl(${Math.random() * 360} 90% 60%)`,
      w: 6 + Math.random() * 4,
      h: 8 + Math.random() * 6,
    });
    const particles: P[] = Array.from({ length: params.count }, make);

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of particles) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > c.height + 20) {
          const fresh = make();
          p.x = fresh.x;
          p.y = -10;
          p.vx = fresh.vx;
          p.vy = fresh.vy;
          p.g = fresh.g;
          p.c = fresh.c;
        }
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.w, p.h);
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
