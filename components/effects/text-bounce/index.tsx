'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-bounce.module.css';
const TEXT = 'BOUNCE';
export default function TextBounce({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-bounce']} style={{ ['--duration' as any]: `${params.duration}s` }}>
          {[...TEXT].map((ch, i) => (
            <span key={i} style={{ animationDelay: `0.1s * ${i}` }}>{ch}</span>
          ))}
        </h1>
      </div>
    </PreviewFrame>
  );
}
