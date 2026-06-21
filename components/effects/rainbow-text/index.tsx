'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './rainbow-text.module.css';
export default function RainbowText({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles.t} style={{ ['--duration' as any]: `${params.duration}s` }}>RAINBOW</h1>
      </div>
    </PreviewFrame>
  );
}
