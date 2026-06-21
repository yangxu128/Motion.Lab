'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './slide-down.module.css';
export default function SlideDown({ params }: { params: { duration: number; distance: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>Slide Down</div>
    </PreviewFrame>
  );
}
