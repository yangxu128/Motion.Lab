'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './physics-cloth.module.css';
export default function PhysicsCloth({ params }: { params: { resolution: number } }) {
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
    const cols = params.resolution, rows = params.resolution, gap = 16;
    type Pt = { x: number; y: number; px: number; py: number; pin: boolean };
    const pts: Pt[] = [];
    for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) pts.push({ x: col * gap, y: r * gap, px: col * gap, py: r * gap, pin: r === 0 });
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const p of pts) {
        if (p.pin) continue;
        const vx = (p.x - p.px) * 0.99, vy = (p.y - p.py) * 0.99;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + 0.3;
      }
      ctx.strokeStyle = 'hsl(280 90% 60%)';
      for (let r = 0; r < rows; r++) for (let col = 0; col < cols; col++) {
        const p = pts[r * cols + col];
        if (col < cols - 1) { const q = pts[r * cols + col + 1]; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        if (r < rows - 1) { const q = pts[(r + 1) * cols + col]; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [params.resolution]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
