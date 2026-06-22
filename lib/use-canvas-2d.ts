// lib/use-canvas-2d.ts — 抽离 2D canvas 动效的样板：getContext + ResizeObserver + cleanup + 离屏暂停
'use client';
import { useEffect, type RefObject } from 'react';

export interface UseCanvas2DOptions {
  /** 像素比上限，默认 2 */
  maxDpr?: number;
  /** 离屏时是否跳过 render（默认 true） */
  pauseOffscreen?: boolean;
  /** 背景是否透明（默认 false — 填白底） */
  transparent?: boolean;
}

/**
 * 自动接管 2D canvas 的样板：getContext/ResizeObserver/cleanup/离屏暂停
 * @param canvasRef canvas 引用
 * @param setup 一次性初始化；返回 onTick（每帧调用）+ 可选 cleanup
 *   onTick: 接收 { ctx, w, h, dpr, t, dt }，调用方负责绘图
 */
export function useCanvas2D(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  setup: (init: { ctx: CanvasRenderingContext2D; dpr: number }) => {
    onTick: (state: { ctx: CanvasRenderingContext2D; w: number; h: number; dpr: number; t: number; dt: number }) => void;
    cleanup?: () => void;
  },
  options: UseCanvas2DOptions = {}
): void {
  const { maxDpr = 2, pauseOffscreen = true, transparent = false } = options;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = c.offsetWidth || 1;
      h = c.offsetHeight || 1;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const { onTick, cleanup: setupCleanup } = setup({ ctx, dpr });

    let raf = 0;
    let running = true;
    let lastT = performance.now();
    const tick = (now: number) => {
      if (!running) return;
      if (pauseOffscreen) {
        const rect = c.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          lastT = now;
          raf = requestAnimationFrame(tick);
          return;
        }
      }
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      const t = now / 1000;
      if (!transparent) {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
      onTick({ ctx, w, h, dpr, t, dt });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      setupCleanup?.();
    };
  }, []);
}
