'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-rainbow-shift.module.css';
export default function TextRainbowShift({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['rainbow-shift']} style={{ ['--duration' as any]: `${params.duration}s` }}>RAINBOW</h1>
      </div>
    </PreviewFrame>
  );
}
