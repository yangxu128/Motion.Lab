'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-color-change.module.css';
export default function HoverColorChange({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['hover-color']} style={{ ['--duration' as any]: `${params.duration}s` }}>CHANGE</div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
