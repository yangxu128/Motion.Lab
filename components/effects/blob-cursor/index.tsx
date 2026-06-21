'use client';
import { useEffect, useRef } from 'react';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './blob-cursor.module.css';
export default function BlobCursor({ params }: { params: { size: number } }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.transform = `translate(${e.clientX - params.size / 2}px, ${e.clientY - params.size / 2}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [params.size]);
  return (
    <PreviewFrame style={{ padding: 0 }}>
      <div className={styles.stage}>
        <span className={styles.hint}>MOVE CURSOR</span>
        <div ref={ref} className={styles.blob} style={{ width: params.size, height: params.size }} />
      </div>
    </PreviewFrame>
  );
}
