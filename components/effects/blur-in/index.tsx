'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './blur-in.module.css';
export default function BlurIn({ params }: { params: { duration: number; blur: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['blur-in']} style={{ ['--duration' as any]: `${params.duration}s`, ['--blur' as any]: `${params.blur}px` }}>Blur</div>
      </div>
    </PreviewFrame>
  );
}
