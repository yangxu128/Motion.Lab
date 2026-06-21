'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-flip-card.module.css';
export default function HoverFlipCard({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.wrap}>
        <div className={styles['flip-card']} style={{ ['--duration' as any]: `${params.duration}s` }}>
          <div className={styles.flipInner}><div className={styles.front}>FRONT</div><div className={styles.back}>BACK</div></div>
        </div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
