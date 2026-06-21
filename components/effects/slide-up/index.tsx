'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './slide-up.module.css';
export default function SlideUp({ params }: { params: { duration: number; distance: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>Slide Up</div>
    </PreviewFrame>
  );
}
