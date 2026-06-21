'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-ice.module.css';
export default function TextIce({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-ice']} style={{ ['--duration' as any]: `${params.duration}s` }}>ICE</h1>
      </div>
    </PreviewFrame>
  );
}
