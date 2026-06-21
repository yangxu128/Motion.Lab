'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './highlight-sweep.module.css';
export default function HighlightSweep({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <h1 className={styles.t} style={{ ['--duration' as any]: `${params.duration}s` }}>SWEEP</h1>
    </PreviewFrame>
  );
}
