'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-text-reveal.module.css';
export default function HoverTextReveal({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['text-reveal']} style={{ ['--duration' as any]: `${params.duration}s` }}>
          HOVER<div className={styles.hidden}>REVEALED</div>
        </div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
