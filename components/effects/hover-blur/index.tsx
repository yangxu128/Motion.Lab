'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-blur.module.css';
export default function HoverBlur({ params }: { params: { blur: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['hover-blur']} style={{ ['--blur' as any]: `${params.blur}px` }}>
          <div className={styles.bg}></div><div className={styles.fg}>HOVER</div>
        </div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
