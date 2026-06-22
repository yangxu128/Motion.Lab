'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-confetti.module.css';

type P = {
  x: number; y: number;
  vx: number; vy: number; g: number;
  c: string; w: number; h: number;
  rot: number; vr: number;
};

export default function CanvasConfetti({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      const make = (w: number, h: number): P => ({
        x: w / 2 + (Math.random() - 0.5) * 60,
        y: h * 0.35,
        vx: (Math.random() - 0.5) * 6 * (w / 400),
        vy: Math.random() * -8 - 3,
        g: 0.28,
        c: `hsl(${Math.random() * 360} 95% 65%)`,
        w: 5 + Math.random() * 4,
        h: 8 + Math.random() * 6,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.2,
      });
      let ps: P[] = [];
      let initW = 0;
      let initH = 0;
      return {
        onTick: ({ ctx, w, h }) => {
          if (initW !== w || initH !== h || ps.length === 0) {
            initW = w;
            initH = h;
            ps = Array.from({ length: params.count }, () => make(w, h));
          }
          // 浅紫渐变背景 — 代替之前的纯透明
          const bg = ctx.createLinearGradient(0, 0, 0, h);
          bg.addColorStop(0, 'rgba(40, 20, 80, 0.18)');
          bg.addColorStop(1, 'rgba(20, 5, 50, 0.18)');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, w, h);
          for (const p of ps) {
            p.vy += p.g;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            if (p.y > h + 20) {
              const fresh = make(w, h);
              Object.assign(p, fresh);
              p.y = -20;
            }
            // 旋转矩形
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
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
