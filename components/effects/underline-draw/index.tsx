'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './underline-draw.module.css';
export default function UnderlineDraw({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <a className={styles.a} style={{ ['--duration' as any]: `${params.duration}s` }}>HOVER LINK</a>
    </PreviewFrame>
  );
}
