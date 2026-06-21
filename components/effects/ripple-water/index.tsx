'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './ripple-water.module.css';
export default function RippleWater({ params }: { params: { duration: number; count: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const water = ref.current;
    if (!water) return;
    const r = water.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    for (let i = 0; i < params.count; i++) {
      const ring = document.createElement('div');
      ring.className = styles.ring;
      ring.style.left = x + 'px';
      ring.style.top = y + 'px';
      ring.style.transition = `all ${params.duration}s ease-out ${i * 0.2}s`;
      water.appendChild(ring);
      requestAnimationFrame(() => {
        ring.style.width = 200 + i * 80 + 'px';
        ring.style.height = 200 + i * 80 + 'px';
        ring.style.opacity = '0';
      });
      setTimeout(() => ring.remove(), (params.duration + i * 0.2) * 1000 + 200);
    }
  };
  return (
    <PreviewFrame>
      <div ref={ref} className={styles.water} onClick={onClick}>
        <span className={styles.hint}>CLICK</span>
      </div>
    </PreviewFrame>
  );
}
