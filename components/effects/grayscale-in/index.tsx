'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './grayscale-in.module.css';
export default function GrayscaleIn({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['grayscale-in']} style={{ ['--duration' as any]: `${params.duration}s` }}>Color</div>
      </div>
    </PreviewFrame>
  );
}
