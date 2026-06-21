'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-fade-up.module.css';
export default function TextFadeUp({ params }: { params: { duration: number; distance: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-fade-up']} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>MOTION</h1>
      </div>
    </PreviewFrame>
  );
}
