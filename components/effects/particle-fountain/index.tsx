'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './particle-fountain.module.css';

export default function ParticleFountain({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(ref, () => {
    type P = { x: number; y: number; vx: number; vy: number; c: string; s: number; life: number };
    let ps: P[] = [];
    const spawn = (w: number, h: number): P => ({
      x: w / 2 + (Math.random() - 0.5) * 30,
      y: h + 4,
      vx: (Math.random() - 0.5) * 3.5,
      vy: -Math.random() * 9 - 4,
      c: `hsl(${Math.random() * 360}, 90%, 65%)`,
      s: 2 + Math.random() * 3,
      life: 1,
    });
    let initW = 0;
    let initH = 0;
    return {
      onTick: ({ ctx, w, h }) => {
        if (initW !== w || initH !== h) {
          initW = w; initH = h;
          ps = [];
        }
        // 补全粒子到目标数量
        while (ps.length < params.count) ps.push(spawn(w, h));
        // 拖尾 — 半透明覆盖
        ctx.fillStyle = 'rgba(8, 10, 25, 0.22)';
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i];
          p.vy += 0.22;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.003;
          if (p.y > h || p.life <= 0) {
            ps[i] = spawn(w, h);
            continue;
          }
          // 圆形粒子（替代之前的方块）— 视觉更柔和
          ctx.fillStyle = p.c;
          ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      },
    };
  });
  return (
    <PreviewFrame category="advanced" label="✦ 拖动卡片重播">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
