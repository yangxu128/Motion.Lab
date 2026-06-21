'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './tada.module.css';
export default function Tada({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['tada']} style={{ ['--duration' as any]: `${params.duration}s` }}>Tada!</div>
      </div>
    </PreviewFrame>
  );
}
