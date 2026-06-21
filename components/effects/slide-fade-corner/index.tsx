'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './slide-fade-corner.module.css';
export default function SlideFadeCorner({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box}>
        <div className={styles['corner-slide']} style={{ ['--duration' as any]: `${params.duration}s` }}>Corner</div>
      </div>
    </PreviewFrame>
  );
}
