'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './color-cycle.module.css';
export default function ColorCycle({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['color-cycle']} style={{ ['--duration' as any]: `${params.duration}s` }}>Cycle</div>
      </div>
    </PreviewFrame>
  );
}
