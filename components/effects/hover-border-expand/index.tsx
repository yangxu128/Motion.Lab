'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-border-expand.module.css';
export default function HoverBorderExpand({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['border-expand']} style={{ ['--duration' as any]: `${params.duration}s` }}>EXPAND</div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
