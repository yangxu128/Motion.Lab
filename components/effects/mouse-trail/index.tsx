'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './mouse-trail.module.css';
export default function MouseTrail({ params }: { params: { count: number; size: number } }) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;
    const dots = dotsRef.current;
    const history: { x: number; y: number }[] = [];
    const onMove = (e: MouseEvent) => {
      const r = zone.getBoundingClientRect();
      history.unshift({ x: e.clientX - r.left, y: e.clientY - r.top });
      if (history.length > params.count) history.pop();
      for (let i = 0; i < dots.length; i++) {
        const p = history[i] || history[history.length - 1];
        if (!p) continue;
        const d = dots[i];
        d.style.left = (p.x - params.size / 2) + 'px';
        d.style.top = (p.y - params.size / 2) + 'px';
        d.style.opacity = String(Math.max(0, 1 - i / params.count));
      }
    };
    zone.addEventListener('mousemove', onMove);
    return () => zone.removeEventListener('mousemove', onMove);
  }, [params.count, params.size]);
  return (
    <PreviewFrame>
      <div ref={zoneRef} className={styles.zone}>
        {Array.from({ length: params.count }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) dotsRef.current[i] = el;
            }}
            className={styles.dot}
            style={{ width: params.size, height: params.size, background: `hsl(${(i * 30) % 360} 90% 60%)` }}
          />
        ))}
      </div>
    </PreviewFrame>
  );
}
