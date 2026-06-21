'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-rotate-in.module.css';
export default function TextRotateIn({ params }: { params: { duration: number; stagger: number } }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const text = el.textContent || '';
    el.innerHTML = [...text].map((c) => `<span>${c}</span>`).join('');
  }, []);
  return (
    <PreviewFrame>
      <h1 ref={ref} className={styles.t} style={{ ['--duration' as any]: `${params.duration}s`, ['--stagger' as any]: `${params.stagger}s` }}>ROTATE</h1>
    </PreviewFrame>
  );
}
