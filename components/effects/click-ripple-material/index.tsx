'use client';
import { MouseEvent, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './click-ripple-material.module.css';
export default function ClickRippleMaterial({ params }: { params: { duration: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const rip = document.createElement('span');
    rip.className = styles.ripple;
    rip.style.left = (e.clientX - r.left) + 'px';
    rip.style.top = (e.clientY - r.top) + 'px';
    rip.style.width = rip.style.height = '20px';
    el.appendChild(rip);
    setTimeout(() => rip.remove(), params.duration * 1000);
  };
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div ref={ref} className={styles['mat-ripple']} onClick={handleClick} style={{ ['--duration' as any]: `${params.duration}s` }}>CLICK</div>
        <span className={styles.hint}>Click</span>
      </div>
    </PreviewFrame>
  );
}
