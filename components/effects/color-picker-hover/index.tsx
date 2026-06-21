'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './color-picker-hover.module.css';
export default function ColorPickerHover({ params }: { params: { size: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <PreviewFrame style={{ padding: 0 }}>
      <div
        ref={ref}
        className={styles.wrap}
        style={{ ['--size' as any]: `${params.size}px` }}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const r = ref.current.getBoundingClientRect();
          ref.current.style.setProperty('--x', `${e.clientX - r.left}px`);
          ref.current.style.setProperty('--y', `${e.clientY - r.top}px`);
          ref.current.style.setProperty('--h', String(Math.floor(Math.random() * 360)));
        }}
      >
        <span className={styles.label}>HOVER ME</span>
      </div>
    </PreviewFrame>
  );
}
