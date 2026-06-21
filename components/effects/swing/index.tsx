'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './swing.module.css';
export default function Swing({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.icon} style={{ ['--duration' as any]: `${params.duration}s` }}>⏰</div>
    </PreviewFrame>
  );
}
