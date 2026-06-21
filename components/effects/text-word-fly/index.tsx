'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-word-fly.module.css';
const WORDS = ["Motion","Lab","Effects"];
export default function TextWordFly({ params }: { params: { duration: number; stagger: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['word-fly']} style={{ ['--duration' as any]: `${params.duration}s`, ['--stagger' as any]: `${params.stagger}s` }}>
          {WORDS.map((w, i) => <span key={i}>{w}</span>)}
        </h1>
      </div>
    </PreviewFrame>
  );
}
