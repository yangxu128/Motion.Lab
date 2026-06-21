'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './scale-out.module.css';
export default function ScaleOut({ params }: { params: { duration: number; from: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['scale-out']} style={{ ['--duration' as any]: `${params.duration}s`, ['--from' as any]: `${params.from}` }}>Scale</div>
      </div>
    </PreviewFrame>
  );
}
