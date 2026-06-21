'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './wave-text.module.css';
const TEXT = 'WAVE';
export default function WaveText({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <span className={styles.wave} style={{ ['--duration' as any]: `${params.duration}s` }}>
        {TEXT.split('').map((c, i) => <span key={i}>{c}</span>)}
      </span>
    </PreviewFrame>
  );
}
