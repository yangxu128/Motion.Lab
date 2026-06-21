'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-image-distort.module.css';
export default function HoverImageDistort({ params }: { params: { amount: number } }) {
  const scale = Math.round(params.amount * 1000);
  return (
    <PreviewFrame style={{ padding: 0 }}>
      <div className={styles.wrap}>
        <svg className={styles.svgDefs} aria-hidden="true">
          <defs>
            <filter id="hover-distort-filter">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3" />
              <feDisplacementMap in="SourceGraphic" scale={scale} />
            </filter>
          </defs>
        </svg>
        <div className={styles.distort}>HOVER</div>
        <span className={styles.hint}>Hover</span>
      </div>
    </PreviewFrame>
  );
}
