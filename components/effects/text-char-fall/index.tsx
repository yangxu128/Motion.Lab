'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-char-fall.module.css';
const TEXT = 'FALL';
export default function TextCharFall({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['char-fall']} style={{ ['--duration' as any]: `${params.duration}s` }}>
          {[...TEXT].map((ch, i) => (
            <span key={i} style={{ animationDelay: `0.1s * ${i}` }}>{ch}</span>
          ))}
        </h1>
      </div>
    </PreviewFrame>
  );
}
