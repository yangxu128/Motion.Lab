'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './flip-y.module.css';
export default function FlipY({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['flip-y']} style={{ ['--duration' as any]: `${params.duration}s` }}>↻</div>
      </div>
    </PreviewFrame>
  );
}
