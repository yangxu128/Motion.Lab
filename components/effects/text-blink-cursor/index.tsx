'use client';
import { PreviewFrame } from '../_shared/PreviewFrame';
import styles from './text-blink-cursor.module.css';
export default function TextBlinkCursor({ params }: { params: { speed: number } }) {
  return (
    <PreviewFrame>
      <span className={styles.t} style={{ ['--speed' as any]: `${params.speed}s` }}>输入中</span>
    </PreviewFrame>
  );
}
