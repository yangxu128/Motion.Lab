'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './bounce-down.module.css';
export default function BounceDown({ params }: { params: { duration: number; distance: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['bounce-down']} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>Bounce</div>
      </div>
    </PreviewFrame>
  );
}
