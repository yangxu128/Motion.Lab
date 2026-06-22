'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './physics-gravity.module.css';

type B = { x: number; y: number; vx: number; vy: number; r: number; c: string };

export default function PhysicsGravity({ params }: { params: { gravity: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      const balls: B[] = [];
      let initW = 0;
      let initH = 0;
      return {
        onTick: ({ ctx, w, h }) => {
          if (initW !== w || initH !== h) {
            initW = w;
            initH = h;
            balls.length = 0;
            for (let i = 0; i < 8; i++) {
              balls.push({
                x: Math.random() * w,
                y: 50,
                vx: (Math.random() - 0.5) * 4,
                vy: 0,
                r: 12 + Math.random() * 8,
                c: `hsl(${Math.random() * 360} 95% 65%)`,
              });
            }
          }
          // 浅渐变背景
          const bg = ctx.createLinearGradient(0, 0, 0, h);
          bg.addColorStop(0, 'rgba(20, 12, 40, 0.4)');
          bg.addColorStop(1, 'rgba(8, 4, 20, 0.4)');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, w, h);
          for (const b of balls) {
            b.vy += params.gravity;
            b.x += b.vx;
            b.y += b.vy;
            if (b.y + b.r > h) { b.y = h - b.r; b.vy *= -0.8; }
            if (b.x < b.r || b.x > w - b.r) b.vx *= -1;
            // 球带辉光
            const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 1.5);
            g.addColorStop(0, b.c);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r * 1.5, 0, Math.PI * 2);
            ctx.fill();
            // 球主体
            ctx.fillStyle = b.c;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
          }
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
