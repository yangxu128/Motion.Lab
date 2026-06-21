'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './drag-scroll.module.css';
export default function DragScroll({ params }: { params: { duration: number } }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const state = useRef({ isDown: false, startX: 0, offset: 0, velocity: 0, lastX: 0, lastT: 0 });
  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const s = state.current;

    const onDown = (e: MouseEvent) => {
      s.isDown = true;
      s.startX = e.pageX - wrap.offsetLeft;
      s.lastX = e.pageX;
      s.lastT = performance.now();
      s.velocity = 0;
      inner.style.transition = 'none';
    };
    const onUp = () => {
      if (!s.isDown) return;
      s.isDown = false;
      inner.style.transition = `transform ${params.duration}s cubic-bezier(0.2, 0.8, 0.2, 1)`;
      s.offset += s.velocity * 8;
      const minOffset = -(inner.scrollWidth - wrap.clientWidth);
      s.offset = Math.min(0, Math.max(minOffset, s.offset));
      inner.style.transform = `translate3d(${s.offset}px, 0, 0)`;
    };
    const onMove = (e: MouseEvent) => {
      if (!s.isDown) return;
      e.preventDefault();
      const x = e.pageX - wrap.offsetLeft;
      const walk = x - s.startX;
      const now = performance.now();
      const dt = Math.max(1, now - s.lastT);
      s.velocity = (e.pageX - s.lastX) / dt;
      s.lastX = e.pageX;
      s.lastT = now;
      inner.style.transform = `translate3d(${s.offset + walk}px, 0, 0)`;
    };

    wrap.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mousemove', onMove);
    return () => {
      wrap.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mousemove', onMove);
    };
  }, [params.duration]);
  return (
    <PreviewFrame style={{ padding: 0, overflow: 'hidden' }}>
      <div ref={wrapRef} className={styles.wrap} style={{ ['--duration' as any]: `${params.duration}s` }}>
        <div ref={innerRef} className={styles.inner}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className={styles.item}>{n}</div>
          ))}
        </div>
      </div>
      <span className={styles.hint}>Drag me</span>
    </PreviewFrame>
  );
}
