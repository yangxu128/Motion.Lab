'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './audio-wave.module.css';
export default function AudioWave({ params }: { params: { bars: number; speed: number } }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const bars: HTMLDivElement[] = [];
    for (let i = 0; i < params.bars; i++) {
      const b = document.createElement('div');
      b.className = styles.bar;
      wrap.appendChild(b);
      bars.push(b);
    }
    let t = 0;
    let raf = 0;
    const tick = () => {
      t += params.speed;
      for (let i = 0; i < bars.length; i++) {
        const h = 30 + Math.abs(Math.sin(t + i * 0.4)) * 70;
        bars[i].style.height = h + '%';
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      while (wrap.firstChild) wrap.removeChild(wrap.firstChild);
    };
  }, [params.bars, params.speed]);
  return (
    <PreviewFrame>
      <div ref={wrapRef} className={styles.wrap} />
    </PreviewFrame>
  );
}
