'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fractal-mandelbrot.module.css';

export default function FractalMandelbrot({ params }: { params: { iterations: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      // 降采样到 1/3 像素以提速
      const SCALE = 0.33;
      let img: ImageData | null = null;
      let sw = 0;
      let sh = 0;
      return {
        onTick: ({ ctx, w, h }) => {
          const nw = Math.max(1, Math.floor(w * SCALE));
          const nh = Math.max(1, Math.floor(h * SCALE));
          if (nw !== sw || nh !== sh || !img) {
            sw = nw; sh = nh;
            img = ctx.createImageData(sw, sh);
          }
          const d = img.data;
          const max = params.iterations;
          for (let py = 0; py < sh; py++) {
            for (let px = 0; px < sw; px++) {
              let x = 0, y = 0, i = 0;
              const cx = (px - sw / 2) / (120 * SCALE) - 0.5;
              const cy = (py - sh / 2) / (120 * SCALE);
              while (x * x + y * y < 4 && i < max) {
                const xt = x * x - y * y + cx;
                y = 2 * x * y + cy;
                x = xt;
                i++;
              }
              const idx = (py * sw + px) * 4;
              if (i === max) {
                // 黑色（mandelbrot 内部）
                d[idx] = 8; d[idx + 1] = 4; d[idx + 2] = 24; d[idx + 3] = 255;
              } else {
                // 紫蓝渐变（按迭代次数）
                const v = i * 5;
                d[idx] = Math.min(255, v * 2);          // R
                d[idx + 1] = Math.min(255, v);          // G
                d[idx + 2] = Math.min(255, 255 - v);    // B
                d[idx + 3] = 255;
              }
            }
          }
          ctx.save();
          ctx.setTransform(1 / SCALE, 0, 0, 1 / SCALE, 0, 0);
          ctx.putImageData(img, 0, 0);
          ctx.restore();
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
