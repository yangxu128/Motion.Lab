'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './marquee.module.css';
export default function Marquee({ params }: { params: { duration: number; direction: 'left' | 'right' } }) {
  return (
    <PreviewFrame>
      <div className={styles.marquee} data-direction={params.direction} style={{ ['--duration' as any]: `${params.duration}s` }}>
        <span>Motion.Lab · 动效实验室 · </span>
        <span>Motion.Lab · 动效实验室 · </span>
      </div>
    </PreviewFrame>
  );
}
