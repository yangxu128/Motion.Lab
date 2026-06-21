'use client';
import { useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './three-d-tilt.module.css';
export default function ThreeDTilt({ params }: { params: { max: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <PreviewFrame>
      <div
        ref={ref}
        className={styles.wrap}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          const inner = ref.current.querySelector(`.${styles.tilt}`) as HTMLDivElement | null;
          if (inner) inner.style.transform = `perspective(600px) rotateY(${x * params.max * 2}deg) rotateX(${-y * params.max * 2}deg)`;
        }}
        onMouseLeave={() => {
          if (!ref.current) return;
          const inner = ref.current.querySelector(`.${styles.tilt}`) as HTMLDivElement | null;
          if (inner) inner.style.transform = '';
        }}
      >
        <div className={styles.tilt}>TILT</div>
      </div>
    </PreviewFrame>
  );
}
