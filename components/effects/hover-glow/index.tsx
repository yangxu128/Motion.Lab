'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-glow.module.css';
export default function HoverGlow({ params }: { params: { intensity: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['hover-glow']} style={{ ['--intensity' as any]: `${params.intensity}px` }}>GLOW</div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
