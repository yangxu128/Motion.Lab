'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-shadow-shift.module.css';
export default function TextShadowShift({ params }: { params: { duration: number; intensity: number } }) {
  return (
    <PreviewFrame>
      <h1 className={styles.t} style={{ ['--duration' as any]: `${params.duration}s`, ['--intensity' as any]: `${params.intensity}px` }}>SHADOW</h1>
    </PreviewFrame>
  );
}
