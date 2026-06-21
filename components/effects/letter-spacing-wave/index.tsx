'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './letter-spacing-wave.module.css';
export default function LetterSpacingWave({ params }: { params: { duration: number; max: number } }) {
  return (
    <PreviewFrame>
      <h1 className={styles.t} style={{ ['--duration' as any]: `${params.duration}s`, ['--max' as any]: `${params.max}px` }}>BREATHE</h1>
    </PreviewFrame>
  );
}
