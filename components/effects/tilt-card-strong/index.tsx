'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './tilt-card-strong.module.css';
export default function TiltCardStrong({ params }: { params: { max: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * params.max * 2}deg) rotateX(${-y * params.max * 2}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return (
    <PreviewFrame>
      <div ref={ref} className={styles.card} onMouseMove={onMove} onMouseLeave={onLeave}>STRONG TILT</div>
      <span className={styles.hint}>Move mouse</span>
    </PreviewFrame>
  );
}
