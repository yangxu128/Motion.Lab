'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-icon-spin.module.css';
export default function HoverIconSpin({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <button className={styles.btn} style={{ ['--duration' as any]: `${params.duration}s` }}><span className={styles.icon}>⚙</span></button>
    </PreviewFrame>
  );
}
