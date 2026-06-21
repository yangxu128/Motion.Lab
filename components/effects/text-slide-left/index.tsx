'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-slide-left.module.css';
export default function TextSlideLeft({ params }: { params: { duration: number; distance: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-slide-left']} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>SLIDE</h1>
      </div>
    </PreviewFrame>
  );
}
