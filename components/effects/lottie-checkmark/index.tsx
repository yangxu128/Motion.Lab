'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './lottie-checkmark.module.css';
export default function LottieCheckmark({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel} style={{ ['--duration' as any]: `${params.duration}s` }}>
        <svg viewBox="0 0 100 100" className={styles.check}><circle className={styles.c} cx="50" cy="50" r="44" fill="none" stroke="hsl(140 80% 50%)" strokeWidth="4"/><path className={styles.mark} d="M30 52 L45 66 L72 36" fill="none" stroke="hsl(140 80% 50%)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </PreviewFrame>
  );
}
