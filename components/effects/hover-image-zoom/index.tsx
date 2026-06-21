'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-image-zoom.module.css';
export default function HoverImageZoom({ params }: { params: { scale: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['img-zoom']} style={{ ['--scale' as any]: `${params.scale}` }}>
          <div className={styles.img}></div>
        </div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
