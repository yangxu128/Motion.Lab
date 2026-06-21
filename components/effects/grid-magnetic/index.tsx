'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './grid-magnetic.module.css';

const ROWS = 6;
const COLS = 12;
const STEP = 22;
const DOT = 6;

export default function GridMagnetic({ params }: { params: { radius: number } }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const dots = dotsRef.current;

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const idx = i;
        const r = idx / COLS;
        const c = idx % COLS;
        const cx = c * STEP + STEP / 2;
        const cy = r * STEP + STEP / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < params.radius) {
          const pull = (1 - dist / params.radius) * 0.6;
          d.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
          d.style.background = 'hsl(280 90% 60%)';
        } else {
          d.style.transform = '';
          d.style.background = '';
        }
      }
    };

    const onLeave = () => {
      for (const d of dots) {
        d.style.transform = '';
        d.style.background = '';
      }
    };

    wrap.addEventListener('mousemove', onMove);
    wrap.addEventListener('mouseleave', onLeave);
    return () => {
      wrap.removeEventListener('mousemove', onMove);
      wrap.removeEventListener('mouseleave', onLeave);
    };
  }, [params.radius]);

  const cells = Array.from({ length: ROWS * COLS }, (_, i) => i);

  return (
    <PreviewFrame>
      <div ref={wrapRef} className={styles.wrap}>
        {cells.map((i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) dotsRef.current[i] = el;
            }}
            className={styles.dot}
            style={{ left: (i % COLS) * STEP + (STEP - DOT) / 2, top: Math.floor(i / COLS) * STEP + (STEP - DOT) / 2 }}
          />
        ))}
      </div>
    </PreviewFrame>
  );
}
