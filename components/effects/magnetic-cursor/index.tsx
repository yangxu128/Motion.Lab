'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './magnetic-cursor.module.css';
export default function MagneticCursor({ params }: { params: { strength: number } }) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <PreviewFrame>
      <button
        ref={ref}
        className={styles.btn}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const r = ref.current.getBoundingClientRect();
          ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * params.strength}px, ${(e.clientY - r.top - r.height / 2) * params.strength}px)`;
        }}
        onMouseLeave={() => { if (ref.current) ref.current.style.transform = ''; }}
      >Hover me</button>
    </PreviewFrame>
  );
}
