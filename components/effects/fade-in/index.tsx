'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fade-in.module.css';
export default function FadeIn({ params }: { params: { duration: number; delay: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s`, ['--delay' as any]: `${params.delay}s` }}>Fade In</div>
    </PreviewFrame>
  );
}
