'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './noise-flow.module.css';

export default function NoiseFlow({ params }: { params: { speed: number; scale: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      // 降采样到 1/4 像素以降低 ImageData 写入开销
      const SCALE = 0.25;
      const noise = (x: number, y: number) => {
        const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return s - Math.floor(s);
      };
      const smoothNoise = (x: number, y: number) => {
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        const fx = x - ix;
        const fy = y - iy;
        const a = noise(ix, iy);
        const b = noise(ix + 1, iy);
        const e = noise(ix, iy + 1);
        const d = noise(ix + 1, iy + 1);
        const u = fx * fx * (3 - 2 * fx);
        const v = fy * fy * (3 - 2 * fy);
        return a + (b - a) * u + (e - a) * v + (a - b - e + d) * u * v;
      };
      let t = 0;
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
          for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
              const n = smoothNoise(x * params.scale + t, y * params.scale - t);
              const idx = (y * sw + x) * 4;
              const v = Math.floor(n * 255);
              // 紫蓝色调：noise 强度 → rgb
              d[idx] = Math.floor(120 + (1 - n) * 100);     // R: 暖
              d[idx + 1] = Math.floor(60 + n * 100);         // G: 中
              d[idx + 2] = Math.floor(180 + n * 75);         // B: 冷
              d[idx + 3] = 255;
              // 亮度通过 RGB 共同反映
              if (v < 128) d[idx + 2] = 255 - v * 2;
              else d[idx] = 0;
            }
          }
          // 将降采样的 image data 拉伸到全画布
          // 临时缩小 ctx → putImageData → 恢复
          ctx.save();
          ctx.setTransform(1 / SCALE, 0, 0, 1 / SCALE, 0, 0);
          ctx.putImageData(img, 0, 0);
          ctx.restore();
          t += params.speed * 10;
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
