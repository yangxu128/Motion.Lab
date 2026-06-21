'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './scale-in.module.css';
export default function ScaleIn({ params }: { params: { duration: number; from: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['scale-in']} style={{ ['--duration' as any]: `${params.duration}s`, ['--from' as any]: `${params.from}` }}>Scale</div>
      </div>
    </PreviewFrame>
  );
}
