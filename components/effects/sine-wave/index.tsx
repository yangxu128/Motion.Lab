'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './sine-wave.module.css';

export default function SineWave({ params }: { params: { frequency: number; amplitude: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      let t = 0;
      return {
        onTick: ({ ctx, w, h }) => {
          // 深色背景
          ctx.fillStyle = '#0a0a1a';
          ctx.fillRect(0, 0, w, h);
          // 网格线
          ctx.strokeStyle = 'rgba(100, 80, 200, 0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let x = 0; x < w; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
          for (let y = 0; y < h; y += 40) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
          ctx.stroke();
          // 中线
          ctx.strokeStyle = 'rgba(200, 180, 255, 0.4)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(0, h / 2);
          ctx.lineTo(w, h / 2);
          ctx.stroke();
          ctx.setLineDash([]);
          // 渐变描边线
          const grad = ctx.createLinearGradient(0, 0, w, 0);
          grad.addColorStop(0, 'hsl(280 90% 55%)');
          grad.addColorStop(0.5, 'hsl(330 90% 60%)');
          grad.addColorStop(1, 'hsl(200 90% 60%)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const y = h / 2 + Math.sin(x * params.frequency + t) * params.amplitude * 2;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          // 沿曲线的辉光点
          for (let i = 0; i < 6; i++) {
            const x = ((t * 60 + i * w / 6) % w);
            const y = h / 2 + Math.sin(x * params.frequency + t) * params.amplitude * 2;
            ctx.fillStyle = 'rgba(255, 200, 255, 0.85)';
            ctx.beginPath();
            ctx.arc(x, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
          t += 0.05;
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
