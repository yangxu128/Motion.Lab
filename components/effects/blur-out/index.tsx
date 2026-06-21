'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './blur-out.module.css';
export default function BlurOut({ params }: { params: { duration: number; blur: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['blur-out']} style={{ ['--duration' as any]: `${params.duration}s`, ['--blur' as any]: `${params.blur}px` }}>Pulse</div>
      </div>
    </PreviewFrame>
  );
}
