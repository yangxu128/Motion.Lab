'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-zoom-in.module.css';
export default function TextZoomIn({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-zoom-in']} style={{ ['--duration' as any]: `${params.duration}s` }}>ZOOM</h1>
      </div>
    </PreviewFrame>
  );
}
