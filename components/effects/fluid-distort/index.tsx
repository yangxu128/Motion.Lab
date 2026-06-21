'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './fluid-distort.module.css';
export default function FluidDistort({ params }: { params: { amount: number; speed: number } }) {
  return (
    <PreviewFrame>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <filter id="fd">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="3">
            <animate attributeName="baseFrequency" dur={`${6 / Math.max(0.1, params.speed)}s`} values="0.02;0.04;0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale={params.amount} />
        </filter>
      </svg>
      <div className={styles.fluid}>FLUID</div>
    </PreviewFrame>
  );
}
