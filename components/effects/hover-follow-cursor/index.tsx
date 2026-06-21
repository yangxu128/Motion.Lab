'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-follow-cursor.module.css';
export default function HoverFollowCursor({ params }: { params: { speed: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dot = el.querySelector('[data-dot]') as HTMLElement;
    let tx = 0, ty = 0, x = 0, y = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
    };
    el.addEventListener('mousemove', onMove);
    let raf = 0;
    const tick = () => {
      x += (tx - x) * params.speed;
      y += (ty - y) * params.speed;
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      raf = requestAnimationFrame(tick);
    };
    tick();
    const cleanup = () => {
      el.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
    return () => {
      cleanup();
    };
  }, [params.speed]);
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['follow-zone']}><div data-dot className={styles.dot}></div></div>
        <span className={styles.hint}>Move</span>
      </div>
    </PreviewFrame>
  );
}
