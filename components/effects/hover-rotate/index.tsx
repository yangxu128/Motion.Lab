'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-rotate.module.css';
export default function HoverRotate({ params }: { params: { angle: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['hover-rotate']} style={{ ['--angle' as any]: `${params.angle}deg` }}>ROTATE</div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
