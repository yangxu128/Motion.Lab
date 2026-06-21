'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './shadow-grow.module.css';
export default function ShadowGrow({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['shadow-grow']} style={{ ['--duration' as any]: `${params.duration}s` }}>Float</div>
      </div>
    </PreviewFrame>
  );
}
