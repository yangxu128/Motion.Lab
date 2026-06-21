'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './rotate-360.module.css';
export default function Rotate360({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.icon} style={{ ['--duration' as any]: `${params.duration}s` }}>⟳</div>
    </PreviewFrame>
  );
}
