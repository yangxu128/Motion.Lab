'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fractal-tree.module.css';

export default function FractalTree({ params }: { params: { depth: number; angle: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      let t = 0;
      const branch = (ctx: CanvasRenderingContext2D, x: number, y: number, len: number, ang: number, d: number) => {
        if (d <= 0 || len < 2) return;
        const x2 = x + Math.cos(ang) * len;
        const y2 = y + Math.sin(ang) * len;
        // 颜色随深度变化：从根部的暖色到叶尖的绿色
        const hue = 30 - d * 6;  // 深度大 → 冷色
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsl(${hue} 70% ${45 + d * 2}%)`;
        ctx.lineWidth = Math.max(0.5, d * 0.5);
        ctx.lineCap = 'round';
        ctx.stroke();
        const a = (params.angle * Math.PI) / 180;
        const sway = Math.sin(t * 0.8) * 0.04 * (params.depth - d);
        branch(ctx, x2, y2, len * 0.74, ang - a + sway, d - 1);
        branch(ctx, x2, y2, len * 0.74, ang + a + sway, d - 1);
      };
      return {
        onTick: ({ ctx, w, h }) => {
          // 渐变背景：日落感
          const sky = ctx.createLinearGradient(0, 0, 0, h);
          sky.addColorStop(0, 'rgba(20, 10, 40, 0.5)');
          sky.addColorStop(0.6, 'rgba(60, 30, 80, 0.4)');
          sky.addColorStop(1, 'rgba(120, 60, 100, 0.3)');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, w, h);
          // 地面
          ctx.fillStyle = 'rgba(40, 25, 60, 0.5)';
          ctx.fillRect(0, h * 0.85, w, h * 0.15);
          // 树
          ctx.save();
          ctx.translate(w / 2, h * 0.9);
          branch(ctx, 0, 0, Math.min(w, h) * 0.22, -Math.PI / 2 + Math.sin(t) * 0.05, params.depth);
          ctx.restore();
          t += 0.012;
        },
      };
    },
    { pauseOffscreen: true, maxDpr: 1.5 }
  );
  return (
    <PreviewFrame category="advanced">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
