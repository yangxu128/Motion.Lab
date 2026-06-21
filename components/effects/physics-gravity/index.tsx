'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './physics-gravity.module.css';
export default function PhysicsGravity({ params }: { params: { gravity: number } }) {
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
    type B = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    const balls: B[] = [];
    for (let i = 0; i < 8; i++) balls.push({ x: Math.random() * c.width, y: 50, vx: (Math.random() - 0.5) * 4, vy: 0, r: 12 + Math.random() * 8, c: 'hsl(' + Math.random() * 360 + ' 90% 60%)' });
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const b of balls) {
        b.vy += params.gravity; b.x += b.vx; b.y += b.vy;
        if (b.y + b.r > c.height) { b.y = c.height - b.r; b.vy *= -0.8; }
        if (b.x < b.r || b.x > c.width - b.r) b.vx *= -1;
        ctx.fillStyle = b.c;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, 7);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [params.gravity]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
