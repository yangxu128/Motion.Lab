'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './bounce-in.module.css';
export default function BounceIn({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>Bounce</div>
    </PreviewFrame>
  );
}
