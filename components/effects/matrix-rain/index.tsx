'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './matrix-rain.module.css';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789';

export default function MatrixRain({ params }: { params: { speed: number; density: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      const fontSize = 14;
      let drops: number[] = [];
      let initW = 0;
      let initH = 0;
      return {
        onTick: ({ ctx, w, h }) => {
          // 容器尺寸变化 → 重新排布列
          if (initW !== w || initH !== h) {
            initW = w;
            initH = h;
            const cols = Math.max(1, Math.floor((w / fontSize) * params.density));
            drops = new Array(cols);
            for (let i = 0; i < cols; i++) drops[i] = Math.random() * h / fontSize;
          }
          // 拖尾
          ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
          ctx.fillRect(0, 0, w, h);
          ctx.font = `${fontSize}px monospace`;
          for (let i = 0; i < drops.length; i++) {
            const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
            // 头部亮白，尾部绿色
            const y = drops[i] * fontSize;
            ctx.fillStyle = 'rgba(180, 255, 200, 0.95)';
            ctx.fillText(ch, i * fontSize, y);
            // 拖尾的字符（随机褪色）
            ctx.fillStyle = `hsla(140, 100%, ${50 + Math.random() * 25}%, ${0.5 + Math.random() * 0.3})`;
            ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * fontSize, y - fontSize);
            if (y > h && Math.random() > 0.975) drops[i] = 0;
            drops[i] += params.speed / 3;
          }
        },
      };
    },
    { pauseOffscreen: true, maxDpr: 1 }
  );
  return (
    <PreviewFrame category="advanced">
      <canvas ref={ref} className={styles.canvas} />
    </PreviewFrame>
  );
}
