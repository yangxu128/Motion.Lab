'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './metaball.module.css';
type Ball = { el: HTMLDivElement; x: number; y: number; vx: number; vy: number; size: number };
export default function Metaball({ params }: { params: { count: number; blur: number } }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mb = wrapRef.current;
    if (!mb) return;
    const balls: Ball[] = [];
    for (let i = 0; i < params.count; i++) {
      const b = document.createElement('div');
      b.className = styles.ball;
      const size = 60 + Math.random() * 40;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      const colors = ['hsl(280 90% 60%)', 'hsl(320 90% 60%)', 'hsl(180 90% 55%)', 'hsl(50 90% 60%)'];
      b.style.background = colors[i % 4];
      mb.appendChild(b);
      balls.push({ el: b, x: Math.random() * Math.max(0, mb.offsetWidth - size), y: Math.random() * Math.max(0, mb.offsetHeight - size), vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, size });
    }
    let raf = 0;
    const w = () => mb.offsetWidth;
    const h = () => mb.offsetHeight;
    const tick = () => {
      for (const b of balls) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < 0 || b.x > w() - b.size) b.vx *= -1;
        if (b.y < 0 || b.y > h() - b.size) b.vy *= -1;
        b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      while (mb.firstChild) mb.removeChild(mb.firstChild);
    };
  }, [params.count, params.blur]);
  return (
    <PreviewFrame>
      <div ref={wrapRef} className={styles.wrap} style={{ ['--blur' as any]: `${params.blur}px` }} />
    </PreviewFrame>
  );
}
