'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './jello.module.css';
export default function Jello({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--duration' as any]: `${params.duration}s` }}>JELLO</div>
    </PreviewFrame>
  );
}
