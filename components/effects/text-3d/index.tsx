'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-3d.module.css';
export default function Text3D({ params }: { params: { layers: number; depth: number } }) {
  return (
    <PreviewFrame>
      <h1 className={styles.t} data-text="3D" style={{ ['--depth' as any]: `${params.depth}px` }}>3D</h1>
    </PreviewFrame>
  );
}
