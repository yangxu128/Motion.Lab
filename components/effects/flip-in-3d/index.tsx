'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './flip-in-3d.module.css';
export default function FlipIn3d({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['flip-in-3d']} style={{ ['--duration' as any]: `${params.duration}s` }}>3D</div>
      </div>
    </PreviewFrame>
  );
}
