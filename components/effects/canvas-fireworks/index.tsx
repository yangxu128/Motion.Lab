'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-fireworks.module.css';

type P = { x: number; y: number; vx: number; vy: number; c: string; life: number; trail: { x: number; y: number }[] };

export default function CanvasFireworks({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      let ps: P[] = [];
      let frame = 0;
      let initW = 0;
      let initH = 0;
      const launch = (w: number, h: number) => {
        const x = Math.random() * w;
        const y = h * (0.25 + Math.random() * 0.35);
        const hue = Math.random() * 360;
        for (let i = 0; i < params.count; i++) {
          const a = (i / params.count) * Math.PI * 2;
          ps.push({
            x, y,
            vx: Math.cos(a) * (1.5 + Math.random() * 2.2),
            vy: Math.sin(a) * (1.5 + Math.random() * 2.2),
            c: `hsl(${hue} 95% 65%)`,
            life: 1,
            trail: [],
          });
        }
      };
      return {
        onTick: ({ ctx, w, h }) => {
          if (initW !== w || initH !== h) {
            initW = w;
            initH = h;
            ps = [];
            frame = 0;
          }
          frame++;
          if (frame % 72 === 0) launch(w, h);
          // 拖尾：半透明覆盖
          ctx.fillStyle = 'rgba(2, 2, 18, 0.22)';
          ctx.fillRect(0, 0, w, h);
          // 浅蓝渐变背景 — 增加夜空的层次
          const bg = ctx.createLinearGradient(0, 0, 0, h);
          bg.addColorStop(0, 'rgba(10, 8, 35, 0.4)');
          bg.addColorStop(1, 'rgba(20, 5, 40, 0.2)');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, w, h);
          ps = ps.filter((p) => p.life > 0);
          for (const p of ps) {
            p.vy += 0.04;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.013;
            // 拖尾记录
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 6) p.trail.shift();
            // 绘制拖尾
            for (let i = 0; i < p.trail.length; i++) {
              const t = p.trail[i];
              ctx.fillStyle = p.c;
              ctx.globalAlpha = (i / p.trail.length) * p.life * 0.5;
              ctx.beginPath();
              ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
            // 主体（圆形 + 辉光）
            ctx.fillStyle = p.c;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
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
