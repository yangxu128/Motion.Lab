// lib/use-webgl.ts — 抽离 WebGL 动效的样板：shader 编译/program/buffer/resize/cleanup/离屏暂停
'use client';
import { useEffect, type RefObject } from 'react';

export interface UseWebGLOptions {
  /** 离屏时是否跳过 render（默认 true） */
  pauseOffscreen?: boolean;
  /** DPR 上限，默认 2 */
  maxDpr?: number;
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function linkProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export interface WebGLCtx {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
}

/**
 * 自动接管 WebGL 样板：编译 shader / 链接 program / 满屏三角形 buffer / resize / cleanup / 离屏暂停。
 *
 * @param vertSrc 顶点 shader 源码
 * @param fragSrc 片元 shader 源码
 * @param setup 一次性初始化：返回 { onTick(t), cleanup? }。在 setup 中可调用 getUniformLocation
 *   并保存到闭包内供 onTick 使用。
 */
export function useWebGL(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  vertSrc: string,
  fragSrc: string,
  setup: (ctx: WebGLCtx) => {
    onTick: (t: number, w: number, h: number) => void;
    cleanup?: () => void;
  },
  options: UseWebGLOptions = {}
): void {
  const { pauseOffscreen = true, maxDpr = 2 } = options;

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const gl = c.getContext('webgl');
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;
    const program = linkProgram(gl, vs, fs);
    if (!program) return;
    gl.useProgram(program);

    // 满屏三角形
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const start = performance.now();
    let raf = 0;
    let running = true;
    let cw = 0;
    let ch = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      cw = Math.floor((c.offsetWidth || 1) * dpr);
      ch = Math.floor((c.offsetHeight || 1) * dpr);
      c.width = cw;
      c.height = ch;
      gl.viewport(0, 0, cw, ch);
    };
    resize();

    const { onTick, cleanup: setupCleanup } = setup({ gl, program });

    const render = (now: number) => {
      if (!running) return;
      if (pauseOffscreen) {
        const rect = c.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) {
          raf = requestAnimationFrame(render);
          return;
        }
      }
      // 每帧检查 resize（容器尺寸可能在变）
      const ow = c.offsetWidth || 1;
      const oh = c.offsetHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const nw = Math.floor(ow * dpr);
      const nh = Math.floor(oh * dpr);
      if (nw !== cw || nh !== ch) {
        cw = nw; ch = nh;
        c.width = cw; c.height = ch;
        gl.viewport(0, 0, cw, ch);
      }
      onTick((now - start) / 1000, cw, ch);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      setupCleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
