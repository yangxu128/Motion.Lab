'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './skew-in.module.css';
export default function SkewIn({ params }: { params: { duration: number; angle: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['skew-in']} style={{ ['--duration' as any]: `${params.duration}s`, ['--angle' as any]: `${params.angle}deg` }}>Skew</div>
      </div>
    </PreviewFrame>
  );
}
