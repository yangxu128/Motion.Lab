'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './vertical-marquee.module.css';
const LINE = '设计 · 设计 · 设计 · 设计';
export default function VerticalMarquee({ params }: { params: { duration: number } }) {
  return (
    <PreviewFrame>
      <div className={styles.vmarquee} style={{ ['--duration' as any]: `${params.duration}s` }}>
        <div>{LINE}</div>
        <div>{LINE}</div>
      </div>
    </PreviewFrame>
  );
}
