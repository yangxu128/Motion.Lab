'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-scale.module.css';
export default function HoverScale({ params }: { params: { scale: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['hover-scale']} style={{ ['--scale' as any]: `${params.scale}` }}>HOVER</div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
