'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-wave-3d.module.css';
const TEXT = 'WAVE';
export default function TextWave3d({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['wave-3d']} style={{ ['--duration' as any]: `${params.duration}s` }}>
          {[...TEXT].map((ch, i) => (
            <span key={i} style={{ animationDelay: `0.08s * ${i}` }}>{ch}</span>
          ))}
        </h1>
      </div>
    </PreviewFrame>
  );
}
