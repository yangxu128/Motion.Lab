'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-neon.module.css';
export default function TextNeon({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-neon']} style={{ ['--duration' as any]: `${params.duration}s` }}>NEON</h1>
      </div>
    </PreviewFrame>
  );
}
