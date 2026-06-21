'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-split-reveal.module.css';
const TEXT = 'SPLIT';
export default function TextSplitReveal({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['split-reveal']} data-text={TEXT} style={{ ['--duration' as any]: `${params.duration}s` }}>{TEXT}</h1>
      </div>
    </PreviewFrame>
  );
}
