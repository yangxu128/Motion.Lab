'use client';
import { MouseEvent } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './ripple-click.module.css';
export default function RippleClick({ params }: { params: { duration: number } }) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.left = `${e.clientX - r.left}px`;
    ripple.style.top = `${e.clientY - r.top}px`;
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    e.currentTarget.appendChild(ripple);
    setTimeout(() => ripple.remove(), params.duration * 1000);
  };
  return (
    <PreviewFrame>
      <button className={styles.btn} style={{ ['--duration' as any]: `${params.duration}s` }} onClick={handleClick}>
        Click
      </button>
      <span className={styles.hint}>Click me</span>
    </PreviewFrame>
  );
}
