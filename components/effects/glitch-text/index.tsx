'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './glitch-text.module.css';
const TEXT = 'GLITCH';
export default function GlitchText({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <h1 className={styles.glitch} data-text={TEXT} style={{ ['--duration' as any]: `${params.duration}s` }}>{TEXT}</h1>
    </PreviewFrame>
  );
}
