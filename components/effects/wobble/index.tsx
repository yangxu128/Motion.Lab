'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './wobble.module.css';
export default function Wobble({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['wobble']} style={{ ['--duration' as any]: `${params.duration}s` }}>Wobble</div>
      </div>
    </PreviewFrame>
  );
}
