'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-fire.module.css';
export default function TextFire({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel}>
        <h1 className={styles['text-fire']} style={{ ['--duration' as any]: `${params.duration}s` }}>FIRE</h1>
      </div>
    </PreviewFrame>
  );
}
