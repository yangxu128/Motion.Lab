'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fade-in-right.module.css';
export default function FadeInRight({ params }: { params: { duration: number; distance: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['fade-in-right']} style={{ ['--duration' as any]: `${params.duration}s`, ['--distance' as any]: `${params.distance}px` }}>Hello</div>
      </div>
    </PreviewFrame>
  );
}
