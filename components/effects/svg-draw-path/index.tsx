'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './svg-draw-path.module.css';
export default function SvgDrawPath({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel} style={{ ['--duration' as any]: `${params.duration}s` }}>
        <svg viewBox="0 0 200 100" className={styles.svg}><path className={styles.p} d="M10,80 C40,10 70,90 100,40 S160,90 190,30" fill="none" stroke="hsl(280 90% 60%)" strokeWidth="3"/></svg>
      </div>
    </PreviewFrame>
  );
}
