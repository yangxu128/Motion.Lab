'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './scale-pulse.module.css';
export default function ScalePulse({ params }: { params: { duration: number; min: number; max: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.dot} style={{ ['--duration' as any]: `${params.duration}s`, ['--min' as any]: String(params.min), ['--max' as any]: String(params.max) }} />
    </PreviewFrame>
  );
}
