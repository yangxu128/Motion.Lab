'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './flow-field.module.css';

type P = { x: number; y: number };

export default function FlowField({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      const ps: P[] = [];
      let initW = 0;
      let initH = 0;
      let t = 0;
      const noise = (x: number, y: number) =>
        Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.7);
      return {
        onTick: ({ ctx, w, h }) => {
          if (initW !== w || initH !== h || ps.length === 0) {
            initW = w;
            initH = h;
            ps.length = 0;
            for (let i = 0; i < params.count; i++) {
              ps.push({ x: Math.random() * w, y: Math.random() * h });
            }
          }
          // 拖尾：极淡紫黑
          ctx.fillStyle = 'rgba(8, 5, 30, 0.06)';
          ctx.fillRect(0, 0, w, h);
          for (const p of ps) {
            const a = noise(p.x, p.y) * Math.PI * 2;
            p.x += Math.cos(a) * 1.4;
            p.y += Math.sin(a) * 1.4;
            if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
              p.x = Math.random() * w;
              p.y = Math.random() * h;
            }
            // 颜色随时间变化（hue 随 t 漂移）
            ctx.fillStyle = `hsla(${(280 + t * 30) % 360}, 90%, 70%, 0.85)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
          t += 0.01;
        },
      };
    },
    { pauseOffscreen: true }
  );
  return (
    <PreviewFrame category="advanced">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
