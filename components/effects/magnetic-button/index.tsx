'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './magnetic-button.module.css';
export default function MagneticButton({ params }: { params: { radius: number } }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < params.radius) {
        const pull = 1 - dist / params.radius;
        ref.current.style.transform = `translate(${dx * 0.3 * pull}px, ${dy * 0.3 * pull}px)`;
      } else {
        ref.current.style.transform = '';
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [params.radius]);
  return (
    <PreviewFrame>
      <div className={styles.stage}>
        <button ref={ref} className={styles.btn}>PRESS</button>
      </div>
    </PreviewFrame>
  );
}
