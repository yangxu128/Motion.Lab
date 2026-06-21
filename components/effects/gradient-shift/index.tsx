'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './gradient-shift.module.css';
export default function GradientShift({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['gradient-shift']} style={{ ['--duration' as any]: `${params.duration}s` }}>Flow</div>
      </div>
    </PreviewFrame>
  );
}
