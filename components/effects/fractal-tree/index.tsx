'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fractal-tree.module.css';
export default function FractalTree({ params }: { params: { depth: number; angle: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const resize = () => {
      c.width = c.offsetWidth * 2;
      c.height = c.offsetHeight * 2;
    };
    resize();
    window.addEventListener('resize', resize);
    let t = 0;
    const branch = (x: number, y: number, len: number, ang: number, d: number) => {
      if (d <= 0 || len < 2) return;
      const x2 = x + Math.cos(ang) * len;
      const y2 = y + Math.sin(ang) * len;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsl(${(10 - d) * 22} 70% 50%)`;
      ctx.lineWidth = d;
      ctx.stroke();
      branch(x2, y2, len * 0.75, ang - params.angle * Math.PI / 180, d - 1);
      branch(x2, y2, len * 0.75, ang + params.angle * Math.PI / 180, d - 1);
    };
    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      t += 0.01;
      ctx.save();
      ctx.translate(c.width / 2, c.height);
      branch(0, 0, 220, -Math.PI / 2 + Math.sin(t) * 0.05, params.depth);
      ctx.restore();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [params.depth, params.angle]);
  return (
    <PreviewFrame>
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
