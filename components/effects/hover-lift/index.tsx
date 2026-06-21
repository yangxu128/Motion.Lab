'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './hover-lift.module.css';
export default function HoverLift({ params }: { params: { lift: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.box} style={{ ['--lift' as any]: `${params.lift}px` }}>HOVER ME</div>
    </PreviewFrame>
  );
}
