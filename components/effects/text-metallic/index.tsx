'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-metallic.module.css';
export default function TextMetallic({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-metallic']} style={{ ['--duration' as any]: `${params.duration}s` }}>METAL</h1>
      </div>
    </PreviewFrame>
  );
}
