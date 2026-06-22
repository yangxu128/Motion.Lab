// lib/use-three-scene.ts — 抽离 Three.js 动效的样板：renderer/scene/camera + ResizeObserver + cleanup + 统一 rAF
'use client';
import { useEffect, type RefObject } from 'react';
import * as THREE from 'three';

export interface UseThreeSceneOptions {
  fov?: number;
  cameraZ?: number;
  maxDpr?: number;
  /** 离屏时是否跳过 render（默认 true，省 GPU） */
  pauseOffscreen?: boolean;
}

export interface ThreeSceneCtx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

/**
 * 自动接管 Three.js 动效样板：
 *  - renderer/scene/camera/ResizeObserver/cleanup
 *  - 统一 rAF + render，离屏跳过
 *
 * @param setup 一次性初始化场景；返回 onTick（每帧调用）和可选 cleanup
 *   onTick: 每帧调用一次，调用方负责更新场景状态；hook 负责 render
 *   cleanup: 卸载时调用，清理 geometry/material 等
 */
export function useThreeScene(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  setup: (ctx: ThreeSceneCtx) => {
    onTick: () => void;
    cleanup?: () => void;
  },
  options: UseThreeSceneOptions = {},
  deps: unknown[] = []
): void {
  const { fov = 60, cameraZ = 5, maxDpr = 2, pauseOffscreen = true } = options;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
    camera.position.z = cameraZ;

    const resize = () => {
      const w = c.offsetWidth || 1;
      const h = c.offsetHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const { onTick, cleanup: setupCleanup } = setup({ scene, camera, renderer });

    let raf = 0;
    let running = true;
    const tick = () => {
      if (!running) return;
      if (pauseOffscreen) {
        const rect = c.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          raf = requestAnimationFrame(tick);
          return;
        }
      }
      onTick();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      setupCleanup?.();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
