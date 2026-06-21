'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './mask-reveal.module.css';
export default function MaskReveal({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <h1 className={styles.reveal} style={{ ['--duration' as any]: `${params.duration}s` }}>MOTION</h1>
    </PreviewFrame>
  );
}
