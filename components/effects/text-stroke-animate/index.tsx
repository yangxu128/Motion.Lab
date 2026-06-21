'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-stroke-animate.module.css';
export default function TextStrokeAnimate({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <svg viewBox="0 0 300 80" style={{ width: '100%', maxWidth: 400 }}>
          <text className={styles['stroke-text']} x="150" y="60" textAnchor="middle" style={{ ['--duration' as any]: `${params.duration}s` }}>STROKE</text>
        </svg>
      </div>
    </PreviewFrame>
  );
}
