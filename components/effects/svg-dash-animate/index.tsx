'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './svg-dash-animate.module.css';
export default function SvgDashAnimate({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.panel} style={{ ['--duration' as any]: `${params.duration}s` }}>
        <svg viewBox="0 0 200 100" className={styles.svg}><path className={styles.p} d="M10,50 L60,20 L110,80 L160,30 L190,60" fill="none" stroke="hsl(200 90% 55%)" strokeWidth="3" strokeDasharray="8 6"/></svg>
      </div>
    </PreviewFrame>
  );
}
