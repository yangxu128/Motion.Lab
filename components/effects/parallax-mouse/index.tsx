'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './parallax-mouse.module.css';
export default function ParallaxMouse({ params }: { params: { intensity: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <PreviewFrame style={{ padding: 0 }}>
      <div
        ref={ref}
        className={styles.wrap}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          ref.current.querySelectorAll<HTMLDivElement>(`.${styles.layer}`).forEach((l) => {
            const d = Number(l.dataset.depth);
            l.style.transform = `translate(${x * d * params.intensity}px, ${y * d * params.intensity}px)`;
          });
        }}
      >
        <div className={`${styles.layer} ${styles.bg}`} data-depth="1" />
        <div className={`${styles.layer} ${styles.mid}`} data-depth="2" />
        <div className={`${styles.layer} ${styles.fg}`} data-depth="3" />
        <span className={styles.label}>PARALLAX</span>
        <span className={styles.hint}>Move mouse</span>
      </div>
    </PreviewFrame>
  );
}
