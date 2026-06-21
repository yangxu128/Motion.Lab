'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-blur-reveal.module.css';
export default function TextBlurReveal({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-blur-reveal']} style={{ ['--duration' as any]: `${params.duration}s` }}>REVEAL</h1>
      </div>
    </PreviewFrame>
  );
}
