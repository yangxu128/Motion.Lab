'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fade-in-down.module.css';
export default function FadeInDown({ params }: { params: { duration: number; distance: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['fade-in-down']} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>Hello</div>
      </div>
    </PreviewFrame>
  );
}
