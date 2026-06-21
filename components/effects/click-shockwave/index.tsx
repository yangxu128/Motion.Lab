'use client';
import { MouseEvent, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './click-shockwave.module.css';
export default function ClickShockwave({ params }: { params: { duration: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const w = document.createElement('span');
    w.className = styles.wave;
    w.style.left = (e.clientX - r.left) + 'px';
    w.style.top = (e.clientY - r.top) + 'px';
    w.style.width = w.style.height = '20px';
    el.appendChild(w);
    setTimeout(() => w.remove(), params.duration * 1000);
  };
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['shockwave']} onClick={handleClick} style={{ ['--duration' as any]: `${params.duration}s` }}>CLICK</div>
        <span className={styles.hint}>Click</span>
      </div>
    </PreviewFrame>
  );
}
