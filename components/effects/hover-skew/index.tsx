'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-skew.module.css';
export default function HoverSkew({ params }: { params: { angle: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['hover-skew']} style={{ ['--angle' as any]: `${params.angle}deg` }}>SKEW</div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
