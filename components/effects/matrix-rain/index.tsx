'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './matrix-rain.module.css';
export default function MatrixRain({ params }: { params: { speed: number; density: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const resize = () => {
      c.width = Math.floor(c.offsetWidth);
      c.height = Math.floor(c.offsetHeight);
      const fontSize = 14;
      const cols = Math.max(1, Math.floor(c.width / fontSize * params.density));
      drops.length = cols;
      for (let i = 0; i < cols; i++) drops[i] = Math.random() * c.height / 14;
    };
    const drops: number[] = [];
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';
    const fontSize = 14;
    resize();
    window.addEventListener('resize', resize);
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += params.speed / 3;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [params.speed, params.density]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
