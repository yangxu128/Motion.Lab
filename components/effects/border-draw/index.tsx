'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './border-draw.module.css';
export default function BorderDraw({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['border-draw']} style={{ ['--duration' as any]: `${params.duration}s` }}>Draw</div>
      </div>
    </PreviewFrame>
  );
}
