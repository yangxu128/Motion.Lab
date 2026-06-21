'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-outline.module.css';
export default function TextOutline({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-outline']} style={{ ['--duration' as any]: `${params.duration}s` }}>OUTLINE</h1>
      </div>
    </PreviewFrame>
  );
}
