'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-flip-3d.module.css';
export default function TextFlip3D({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <h1 className={styles.t} style={{ ['--duration' as any]: `${params.duration}s` }}>FLIP</h1>
      </div>
    </PreviewFrame>
  );
}
