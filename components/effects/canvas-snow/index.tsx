'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-snow.module.css';

type F = { x: number; y: number; r: number; s: number; w: number };

export default function CanvasSnow({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      const flakes: F[] = [];
      let initW = 0;
      let initH = 0;
      return {
        onTick: ({ ctx, w, h }) => {
          // 容器尺寸变了 → 重新撒一遍雪花
          if (initW !== w || initH !== h || flakes.length === 0) {
            initW = w;
            initH = h;
            flakes.length = 0;
            for (let i = 0; i < params.count; i++) {
              flakes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 1 + Math.random() * 3,
                s: 0.4 + Math.random() * 1.4,
                w: Math.random() * 1.6 - 0.8,
              });
            }
          }
          // 深色渐变背景 + 拖尾，营造夜景雪意
          ctx.fillStyle = 'rgba(8, 10, 30, 0.35)';
          ctx.fillRect(0, 0, w, h);
          for (const f of flakes) {
            f.y += f.s;
            f.x += f.w + Math.sin(f.y * 0.04) * 0.3;
            if (f.y > h + 4) {
              f.y = -4;
              f.x = Math.random() * w;
            }
            // 圆形 + 辉光
            const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 2.5);
            g.addColorStop(0, 'rgba(255,255,255,0.95)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r * 2.5, 0, Math.PI * 2);
            ctx.fill();
            // 中心亮点
            ctx.fillStyle = 'rgba(255,255,255,1)';
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
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
