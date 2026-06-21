'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-glitch-rgb.module.css';
const TEXT = 'RGB';
export default function TextGlitchRgb({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['rgb-glitch']} data-text={TEXT} style={{ ['--duration' as any]: `${params.duration}s` }}>{TEXT}</h1>
      </div>
    </PreviewFrame>
  );
}
