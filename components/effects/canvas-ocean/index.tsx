'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-ocean.module.css';
export default function CanvasOcean({ params }: { params: { speed: number } }) {
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
    let t = 0;
    const wave = (y: number, amp: number, freq: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= c.width; x += 4) ctx.lineTo(x, y + Math.sin(x * freq + t) * amp);
      ctx.lineTo(c.width, c.height);
      ctx.lineTo(0, c.height);
      ctx.fillStyle = color;
      ctx.fill();
    };
    const tick = () => {
      ctx.fillStyle = '#0a1a3a';
      ctx.fillRect(0, 0, c.width, c.height);
      wave(c.height * 0.5, 16, 0.02, 'hsl(200 80% 40%)');
      wave(c.height * 0.62, 12, 0.03, 'hsl(210 80% 50%)');
      wave(c.height * 0.74, 8, 0.04, 'hsl(200 90% 60%)');
      t += params.speed;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [params.speed]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
