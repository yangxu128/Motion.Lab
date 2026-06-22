'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-ocean.module.css';

export default function CanvasOcean({ params }: { params: { speed: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      let t = 0;
      const wave = (ctx: CanvasRenderingContext2D, y: number, w: number, h: number, amp: number, freq: number, color: string) => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 4) ctx.lineTo(x, y + Math.sin(x * freq + t) * amp);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };
      return {
        onTick: ({ ctx, w, h }) => {
          // 渐变天空背景
          const sky = ctx.createLinearGradient(0, 0, 0, h);
          sky.addColorStop(0, '#0a1a4a');
          sky.addColorStop(0.6, '#0e2a6a');
          sky.addColorStop(1, '#162f80');
          ctx.fillStyle = sky;
          ctx.fillRect(0, 0, w, h);
          // 三层渐变波浪
          wave(ctx, h * 0.5, w, h, 18, 0.02, 'rgba(30, 80, 180, 0.7)');
          wave(ctx, h * 0.62, w, h, 14, 0.028, 'rgba(60, 130, 220, 0.78)');
          wave(ctx, h * 0.74, w, h, 10, 0.038, 'rgba(120, 200, 255, 0.85)');
          // 月光高光
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(w * 0.78, h * 0.18, 22, 0, Math.PI * 2);
          ctx.fill();
          // 月光水面反射
          for (let i = 0; i < 5; i++) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.18 - i * 0.03})`;
            const y = h * 0.5 + i * 14 + Math.sin(t * 0.5 + i) * 4;
            ctx.fillRect(w * 0.76, y, w * 0.04, 1.5);
          }
          t += params.speed;
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
