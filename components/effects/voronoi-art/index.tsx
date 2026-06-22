'use client';
import { useRef } from 'react';
import { useCanvas2D } from '@/lib/use-canvas-2d';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './voronoi-art.module.css';

type Seed = { x: number; y: number; h: number; s: number; l: number };

export default function VoronoiArt({ params }: { params: { count: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvas2D(
    ref,
    () => {
      // 降采样到 1/4 像素以提速
      const SCALE = 0.25;
      const seeds: Seed[] = [];
      let img: ImageData | null = null;
      let sw = 0;
      let sh = 0;
      let initW = 0;
      let initH = 0;
      return {
        onTick: ({ ctx, w, h }) => {
          const nw = Math.max(1, Math.floor(w * SCALE));
          const nh = Math.max(1, Math.floor(h * SCALE));
          if (initW !== w || initH !== h) {
            initW = w; initH = h;
            seeds.length = 0;
            for (let i = 0; i < params.count; i++) {
              seeds.push({
                x: Math.random() * w,
                y: Math.random() * h,
                h: Math.random() * 360,
                s: 60 + Math.random() * 35,
                l: 30 + Math.random() * 35,
              });
            }
          }
          if (nw !== sw || nh !== sh || !img) {
            sw = nw; sh = nh;
            img = ctx.createImageData(sw, sh);
          }
          const d = img.data;
          // 坐标需要从画布坐标系转换到 nw/nh 坐标系
          const sx = nw / w;
          const sy = nh / h;
          for (let py = 0; py < sh; py++) {
            for (let px = 0; px < sw; px++) {
              let best = 0;
              let bd = Infinity;
              for (let i = 0; i < seeds.length; i++) {
                const dx = px - seeds[i].x * sx;
                const dy = py - seeds[i].y * sy;
                const dist = dx * dx + dy * dy;
                if (dist < bd) { bd = dist; best = i; }
              }
              const idx = (py * sw + px) * 4;
              const sd = seeds[best];
              // 把 hsl 转 rgb（粗略版本）
              const hue = sd.h / 360;
              const [r, g, b] = hslToRgb(hue, sd.s / 100, sd.l / 100);
              d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = 255;
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

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
