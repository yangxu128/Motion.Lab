'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fade-out.module.css';
export default function FadeOut({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>Fade Out</div>
    </PreviewFrame>
  );
}
