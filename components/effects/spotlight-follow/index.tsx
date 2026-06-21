'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './spotlight-follow.module.css';
export default function SpotlightFollow({ params }: { params: { size: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.background = `radial-gradient(circle ${params.size}px at ${x}px ${y}px, rgba(255,255,255,0.28), #111 70%)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.background = '#111';
  };
  return (
    <PreviewFrame>
      <div ref={ref} className={styles.spot} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className={styles.inner}>SPOTLIGHT</div>
      </div>
    </PreviewFrame>
  );
}
