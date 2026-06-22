'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './physics-cloth.module.css';

type Pt = { x: number; y: number; px: number; py: number; pin: boolean };

export default function PhysicsCloth({ params }: { params: { resolution: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      const cols = params.resolution;
      const rows = params.resolution;
      const gap = 16;
      const pts: Pt[] = [];
      let initW = 0;
      let initH = 0;
      let offsetX = 0;
      let offsetY = 0;
      const init = (w: number, h: number) => {
        offsetX = w / 2 - (cols * gap) / 2;
        offsetY = h * 0.15;
        pts.length = 0;
        for (let r = 0; r < rows; r++) {
          for (let col = 0; col < cols; col++) {
            pts.push({
              x: offsetX + col * gap,
              y: offsetY + r * gap,
              px: offsetX + col * gap,
              py: offsetY + r * gap,
              pin: r === 0,
            });
          }
        }
      };
      return {
        onTick: ({ ctx, w, h }) => {
          if (initW !== w || initH !== h) {
            initW = w;
            initH = h;
            init(w, h);
          }
          // 深色背景
          ctx.fillStyle = '#0a0a1a';
          ctx.fillRect(0, 0, w, h);
          // 物理步进
          for (const p of pts) {
            if (p.pin) continue;
            const vx = (p.x - p.px) * 0.99;
            const vy = (p.y - p.py) * 0.99;
            p.px = p.x;
            p.py = p.y;
            p.x += vx;
            p.y += vy + 0.3;
            // 边界
            if (p.x < 0) p.x = 0;
            if (p.x > w) p.x = w;
            if (p.y > h) p.y = h;
          }
          // 多层线（粗细递减 + 颜色渐变）
          for (let pass = 0; pass < 3; pass++) {
            ctx.lineWidth = 3 - pass;
            ctx.strokeStyle = pass === 0
              ? 'rgba(180, 100, 255, 0.4)'
              : pass === 1
                ? 'rgba(220, 130, 255, 0.7)'
                : 'rgba(255, 200, 255, 0.9)';
            for (let r = 0; r < rows; r++) {
              for (let col = 0; col < cols; col++) {
                const p = pts[r * cols + col];
                if (col < cols - 1) {
                  const q = pts[r * cols + col + 1];
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(q.x, q.y);
                  ctx.stroke();
                }
                if (r < rows - 1) {
                  const q = pts[(r + 1) * cols + col];
                  ctx.beginPath();
                  ctx.moveTo(p.x, p.y);
                  ctx.lineTo(q.x, q.y);
                  ctx.stroke();
                }
              }
            }
          }
          // 节点
          for (const p of pts) {
            ctx.fillStyle = 'rgba(255, 220, 255, 0.85)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
          // 固定点（顶部）
          for (let col = 0; col < cols; col++) {
            const p = pts[col];
            ctx.fillStyle = 'rgba(255, 150, 100, 0.9)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
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
