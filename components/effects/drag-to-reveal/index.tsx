'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './drag-to-reveal.module.css';
export default function DragToReveal({ params }: { params: { duration: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let dragging = false, startX = 0, startPct = 0;
    const cover = el.querySelector('[data-cover]') as HTMLElement;
    const pct = () => { const m = cover.style.clipPath.match(/inset\(0 (\d+)%/); return m ? +m[1] : 0; };
    const onDown = (e: MouseEvent) => { dragging = true; startX = e.clientX; startPct = pct(); };
    const onMove = (e: MouseEvent) => {
      if (!dragging) return;
      const w = el.offsetWidth;
      let p = startPct + ((e.clientX - startX) / w) * 100;
      p = Math.max(0, Math.min(100, p));
      cover.style.clipPath = 'inset(0 ' + p + '% 0 0)';
    };
    const onUp = () => { dragging = false; };
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    const cleanup = () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    return () => {
      cleanup();
    };
  }, [params.duration]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['drag-reveal']}><div className={styles.under}>REVEALED</div><div data-cover className={styles.cover}>DRAG ME</div></div>
        <span className={styles.hint}>Drag</span>
      </div>
    </PreviewFrame>
  );
}
