'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './gradient-text.module.css';
export default function GradientText({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles.gradient} style={{ ['--duration' as any]: `${params.duration}s` }}>COLOR</h1>
      </div>
    </PreviewFrame>
  );
}
