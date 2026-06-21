'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './split-char.module.css';
const TEXT = 'SPLIT';
export default function SplitChar({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <h1 className={styles.split} style={{ ['--duration' as any]: `${params.duration}s` }}>
        {TEXT.split('').map((c, i) => <span key={i}>{c}</span>)}
      </h1>
    </PreviewFrame>
  );
}
