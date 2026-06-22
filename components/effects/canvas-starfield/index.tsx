'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './canvas-starfield.module.css';

export default function CanvasStarfield({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(ref, ({ ctx }) => {
    type S = { x: number; y: number; z: number };
    const stars: S[] = [];
    return {
      onTick: ({ ctx, w, h, t }) => {
        // 懒初始化（在拿到 w/h 后再生成星点）
        if (stars.length === 0) {
          for (let i = 0; i < params.count; i++) {
            stars.push({ x: (Math.random() - 0.5) * w, y: (Math.random() - 0.5) * h, z: Math.random() * w });
          }
        }
        // 深色渐变背景 — 替代纯黑
        ctx.fillStyle = 'rgb(8, 10, 20)';
        ctx.fillRect(0, 0, w, h);
        // 缓速闪烁的紫色星云
        ctx.fillStyle = `hsla(280, 70%, 30%, ${0.18 + 0.06 * Math.sin(t * 0.4)})`;
        ctx.fillRect(0, 0, w, h);
        for (const s of stars) {
          s.z -= 2.5;
          if (s.z <= 0) {
            s.x = (Math.random() - 0.5) * w;
            s.y = (Math.random() - 0.5) * h;
            s.z = w;
          }
          const k = 128 / s.z;
          const x = s.x * k + w / 2;
          const y = s.y * k + h / 2;
          const r = Math.max(0.5, (1 - s.z / w) * 2.5);
          // 星星带辉光
          const alpha = (1 - s.z / w);
          ctx.fillStyle = `hsla(${50 + alpha * 200}, 80%, ${70 + alpha * 20}%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      },
    };
  });
  return (
    <PreviewFrame category="advanced" label="✦ 拖动卡片重播">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
